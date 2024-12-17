import cx_Freeze, sys

base = None
inlude_packages = []
with open('./requirements.txt','r') as file :
    inlude_packages = [i.strip('\n').strip() for i in file.readlines() ]
    
if sys.platform == 'win32':
    base = "Win32GUI"

executables = [cx_Freeze.Executable("app.py", base=base)]

cx_Freeze.setup(
    name="ces2025_server",
    options={"build_exe": {"packages": [], "include_files": [
        "scripts","config",'instance'
    ]}},
    version="1.0",
    description="ces2025_backend",
    executables=executables
)