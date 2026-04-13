# -*- coding: utf-8 -*-
import os
import unicodedata

def remove_accents(input_str):
    input_str = input_str.decode('utf-8')  
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])

def normalize_string(s):
    return remove_accents(s).replace(' ', '-')

def rename_files_and_directories(directory):
    for root, dirs, files in os.walk(directory):
        for file_name in files:
            old_path = os.path.join(root, file_name)
            new_name = normalize_string(file_name)
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)

        for dir_name in dirs:
            old_path = os.path.join(root, dir_name)
            new_name = normalize_string(dir_name)
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)

if __name__ == "__main__":
    directorio_principal = ""
    rename_files_and_directories(directorio_principal)
