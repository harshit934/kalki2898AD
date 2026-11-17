import bpy
import bmesh
import json
import math
import os
from mathutils import Vector
from mathutils.bvhtree import BVHTree


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
V07 = os.path.join(ROOT, 'phase3', 'likeness-sculpt', 'v07')
SOURCE_GLB = os.path.join(V07, 'rollback', 'v06-source-bhairava.glb')
BLEND_PATH = os.path.join(V07, 'work', 'bhairava-sculpt-groom-prototype.blend')
OUTPUT_GLB = os.path.join(V07, 'work', 'bhairava-v07-prototype.glb')
SCULPT_REPORT = os.path.join(V07, 'work', 'sculpt-groom-prototype.json')

def gaussian(value, center, width):
    return math.exp(-((value - center) / width) ** 2)


def create_material(name, color):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    shader = material.node_tree.nodes.get('Principled BSDF')
    if shader:
        shader.inputs['Base Color'].default_value = (*color, 1.0)
        shader.inputs['Roughness'].default_value = 0.82
    return material


def make_surface_tree(mesh_obj, skin_material_index):
    mesh = mesh_obj.data
    polygons = [polygon for polygon in mesh.polygons if polygon.material_index == skin_material_index]
    return BVHTree.FromPolygons(
        [vertex.co.copy() for vertex in mesh.vertices],
        [list(polygon.vertices) for polygon in polygons],
        all_triangles=False,
    )


def create_mesh_object(name, vertices, faces, material, armature, collection, bone_weights):
    used_vertices = sorted({index for face in faces for index in face})
    remap = {old: new for new, old in enumerate(used_vertices)}
    vertices = [vertices[index] for index in used_vertices]
    faces = [tuple(remap[index] for index in face) for face in faces]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    mesh.materials.append(material)
    obj.parent = armature
    modifier = obj.modifiers.new('Head and jaw rig', 'ARMATURE')
    modifier.object = armature
    head_group = obj.vertex_groups.new(name='Head')
    jaw_group = obj.vertex_groups.new(name='Jaw')
    for index, co in enumerate(vertices):
        jaw_weight = bone_weights(co)
        if 1.0 - jaw_weight > 0.0001:
            head_group.add([index], 1.0 - jaw_weight, 'REPLACE')
        if jaw_weight > 0.0001:
            jaw_group.add([index], jaw_weight, 'REPLACE')
    obj['v07_prototype_geometry'] = True
    return obj


def scalp_surface_point(tree, x, y, lift=0.0):
    result = tree.ray_cast(Vector((x, y, 2.15)), Vector((0.0, 0.0, -1.0)), 0.9)
    location, normal, _face_index, _distance = result
    if location is None:
        return None
    if normal.z < 0.0:
        normal.negate()
    if normal.z < 0.1 or location.z < 1.73:
        return None
    return location + normal * lift


def append_tube(vertices, faces, points, radius, sides=8):
    base = len(vertices)
    for index, point in enumerate(points):
        before = points[max(0, index - 1)]
        after = points[min(len(points) - 1, index + 1)]
        tangent = (after - before).normalized()
        reference = Vector((0.0, 1.0, 0.0))
        if abs(tangent.dot(reference)) > 0.94:
            reference = Vector((1.0, 0.0, 0.0))
        side = tangent.cross(reference).normalized()
        normal = tangent.cross(side).normalized()
        end_taper = min(1.0, 0.25 + 8.0 * index / max(1, len(points) - 1),
                        0.25 + 8.0 * (len(points) - 1 - index) / max(1, len(points) - 1))
        local_radius = radius * end_taper
        for side_index in range(sides):
            angle = 2.0 * math.pi * side_index / sides
            vertices.append(point + local_radius * (math.cos(angle) * side + math.sin(angle) * normal))
    for index in range(len(points) - 1):
        for side_index in range(sides):
            a = base + index * sides + side_index
            b = base + index * sides + (side_index + 1) % sides
            faces.append((a, b, b + sides, a + sides))


def add_groom_collection(scene):
    collection = bpy.data.collections.new('V07 Sculpt and Groom Prototype')
    scene.collection.children.link(collection)
    return collection


