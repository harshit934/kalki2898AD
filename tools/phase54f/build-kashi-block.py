"""Original authored Kashi street block. New output only; no imported protected assets.

Coordinates below use the game's X/Y-up/Z convention. Blender uses Z-up.
The central mission corridor and all existing collision footprints stay clear.
"""
import bpy, math, random, json, time
from pathlib import Path
from mathutils import Vector
import numpy as np

ROOT = Path.cwd()
OUT = ROOT / 'public/environment/phase54f-authored'
EVIDENCE = ROOT / 'phase5/phase54f-stabilization-20261114/authored-assets'
OUT.mkdir(parents=True, exist_ok=True)
EVIDENCE.mkdir(parents=True, exist_ok=True)
assert not (OUT / 'street-core.glb').exists(), 'Preserve the existing asset version'
START = time.time()
random.seed(2898054)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def pos(p): return (p[0], -p[2], p[1])

def texture(name, kind, base):
    n = 1024
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    rng = np.random.default_rng(2898 + len(name))
    grain = rng.normal(0, .025, (n, n))
    broad = .045 * np.sin(x*.017 + np.sin(y*.009)*2) + .035*np.cos(y*.031)
    if kind == 'stone':
        joints = ((np.mod(y, 170)<5) | (np.mod(x+np.floor(y/170)*127, 256)<4))
        height = .55 + broad + grain - joints*.22
    elif kind == 'metal':
        height = .58 + grain*.3 + .025*np.sin(x*.7)
        height -= (np.mod(x+y*.12, 151)<1)*.07
    elif kind == 'wood':
        height = .55 + .07*np.sin(x*.24+np.sin(y*.006)*4)+grain*.4
    else:
        height = .62 + broad + grain
        height -= (np.sin(x*.013+np.cos(y*.01))*np.sin(y*.019)>.77)*.08
    tint = np.clip(height/.62, .3, 1.3)
    rgba = np.ones((n,n,4), dtype=np.float32)
    rgba[:,:,:3] = np.clip(tint[:,:,None]*np.array(base)[None,None,:],0,1)
    image = bpy.data.images.new(name+'-color', n, n)
    image.pixels.foreach_set(rgba.ravel())
    image.filepath_raw = str(OUT/(name+'-color.png')); image.file_format='PNG'; image.save()
    dy, dx = np.gradient(height)
    normal = np.stack((-dx*4,-dy*4,np.ones_like(dx)),axis=2)
    normal /= np.linalg.norm(normal,axis=2)[:,:,None]
    rgba[:,:,:3] = normal*.5+.5
    bump=bpy.data.images.new(name+'-normal',n,n);bump.colorspace_settings.name='Non-Color'
    bump.pixels.foreach_set(rgba.ravel());bump.filepath_raw=str(OUT/(name+'-normal.png'));bump.file_format='PNG';bump.save()
    return image,bump

def material(name, color, kind='stone', metal=0, rough=.8):
    m=bpy.data.materials.new(name);m.use_nodes=True
    tree=m.node_tree;shader=tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=(*color,1)
    shader.inputs['Metallic'].default_value=metal;shader.inputs['Roughness'].default_value=rough
    image,normal=texture(name,kind,color)
    tex=tree.nodes.new('ShaderNodeTexImage');tex.image=image
    tree.links.new(tex.outputs['Color'],shader.inputs['Base Color'])
    nt=tree.nodes.new('ShaderNodeTexImage');nt.image=normal
    nm=tree.nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.38
    tree.links.new(nt.outputs['Color'],nm.inputs['Color']);tree.links.new(nm.outputs['Normal'],shader.inputs['Normal'])
    return m

STONE=material('F-carved-sandstone',(.49,.36,.23))
PLASTER=material('F-weathered-lime',(.58,.51,.38),'plaster')
DARK=material('F-smoked-basalt',(.17,.20,.18))
METAL=material('F-salvaged-bronze',(.34,.28,.18),'metal',.65,.55)
WOOD=material('F-worn-teak',(.25,.15,.08),'wood')
CLOTH=material('F-dusty-indigo',(.17,.24,.25),'plaster',0,.95)
mesh_cache={};objects=[]

