import os

directorio_principal = '/Users/charlie/Downloads/desarrollo-estados'

def restaurar_original(imagen_path):
    nueva_ruta = imagen_path.replace('_resized', '')
    os.rename(imagen_path, nueva_ruta)
    print(f"Imagen restaurada: {nueva_ruta}")

def procesar_imagen(imagen_path):
    if '_resized' in imagen_path:
        restaurar_original(imagen_path)

for directorio_actual, subdirectorios, archivos in os.walk(directorio_principal):
    for archivo in archivos:
        if archivo.lower().endswith(('.jpg', '.png')):
            imagen_path = os.path.join(directorio_actual, archivo)
            procesar_imagen(imagen_path)