def build_scalp_groom(armature, collection, material, scalp_tree):
    vertices = []
    faces = []
    cache = {}

    def top_point(x, y, lift=0.0):
        key = (round(x, 4), round(y, 4), round(lift, 4))
        if key not in cache:
            cache[key] = scalp_surface_point(scalp_tree, x, y, lift)
        return cache[key]

    for index in range(21):
        lane = -0.087 + index * (0.174 / 20.0)
        start_y = -0.135 + 0.95 * abs(lane) + 0.005 * math.sin(index * 1.31)
        end_y = 0.015 + 0.006 * math.sin(index * 0.77)
        width = 0.009 + 0.0045 * (0.5 + 0.5 * math.sin(index * 1.83))
        rows = 17
        columns = 7
        base = len(vertices)
        row_valid = []
        for row in range(rows):
            t = row / (rows - 1)
            smooth_t = t * t * (3.0 - 2.0 * t)
            y = start_y + (end_y - start_y) * t
            center_x = lane * (1.0 - 0.78 * smooth_t) + 0.003 * math.sin(index * 0.9 + t * 3.2) * t
            taper = 0.12 + 0.88 * math.sin(math.pi * t) ** 0.28
            valid = []
            for column in range(columns):
                across = (column / (columns - 1)) * 2.0 - 1.0
                x = center_x + across * width * taper * 0.5
                ridge = 0.0019 * (1.0 - abs(across) ** 1.5)
                point = top_point(x, y, 0.003 + ridge)
                valid.append(point is not None)
                if point is None:
                    vertices.append(Vector((0.0, 0.0, 0.0)))
                else:
                    vertices.append(point)
            row_valid.append(valid)
        for row in range(rows - 1):
            for column in range(columns - 1):
                if all((row_valid[row][column], row_valid[row][column + 1],
                        row_valid[row + 1][column], row_valid[row + 1][column + 1])):
                    a = base + row * columns + column
                    b = a + columns
                    faces.append((a, a + 1, b + 1, b))

    crown = top_point(0.0, 0.015, 0.008)
    bun_center = crown if crown else Vector((0.0, 0.035, 1.855))
    for loop in range(6):
        phase = loop * 0.19
        points = []
        for step in range(41):
            angle = (2.0 * math.pi * step / 40.0) + phase
            x = bun_center.x + 0.020 * math.cos(angle)
            z = bun_center.z + (0.013 + 0.0015 * math.sin(loop)) * math.sin(angle)
            y = bun_center.y + 0.008 * math.sin(angle * 2.0 + phase)
            points.append(Vector((x, y, z)))
        append_tube(vertices, faces, points, 0.0042 + 0.0004 * (loop % 3), sides=8)
    for loop in range(2):
        points = []
        for step in range(33):
            angle = 2.0 * math.pi * step / 32.0
            x = bun_center.x + (0.017 + loop * 0.002) * math.cos(angle)
            z = bun_center.z + (0.010 + loop * 0.002) * math.sin(angle)
            y = bun_center.y + (loop - 0.5) * 0.005 + 0.002 * math.sin(angle * 3.0)
            points.append(Vector((x, y, z)))
        append_tube(vertices, faces, points, 0.0025, sides=7)

    hair = create_mesh_object(
        'Bhairava_V07_SweptBack_ClumpGroom',
        vertices,
        faces,
        material,
        armature,
        collection,
        lambda _co: 0.0,
    )
    solidify = hair.modifiers.new('Sculpted clump thickness', 'SOLIDIFY')
    solidify.thickness = 0.0015
    solidify.offset = 0.0
    bevel = hair.modifiers.new('Rounded clump edges', 'BEVEL')
    bevel.width = 0.0012
    bevel.segments = 2
    return hair


def build_face_surface(tree, x, z):
    result = tree.ray_cast(Vector((x, -0.42, z)), Vector((0.0, 1.0, 0.0)), 0.84)
    location, normal, _face_index, _distance = result
    if location is None:
        return None
    if normal.y > 0.0:
        normal.negate()
    return location, normal.normalized()