def box(name, p, size, mat=STONE, bevel=.025, angle=0):
    key=(tuple(round(v,4) for v in size),round(bevel,4))
    if key not in mesh_cache:
        bpy.ops.mesh.primitive_cube_add(size=1)
        temp=bpy.context.object;temp.scale=(size[0],size[2],size[1])
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        if bevel:
            mod=temp.modifiers.new('Small real masonry arris','BEVEL');mod.width=min(bevel,min(size)*.18);mod.segments=2
            bpy.ops.object.modifier_apply(modifier=mod.name)
        for poly in temp.data.polygons:poly.use_smooth=False
        mesh_cache[key]=temp.data;mesh_cache[key].use_fake_user=True
        bpy.data.objects.remove(temp,do_unlink=True)
    o=bpy.data.objects.new(name,mesh_cache[key]);bpy.context.collection.objects.link(o)
    o.location=pos(p);o.rotation_euler.z=angle
    # Shared geometry and material slots are grouped during final export.
    if not o.data.materials:o.data.materials.append(mat)
    o.material_slots[0].link='OBJECT';o.material_slots[0].material=mat
    objects.append(o);return o

def mesh(name, vertices, faces, mat):
    center=Vector(tuple(sum(v[i] for v in vertices)/len(vertices) for i in range(3)))
    data=bpy.data.meshes.new(name);data.from_pydata([pos(Vector(v)-center) for v in vertices],[],faces);data.update()
    o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);data.materials.append(mat)
    o.location=pos(center)
    if 'shikhara' in name:
        for poly in data.polygons:poly.use_smooth=True
    objects.append(o);return o

def arch(name,p,width,height,depth,mat=STONE,angle=0):
    r=width/2;spring=height-r*.85;thick=.22
    vs=[]
    for z in [-depth/2,depth/2]:
        for rr in [r,r+thick]:
            for j in range(19):
                a=math.pi*j/18
                x=math.cos(a)*rr;y=spring+math.sin(a)*rr*.85
                vs.append((p[0]+math.cos(angle)*x+math.sin(angle)*z,p[1]+y,p[2]-math.sin(angle)*x+math.cos(angle)*z))
    fs=[]
    for j in range(18):
        fs.extend([(j,j+1,19+j+1,19+j),(38+j,57+j,57+j+1,38+j+1),(j,38+j,38+j+1,j+1),(19+j,20+j,58+j,57+j)])
    mesh(name,vs,fs,mat)

