import os

def normalize_string(s):
    return ''.join(e.lower() for e in s if (e.isalnum() or e.isspace()) and ord(e) < 128)

def rename_files_and_directories_recursive(directory):
    for root, subdirectories, files in os.walk(directory):
        for subdirectory in subdirectories:
            subdirectory_path = os.path.join(root, subdirectory)
            rename_files_and_directories_recursive(subdirectory_path)  # Llamada recursiva para subdirectorios
            new_name = normalize_string(subdirectory).replace(' ', '-')
            old_path = subdirectory_path
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)
            print('Renamed directory: {} -> {}'.format(subdirectory, new_name))

        for file in files:
            file_path = os.path.join(root, file)
            file_name, file_extension = os.path.splitext(file)
            new_name = normalize_string(file_name).replace(' ', '-') + file_extension
            new_path = os.path.join(root, new_name)
            os.rename(file_path, new_path)
            if file != new_name:
                print('Renamed file: {} -> {}'.format(file, new_name))

if __name__ == "__main__":
    directorio_principal = ""
    rename_files_and_directories_recursive(directorio_principal)