def build_beard(armature, collection, material, tree, skin_weight):
    columns = 41
    rows = 25
    vertices = []
    faces = []
    points = [[None] * columns for _ in range(rows)]
    for row in range(rows):
        v = row / (rows - 1)
        for column in range(columns):
            u = (column / (columns - 1)) * 2.0 - 1.0
            half_width = 0.046 + 0.041 * (1.0 - v)
            x = u * half_width
            top = 1.637 + 0.043 * abs(u) ** 0.85 + 0.0025 * math.sin(u * 9.0)
            bottom = 1.545 + 0.012 * abs(u) + 0.0015 * math.sin(u * 7.0)
            z = top + (bottom - top) * v
            hit = build_face_surface(tree, x, z)
            if hit is None:
                continue
            location, normal = hit
            point = location + normal * 0.003
            points[row][column] = point
            vertices.append(point)
    remap = {}
    cursor = 0
    for row in range(rows):
        for column in range(columns):
            if points[row][column] is not None:
                remap[(row, column)] = cursor
                cursor += 1
    for row in range(rows - 1):
        for column in range(columns - 1):
            corners = [(row, column), (row, column + 1), (row + 1, column + 1), (row + 1, column)]
            if all(corner in remap for corner in corners):
                faces.append(tuple(remap[corner] for corner in corners))
    vertices = [point for row in points for point in row if point is not None]
    if len(vertices) < 200 or len(faces) < 100:
        raise RuntimeError(f'Beard surface sampling failed: {len(vertices)} vertices, {len(faces)} faces')

    beard = create_mesh_object(
        'Bhairava_V07_Sculpted_Beard',
        vertices,
        faces,
        material,
        armature,
        collection,
        skin_weight,
    )
    solidify = beard.modifiers.new('Soft sculpt volume', 'SOLIDIFY')
    solidify.thickness = 0.0022
    solidify.offset = 0.0
    bevel = beard.modifiers.new('Soft cheek boundary', 'BEVEL')
    bevel.width = 0.001
    bevel.segments = 2
    return beard


def build_facial_groom(armature, collection, material, tree, skin_weight):
    vertices = []
    faces = []

    for side in (-1.0, 1.0):
        brow_points = []
        for step in range(13):
            t = step / 12.0
            x = side * (0.022 + 0.050 * t)
            z = 1.777 + 0.012 * math.sin(math.pi * t) - 0.004 * t
            hit = build_face_surface(tree, x, z)
            if hit:
                location, normal = hit
                brow_points.append(location + normal * 0.0032)
        if len(brow_points) >= 5:
            append_tube(vertices, faces, brow_points, 0.0041, sides=8)
            for strand in range(3):
                strand_points = []
                for step in range(9):
                    t = step / 8.0
                    x = side * (0.028 + 0.041 * t)
                    z = 1.779 + 0.010 * math.sin(math.pi * t) + (strand - 1) * 0.002
                    hit = build_face_surface(tree, x, z)
                    if hit:
                        location, normal = hit
                        strand_points.append(location + normal * 0.005)
                if len(strand_points) >= 4:
                    append_tube(vertices, faces, strand_points, 0.0012, sides=6)

        for strand in range(9):
            start_x = side * (0.006 + strand * 0.0012)
            end_x = side * (0.046 + strand * 0.0015)
            moustache_points = []
            for step in range(13):
                t = step / 12.0
                x = start_x + (end_x - start_x) * t
                z = 1.652 - 0.006 * t + 0.002 * math.sin(math.pi * t) + (strand - 4) * 0.0005
                hit = build_face_surface(tree, x, z)
                if hit:
                    location, normal = hit
                    moustache_points.append(location + normal * 0.004)
            if len(moustache_points) >= 5:
                append_tube(vertices, faces, moustache_points, 0.0018 + 0.0004 * (strand % 3), sides=7)

    for strand in range(23):
        side = -1.0 if strand % 2 == 0 else 1.0
        lane = strand // 2
        start_x = side * (0.035 + lane * 0.0021)
        end_x = side * (0.004 + (lane % 4) * 0.002)
        beard_points = []
        for step in range(18):
            t = step / 17.0
            x = start_x + (end_x - start_x) * t + side * 0.002 * math.sin(t * math.pi * 2.0 + lane)
            z = 1.628 - 0.072 * t + 0.002 * math.sin(t * math.pi * 3.0 + lane)
            hit = build_face_surface(tree, x, z)
            if hit:
                location, normal = hit
                beard_points.append(location + normal * 0.005)
        if len(beard_points) >= 6:
            append_tube(vertices, faces, beard_points, 0.0011 + 0.00035 * (lane % 3), sides=6)

    if not faces:
        raise RuntimeError('Facial groom surface sampling produced no geometry')
    return create_mesh_object(
        'Bhairava_V07_Brow_Moustache_BeardClumps',
        vertices,
        faces,
        material,
        armature,
        collection,
        skin_weight,
    )