def building(name,x,z,width,depth,floors,style=0):
    angle=math.pi/2 if x<0 else -math.pi/2
    def wp(px,y,pz):return(x+math.cos(angle)*px+math.sin(angle)*pz,y,z-math.sin(angle)*px+math.cos(angle)*pz)
    def b(label,p,s,m=STONE,bevel=.025):return box(name+'-'+label,wp(*p),s,m,bevel,angle)
    h=3.25
    # Rooms have open/recessed bays, real piers, floors and balcony undersides.
    b('back',(0,floors*h/2,-depth/2+.22),(width,.0+floors*h,.42),PLASTER)
    for side in [-1,1]:b('party-wall',(side*width/2,floors*h/2,0),(.38,floors*h,depth),PLASTER)
    bays=max(2,round(width/3.4));bay=width/bays
    for f in range(floors):
        y=f*h
        b('floor',(0,y+.02,0),(width+.1,.22,depth+.1),DARK)
        b('carved-cornice',(0,y+h-.14,depth/2+.1),(width+.5,.28,.62),STONE)
        b('cornice-bead',(0,y+h+.03,depth/2+.2),(width+.65,.10,.7),METAL if f==floors-1 else STONE,.015)
        for j in range(bays+1):
            px=-width/2+j*bay
            b('pier',(px,y+1.53,depth/2),(.36,2.95,.5),STONE)
            b('capital',(px,y+2.8,depth/2),(.6,.24,.7),STONE)
            b('pier-plinth',(px,y+.24,depth/2),(.55,.46,.65),DARK)
        for j in range(bays):
            px=-width/2+(j+.5)*bay
            arch(name+'-recessed-arch',wp(px,y,depth/2+.04),bay-.42,2.96,.36,STONE,angle)
            b('shadowed-bay',(px,y+1.35,depth/2-.8),(bay-.5,2.5,.12),WOOD if (j+f+style)%3 else DARK)
            for k in range(5):b('shutter-boards',(px-bay*.33+k*bay*.165,y+1.35,depth/2-.7),(.055,2.3,.08),METAL,.01)
            if f>0:
                b('balcony',(px,y+.17,depth/2+.65),(bay-.2,.25,1.5),STONE)
                b('rail-coping',(px,y+1.12,depth/2+1.25),(bay-.18,.12,.17),STONE)
                for k in range(7):
                    off=(k-3)*bay/8
                    b('jali-spindle',(px+off,y+.72,depth/2+1.25),(.065,.72,.07),METAL,.008)
                for side in [-1,1]:b('stone-bracket',(px+side*bay*.32,y-.16,depth/2+.45),(.21,.65,.65),STONE)
    b('roof-parapet',(0,floors*h+.6,depth/2),(width+.5,.9,.38),PLASTER)
    for px in [-width*.35,width*.35]:
        b('roof-service-housing',(px,floors*h+.8,-1),(2,1.5,2.2),DARK)
        for k in range(5):b('vent-slats',(px,floors*h+.35+k*.21,.15),(1.65,.055,.12),METAL,.008)
    if style in [0,2,4]:
        for j in range(bays):
            px=-width/2+(j+.5)*bay
            b('shop-counter',(px,.82,depth/2+.65),(bay-.6,.18,1.2),WOOD)
            for side in [-1,1]:b('counter-leg',(px+side*bay*.26,.35,depth/2+.65),(.13,.7,.8),METAL)
            b('awning',(px,2.7,depth/2+1.2),(bay-.2,.09,2.25),CLOTH)
            for side in [-1,1]:b('awning-post',(px+side*bay*.42,1.35,depth/2+2.12),(.08,2.7,.08),METAL,.01)
            for k in range(4):b('vendor-storage',(px+(k%2-.5)*.52,.18+(k//2)*.27,depth/2-.1),(.48,.24,.65),WOOD)
    # Services follow a real wall/roof route, instead of unrelated sci-fi props.
    for y in [3.4,6.7]:
        if y<floors*h:b('service-duct',(0,y,depth/2+.3),(width,.18,.22),METAL)
    for side in [-1,1]:b('vertical-service',(side*(width/2-.25),floors*h/2,depth/2+.38),(.13,floors*h,.17),METAL,.015)

building('ghat-sarai',-14,19,13,9,3,0)
building('repair-mandap',14,17,14,9,2,2)
building('old-traders-court',-14,0,15,9,4,1)
building('stacked-housing',14,-4,13,9,5,3)
building('temple-approach',-14,-23,14,9,2,4)
building('transit-workshop',15,-27,17,10,3,2)
building('riverside-court',-15,-46,15,10,3,0)
building('district-office',14,-50,13,9,4,1)

# Ghat steps are connected to four side streets and meet the existing water level.
for j in range(9):
    box('riverfront-ghat-tread',(-15-j*.95,-.24-j*.22,-16),(.97,.25,104),STONE,.035)
for z in [8,-14,-37,-58]:
    box('connected-side-street',(-11,-.25,z),(7,.15,3.2),STONE)
for side in [-1,1]:
    for z in range(-54,25,4):box('street-drain',(side*6.9,-.16,z),(.48,.08,3.7),DARK,.012)
    for z in range(-50,20,8):
        for k in range(5):box('drain-crossbar',(side*6.9,-.10,z+k*.22),(.43,.035,.06),METAL,.006)

box('continuous-street-substrate',(44,-.35,0),(112,.26,200),DARK,.0)
for row in range(70):
    z=27-row*1.6
    for column in range(12):
        x=-6.35+column*1.1
        box('repaired-stone-pavement',(x,-.29,z),(1.075,.16,1.57),DARK if (row*7+column*11)%37==0 else STONE,.012)

# Curved, ribbed shikhara with stepped mouldings and miniature shrine niches.
def shikhara(x,z,height=20,radius=4.4):
    profile=[(0,1),(1,1.06),(2,.97),(5,.86),(9,.67),(13,.46),(16,.29),(18,.16),(19,.09),(20,.04)]
    vs=[];seg=48
    for y,r in profile:
        for i in range(seg):
            a=i*2*math.pi/seg;rr=radius*r*(1+.035*math.cos(a*8))
            vs.append((x+math.cos(a)*rr,y*height/20+6,z+math.sin(a)*rr))
    fs=[(j*seg+i,j*seg+(i+1)%seg,(j+1)*seg+(i+1)%seg,(j+1)*seg+i) for j in range(len(profile)-1) for i in range(seg)]
    mesh('original-ribbed-shikhara',vs,fs,STONE)
    for y,r in profile[1:-1]:box('shikhara-moulding',(x,6+y*height/20,z),(radius*r*1.52,.14,radius*r*1.52),STONE,.045,math.pi/4)
    for y in [7.5,10,12.5]:
        for i in range(8):
            a=i*math.pi/4;rr=radius*(1-(y-6)/height*.75)
            box('tower-aedicule',(x+math.sin(a)*rr,y,z+math.cos(a)*rr),(.7,1.3,.28),DARK,.035,a)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=.38,location=pos((x,6+height+.4,z)))
    o=bpy.context.object;o.name='kalash-finial';o.data.materials.append(METAL);objects.append(o)
shikhara(-19,-28)
shikhara(16,-72,14,3.2)

# Monumental far gate: bays remain open and the arena's collision route is untouched.
for x in [-13,-6.5,6.5,13]:
    box('gate-buttress',(x,7.3,-78),(2,15,3),STONE,.10)
    for y in [2,6,10,14]:box('gate-buttress-band',(x,y,-78),(2.4,.35,3.4),DARK,.04)
for x in [-9.75,0,9.75]:arch('district-gate-arch',(x,0,-78),5.8,12,2,STONE)
box('monumental-gate-cornice',(0,14.3,-78),(29,1.4,3.8),STONE,.12)
for x in range(-12,13,3):box('gate-jali-pier',(x,15.6,-78),(.3,1.5,.55),METAL)

# Integrated transit structure and distant inhabited megastructure underside.
box('elevated-transit-deck',(0,14.8,-45),(64,.65,4.5),DARK,.07)
for x in [-25,-12,12,25]:
    box('transit-support',(x,7.2,-45),(1.1,14.4,1.5),STONE,.08)
    box('transit-bearing',(x,14.1,-45),(4,.65,3.8),METAL)
for x in range(-30,31,3):box('transit-exposed-crossbeam',(x,14.2,-45),(.18,.45,5.6),METAL)
box('far-megastructure-habitat',(5,29,-135),(76,10,24),DARK,.15)
for x in range(-31,43,4):
    box('megastructure-structural-rib',(x,24,-135),(.42,2,25),METAL,.035)
    for z in [-147.2,-122.8]:box('habitat-inhabited-window-band',(x,28,z),(2.8,1.15,.16),WOOD,.025)

# Consolidate by material and longitudinal district, enabling spatial culling.
groups={}
for o in objects:
    mat=o.material_slots[0].material if o.material_slots else None
    key=(mat.name if mat else 'stone',int((-o.location.y+80)//35))
    groups.setdefault(key,[]).append(o)
for (material_name,district),items in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in items:o.select_set(True)
    bpy.context.view_layer.objects.active=items[0]
    if items[0].data.users>1:items[0].data=items[0].data.copy()
    bpy.ops.object.join();o=bpy.context.object;o.name=f'{material_name}-district-{district}'
    if o.data.users>1:o.data=o.data.copy()
    # World-scale UVs on each surface keep stone blocks physically consistent.
    if not o.data.uv_layers:o.data.uv_layers.new(name='UVMap')
    uv=o.data.uv_layers.active.data
    for poly in o.data.polygons:
        normal=o.matrix_world.to_3x3()@poly.normal
        axis=max(range(3),key=lambda k:abs(normal[k]))
        axes=[k for k in range(3) if k!=axis]
        for li in poly.loop_indices:
            v=o.matrix_world@o.data.vertices[o.data.loops[li].vertex_index].co
            uv[li].uv=(v[axes[0]]*.35,v[axes[1]]*.35)
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    o.data.update()

scene=bpy.context.scene
triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in scene.objects if o.type=='MESH')
bpy.ops.wm.save_as_mainfile(filepath=str(EVIDENCE/'kashi-authored-block.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'street-core.glb'),export_format='GLB',export_apply=True,export_tangents=True,export_vertex_color='MATERIAL')
manifest={'originalWork':True,'protectedInputs':[],'triangles':triangles,'meshObjects':sum(o.type=='MESH' for o in scene.objects),'bytes':(OUT/'street-core.glb').stat().st_size,'seconds':time.time()-START,'notes':'New opt-in asset only; collision geometry and production routing unchanged. Visual/performance acceptance pending.'}
(EVIDENCE/'kashi-block-manifest.json').write_text(json.dumps(manifest,indent=2))
print('KASHI_ASSET_RESULT',json.dumps(manifest))
