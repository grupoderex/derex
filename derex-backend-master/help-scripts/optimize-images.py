""" import os
import subprocess
from PIL import Image

directorio_principal = '/Users/charlie/Downloads/blueprints'

def comprimir_imagen(imagen_path):
    _, extension = os.path.splitext(imagen_path)

    if extension.lower() == '.jpg':
        subprocess.call(['jpegoptim', '-m80', imagen_path])
    elif extension.lower() == '.png':
        subprocess.call(['optipng', imagen_path])

def reducir_dimensiones(imagen_path, nuevo_path, max_dimension):
    imagen = Image.open(imagen_path)
    ancho, alto = imagen.size

    if ancho > max_dimension or alto > max_dimension:
        proporcion = max_dimension / max(ancho, alto)
        nuevo_ancho = max(1, int(ancho * proporcion))
        nuevo_alto = max(1, int(alto * proporcion))

        if 'ANTIALIAS' in dir(Image):
            imagen_resized = imagen.resize((nuevo_ancho, nuevo_alto), Image.ANTIALIAS)
        else:
            imagen_resized = imagen.resize((nuevo_ancho, nuevo_alto), Image.BICUBIC)

        imagen_resized.save(nuevo_path)

    else:
        imagen.save(nuevo_path)

def procesar_imagen(imagen_path):
    nuevo_path = imagen_path.replace('.jpg', '_resized.jpg').replace('.png', '_resized.png')
    reducir_dimensiones(imagen_path, nuevo_path, max_dimension=2048)
    comprimir_imagen(nuevo_path)

for directorio_actual, subdirectorios, archivos in os.walk(directorio_principal):
    for archivo in archivos:
        if archivo.lower().endswith(('.jpg', '.png')):
            imagen_path = os.path.join(directorio_actual, archivo)
            procesar_imagen(imagen_path) """


import os
import subprocess

directorio_principal = ''

def comprimir_imagen(imagen_path):
    _, extension = os.path.splitext(imagen_path)

    if extension.lower() == '.jpg':
        subprocess.call(['jpegoptim', '-m25', imagen_path])
    elif extension.lower() == '.png':
        subprocess.call(['optipng', imagen_path])

def procesar_imagen(imagen_path):
    comprimir_imagen(imagen_path)

for directorio_actual, subdirectorios, archivos in os.walk(directorio_principal):
    for archivo in archivos:
        if archivo.lower().endswith(('.jpg', '.png')):
            imagen_path = os.path.join(directorio_actual, archivo)
            procesar_imagen(imagen_path)