def sculpt_face(mesh_obj):
    skin_slot = next(
        (index for index, slot in enumerate(mesh_obj.material_slots)
         if slot.material and slot.material.name == 'Skin'),
        None,
    )
    if skin_slot is None:
        raise RuntimeError('The imported character has no Skin material slot')
    skin_vertices = set()
    for polygon in mesh_obj.data.polygons:
        if polygon.material_index == skin_slot:
            skin_vertices.update(polygon.vertices)

    seam_height = 1.635
    frozen_seam = {
        index: tuple(mesh_obj.data.vertices[index].co)
        for index in skin_vertices
        if mesh_obj.data.vertices[index].co.z <= seam_height
    }
    changed = 0
    max_displacement = 0.0
    for index in skin_vertices:
        vertex = mesh_obj.data.vertices[index]
        point = vertex.co
        x, y, z = point
        if z <= 1.635 or y >= -0.075:
            continue
        front = min(1.0, max(0.0, (-y - 0.075) / 0.095))
        sign = 1.0 if x >= 0.0 else -1.0
        brow = gaussian(abs(x), 0.050, 0.026) * gaussian(z, 1.775, 0.012) * front
        nose_bridge = gaussian(x, 0.0, 0.021) * gaussian(z, 1.720, 0.028) * front
        nose_tip = gaussian(x, 0.0, 0.025) * gaussian(z, 1.688, 0.010) * front
        cheek = gaussian(abs(x), 0.058, 0.022) * gaussian(z, 1.700, 0.018) * front
        jaw = gaussian(abs(x), 0.059, 0.026) * gaussian(z, 1.590, 0.026) * front
        chin = gaussian(x, 0.0, 0.033) * gaussian(z, 1.565, 0.016) * front
        displacement = Vector((
            sign * (0.0018 * brow + 0.0014 * cheek + 0.0024 * jaw),
            -(0.0032 * brow + 0.0040 * nose_bridge + 0.0030 * nose_tip
              + 0.0032 * cheek + 0.0020 * jaw + 0.0025 * chin),
            0.0,
        ))
        if displacement.length_squared > 1e-10:
            point += displacement
            changed += 1
            max_displacement = max(max_displacement, displacement.length)
    mesh_obj.data.update()
    unchanged_below_seam = all(
        tuple(mesh_obj.data.vertices[index].co) == point
        for index, point in frozen_seam.items()
    )
    if not unchanged_below_seam:
        raise RuntimeError('The sculpt modified Skin vertices below the neck seam')
    return {
        'changedVertexCount': changed,
        'maxDisplacementMetres': max_displacement,
        'unchangedBelowNeckSeam': unchanged_below_seam,
        'frozenSkinVertexCountBelowNeckSeam': len(frozen_seam),
        'neckSeamHeightMetres': seam_height,
        'features': ['brow ridge', 'nose bridge and tip', 'cheekbone', 'jaw angle', 'chin'],
    }


