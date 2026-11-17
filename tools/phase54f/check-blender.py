import bpy,json,os,sys
p=bpy.ops.export_scene.gltf.get_rna_type().properties
print(json.dumps({x.identifier:str(x.default) if hasattr(x,'default') else 'complex' for x in p if any(s in x.identifier for s in ['color','texture','tangent','apply','image','format'])},indent=2))
