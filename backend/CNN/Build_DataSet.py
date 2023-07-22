import os
import shutil

def trier_fichiers(source_folder, destination_folder):
    extensions = {
        "artifact": "artifact",
        "extrahls": "extrahls",
        "extrastole": "extrastole",
        "murmur": "murmur",
        "normal": "normal",
        "unlabel": "unlabel",
    }

    for folder in extensions.keys():
        folder_path = os.path.join(destination_folder, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

    for filename in os.listdir(source_folder):
        for folder, pattern in extensions.items():
            print(filename)
            print(pattern)
            print(filename.startswith(pattern[:-1]))
            if filename.startswith(pattern[:-1]) or filename[1:].startswith(pattern[:-1]):
                src_file_path = os.path.join(source_folder, filename)
                print(src_file_path)
                dest_file_path = os.path.join(destination_folder, folder, filename)
                shutil.move(src_file_path, dest_file_path)
                break

if __name__ == "__main__":
    source_folder_set_a = "./archive/set_a"
    source_folder_set_b = "./archive/set_b"
    destination_folder = "./data/Test"

    trier_fichiers(source_folder_set_a, destination_folder)
    trier_fichiers(source_folder_set_b, destination_folder)

    print("Ended well !")