def add_reference(scene):
    reference = os.path.join(ROOT, 'phase3', 'likeness-review', 'reference-board.png')
    image = bpy.data.images.load(reference, check_existing=True)
    obj = bpy.data.objects.new('Authorized Bhairava reference board', None)
    obj.empty_display_type = 'IMAGE'
    obj.data = image
    obj.location = (0.6, 0.0, 1.75)
    obj.empty_display_size = 0.35
    obj.hide_render = True
    obj.hide_viewport = True
    collection = bpy.data.collections.new('Reference Board (viewport hidden)')
    scene.collection.children.link(collection)
    collection.objects.link(obj)


def make_preview_cameras(scene):
    cameras = {}
    target = Vector((0.0, -0.02, 1.73))
    for name, direction in (
        ('front', Vector((0.0, -1.0, 0.0))),
        ('three-quarter', Vector((2.15, -2.5, 0.05)).normalized()),
        ('side', Vector((1.0, 0.0, 0.0))),
    ):
        data = bpy.data.cameras.new(f'V07 Preview {name}')
        data.type = 'ORTHO'
        data.ortho_scale = 0.43
        camera = bpy.data.objects.new(f'V07 Preview {name}', data)
        scene.collection.objects.link(camera)
        camera.location = target + direction * 2.8
        camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
        cameras[name] = camera
    return cameras


def export_candidate(armature):
    bpy.ops.object.select_all(action='DESELECT')
    included = []
    layer_names = {obj.name for obj in bpy.context.view_layer.objects}
    for obj in bpy.context.scene.objects:
        if (obj.name in layer_names and obj.type in {'MESH', 'ARMATURE'}
                and obj.name not in {'Authorized Bhairava reference board', 'Icosphere'}):
            obj.select_set(True)
            included.append(obj)
    bpy.context.view_layer.objects.active = armature
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT_GLB,
        export_format='GLB',
        use_selection=True,
        export_animations=True,
        export_animation_mode='ACTIONS',
        export_skins=True,
        export_apply=True,
        export_materials='EXPORT',
        export_image_format='AUTO',
        export_yup=True,
    )
    return included


