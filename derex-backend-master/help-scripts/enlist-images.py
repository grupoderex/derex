import os
import csv

def get_image_files(directory):
    image_files = []
    for root, dirs, files in os.walk(directory):
        for file_name in files:
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                file_path = os.path.join(root, file_name)
                image_files.append({'file_path': file_path})

        if dirs:
            print(f"Recursividad en el directorio: {root}")

    return image_files

def write_to_csv(image_files, csv_file):
    with open(csv_file, 'w', newline='') as csvfile:
        fieldnames = ['file_path']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for image_file in image_files:
            writer.writerow({'file_path': "https://images.monoceros-dev.com/images/blueprints" + image_file['file_path'][len(directorio_principal):]})

if __name__ == "__main__":
    directorio_principal = ""
    csv_file = ""

    lista_archivos = get_image_files(directorio_principal)

    write_to_csv(lista_archivos, csv_file)
