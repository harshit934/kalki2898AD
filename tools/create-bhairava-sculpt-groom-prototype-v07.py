import bpy
import json
import os
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
V07 = os.path.join(ROOT, 'phase3', 'likeness-sculpt', 'v07')
SOURCE_GLB = os.path.join(V07, 'rollback', 'v06-source-bhairava.glb')
BLEND_PATH = os.path.join(V07, 'work', 'bhairava-sculpt-groom-prototype.blend')
AUDIT_PATH = os.path.join(V07, 'work', 'blender-import-audit.json')


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=SOURCE_GLB)

    objects = []
    for obj in bpy.context.scene.objects:
        bounds = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
        minimum = [min(point[axis] for point in bounds) for axis in range(3)]
        maximum = [max(point[axis] for point in bounds) for axis in range(3)]
        objects.append({
            'name': obj.name,
            'type': obj.type,
            'parent': obj.parent.name if obj.parent else None,
            'vertexCount': len(obj.data.vertices) if obj.type == 'MESH' else None,
            'dimensions': list(obj.dimensions),
            'minimum': minimum,
            'maximum': maximum,
            'bones': [bone.name for bone in obj.data.bones] if obj.type == 'ARMATURE' else None,
            'actions': [action.name for action in bpy.data.actions] if obj.type == 'ARMATURE' else None,
        })

    audit = {
        'blenderVersion': bpy.app.version_string,
        'objects': objects,
        'actions': [action.name for action in bpy.data.actions],
    }
    main_mesh = bpy.data.objects.get('bhairava-free-rig')
    if main_mesh and main_mesh.type == 'MESH':
        material_vertices = {}
        for polygon in main_mesh.data.polygons:
            material = main_mesh.material_slots[polygon.material_index].material
            name = material.name if material else f'material-{polygon.material_index}'
            record = material_vertices.setdefault(name, {'vertices': set(), 'faces': 0})
            record['vertices'].update(polygon.vertices)
            record['faces'] += 1
        audit['materials'] = []
        for name, record in material_vertices.items():
            vertices = [main_mesh.data.vertices[index].co for index in record['vertices']]
            for minimum_z in (1.45, 1.55, 1.62, 1.68):
                subset = [vertex for vertex in vertices if vertex.z >= minimum_z]
                if subset:
                    audit['materials'].append({
                        'name': name,
                        'faces': record['faces'],
                        'verticesAtOrAboveZ': minimum_z,
                        'vertexCount': len(subset),
                        'bounds': {
                            'minimum': [min(vertex[axis] for vertex in subset) for axis in range(3)],
                            'maximum': [max(vertex[axis] for vertex in subset) for axis in range(3)],
                        },
                    })
    with open(AUDIT_PATH, 'w', encoding='utf-8') as output:
        json.dump(audit, output, indent=2)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print(json.dumps({
        'blend': BLEND_PATH,
        'objects': len(objects),
        'actions': len(audit['actions']),
        'audit': AUDIT_PATH,
    }))


main()