def render_previews(scene, clay_material):
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = 1440
    scene.render.resolution_y = 1440
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    if scene.world is None:
        scene.world = bpy.data.worlds.new('V07 Clay Review World')
    scene.world.color = (0.32, 0.32, 0.32)
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'Medium High Contrast'
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0
    material_slots = {}
    for obj in scene.objects:
        if obj.type != 'MESH':
            continue
        material_slots[obj.name] = list(obj.data.materials)
        obj.data.materials.clear()
        obj.data.materials.append(clay_material)

    key_data = bpy.data.lights.new('V07 clay key', 'AREA')
    key_data.energy = 120.0
    key_data.shape = 'DISK'
    key_data.size = 3.0
    key = bpy.data.objects.new('V07 clay key', key_data)
    scene.collection.objects.link(key)
    key.location = (-2.0, -3.0, 3.5)
    key.rotation_euler = (Vector((0.0, 0.0, 1.7)) - key.location).to_track_quat('-Z', 'Y').to_euler()
    fill_data = bpy.data.lights.new('V07 clay fill', 'AREA')
    fill_data.energy = 48.0
    fill_data.size = 2.5
    fill = bpy.data.objects.new('V07 clay fill', fill_data)
    scene.collection.objects.link(fill)
    fill.location = (2.0, -1.5, 2.0)
    fill.rotation_euler = (Vector((0.0, 0.0, 1.7)) - fill.location).to_track_quat('-Z', 'Y').to_euler()

    cameras = make_preview_cameras(scene)
    for name, camera in cameras.items():
        scene.camera = camera
        scene.render.filepath = os.path.join(V07, 'previews', f'v07-{name}.png')
        bpy.ops.render.render(write_still=True)
    for name, materials in material_slots.items():
        mesh = bpy.data.objects[name].data
        mesh.materials.clear()
        for material in materials:
            mesh.materials.append(material)


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=SOURCE_GLB)
    scene = bpy.context.scene
    armature = bpy.data.objects.get('Armature')
    main_mesh = bpy.data.objects.get('bhairava-free-rig')
    if not armature or not main_mesh:
        raise RuntimeError('Could not locate imported armature and main skinned mesh')
    if len(armature.data.bones) != 69 or len(bpy.data.actions) != 7:
        raise RuntimeError('Source rig/action set did not match the reviewed V06 candidate')
    if not all(name in bpy.data.actions for name in (
        'Walk', 'Run', 'Jump (in air)', 'Death (fall backward)',
        'Sword idle (guard)', 'Sword slash', 'Sword block',
    )):
        raise RuntimeError('One or more of the seven existing animation actions is missing')

    removed = []
    legacy_groom_prefixes = (
        'Bhairava_SweptHair',
        'Bhairava_SweptLock',
        'Bhairava_TiedRearHair',
        'Bhairava_HairTie',
        'Bhairava_ShapedBeard',
        'Bhairava_Moustache',
        'Bhairava_Brow',
        'Bhairava_V04_',
        'Bhairava_V05_',
        'Bhairava_V06_',
    )
    for obj in list(bpy.data.objects):
        if obj.name.startswith(legacy_groom_prefixes):
            removed.append(obj.name)
            bpy.data.objects.remove(obj, do_unlink=True)

    inherited_helper = bpy.data.objects.get('Icosphere')
    if (inherited_helper and inherited_helper.type == 'MESH'
            and inherited_helper.parent is None and len(inherited_helper.data.vertices) == 42):
        inherited_helper.hide_render = True
        inherited_helper.hide_set(True)
        excluded_helpers = [inherited_helper.name]
    else:
        excluded_helpers = []

    sculpt_result = sculpt_face(main_mesh)
    groom_collection = add_groom_collection(scene)
    hair_material = create_material('Bhairava_V07_Hair_Clay', (0.25, 0.25, 0.24))
    beard_material = create_material('Bhairava_V07_Beard_Clay', (0.29, 0.285, 0.27))
    clay_material = create_material('V07 Neutral Clay Preview Only', (0.66, 0.65, 0.62))

    skin_slot = next(index for index, slot in enumerate(main_mesh.material_slots)
                     if slot.material and slot.material.name == 'Skin')
    face_tree = make_surface_tree(main_mesh, skin_slot)
    build_scalp_groom(armature, groom_collection, hair_material, face_tree)
    build_beard(armature, groom_collection, beard_material, face_tree,
                lambda co: max(0.0, min(1.0, (1.665 - co.z) / 0.085)))
    build_facial_groom(
        armature,
        groom_collection,
        beard_material,
        face_tree,
        lambda co: max(0.0, min(1.0, (1.665 - co.z) / 0.085)),
    )
    add_reference(scene)
    included = export_candidate(armature)
    render_previews(scene, clay_material)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)

    report = {
        'stage': 'V07 separate sculpt and grooming prototype',
        'source': 'V06 byte-verified snapshot; V06 and all earlier versions remain untouched.',
        'blenderVersion': bpy.app.version_string,
        'sourceArmatureBoneCount': len(armature.data.bones),
        'sourceAnimationClips': sorted(action.name for action in bpy.data.actions),
        'removedOlderCandidateGroomObjects': removed,
        'excludedInheritedHelperObjects': excluded_helpers,
        'includedMeshAndRigObjects': [obj.name for obj in included],
        'facialSculpt': sculpt_result,
        'groomMeshes': [
            'Bhairava_V07_SweptBack_ClumpGroom',
            'Bhairava_V07_Sculpted_Beard',
            'Bhairava_V07_Brow_Moustache_BeardClumps',
        ],
        'scalpStyle': 'Layered tapered swept clump ribbons with directional grooves and a multi-loop integrated rear tie; no smooth scalp shell.',
        'newGroomGeometryUsesHeadAndJawWeights': True,
        'texturesAuthored': False,
        'productionIntegrated': False,
    }
    with open(SCULPT_REPORT, 'w', encoding='utf-8') as output:
        json.dump(report, output, indent=2)
    print(json.dumps({
        'blend': BLEND_PATH,
        'glb': OUTPUT_GLB,
        'sculptedVertices': sculpt_result['changedVertexCount'],
        'previewFrames': 3,
        'animations': len(bpy.data.actions),
        'removedOldGroomObjects': len(removed),
    }))


main()
