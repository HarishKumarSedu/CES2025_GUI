from setuptools import setup, find_packages
import pathlib
import os 
import json
files = []
def list_files_scandir(path='.'):
    with os.scandir(path) as entries:
        for entry in entries:
            if entry.is_file():
                # print(entry.path)
                files.append(str(pathlib.Path(entry.path)))
            elif entry.is_dir():
                list_files_scandir(entry.path)
 
# Specify the directory path you want to start from
directory_path = '.'
list_files_scandir(directory_path)

inlude_packages = []
with open('requirements.json','r',encoding='utf-8') as file :
    print(json.load(file))
    # for package in json.load(file):
    #     inlude_packages.append(package.get('name'))

print(inlude_packages)
with open('./README.md', 'r') as file :
    long_description = file.read()
AUTHOR_USER_NAME = 'HarishKumarSedu'
AUTHOR_EMAIL = 'harishkumarsedu@gmail.com'
REPO_NAME = 'matrix'
# datafiles = [(datadir, list(glob.glob(os.path.join(datadir, '*'))))]
setup(
    name=f'app',
    author=AUTHOR_USER_NAME,
    author_email=AUTHOR_EMAIL,
    version='0.0.9',
    # py_modules=['src'],
    # description=[ 'text/markdown','text/x-rst'],
    url=f"https://github.com/{AUTHOR_USER_NAME}/{REPO_NAME}",
    project_urls={
        "Bug Tracker": f"https://github.com/{AUTHOR_USER_NAME}/{REPO_NAME}/issues",
    },
    long_description_content_type=['text/plain', 'text/x-rst', 'text/markdown'],
    long_description=long_description,
    packages=find_packages(exclude=['__pycache__']),
    package_data={'static': files},
    include_package_data=True,
    # include_dirs=['IvmDriver'],
    data_files = files,
    install_requires=inlude_packages,
    

    
    
)