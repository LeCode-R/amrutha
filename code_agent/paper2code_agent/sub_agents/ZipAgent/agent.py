import os
from zipfile import ZipFile

class ZipAgent:
    def __init__(self):
        print("ZipAgent ready. Use 'zip <source_path> <output_zip>' to create a ZIP file.")
        print("Type 'exit' to quit.")

    def create_zip(self, source_path, output_zip):
        if not os.path.exists(source_path):
            return f"Error: Source path '{source_path}' does not exist."

        with ZipFile(output_zip, 'w') as zipf:
            if os.path.isdir(source_path):
                for root, dirs, files in os.walk(source_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        # Add file with relative path inside zip
                        zipf.write(file_path, os.path.relpath(file_path, source_path))
            elif os.path.isfile(source_path):
                zipf.write(source_path, os.path.basename(source_path))
            else:
                return f"Error: '{source_path}' is not a file or directory."

        return f"ZIP file created successfully at '{output_zip}'"

    def run(self):
        while True:
            command = input(">> ").strip()
            if command.lower() == 'exit':
                print("Exiting ZipAgent.")
                break
            if command.startswith("zip "):
                parts = command.split(" ", 2)
                if len(parts) < 3:
                    print("Usage: zip <source_path> <output_zip>")
                    continue
                source_path, output_zip = parts[1], parts[2]
                result = self.create_zip(source_path, output_zip)
                print(result)
            else:
                print("Unknown command. Use 'zip <source_path> <output_zip>' or 'exit'.")

if __name__ == "__main__":
    agent = ZipAgent()
    agent.run()
