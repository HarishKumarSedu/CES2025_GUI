## CES2025 GUI Backend 

* Setup the python virtual enviroment 
```
python -m venv env 
./env/Source/activate # for windows 
source env/bin/activate # for linux distribution
pip install -r requirements.txt # install the requirements 
```

* Setup Flask for the Virtual environment 
> `#0969DA`create .flaskenv file in the root repository (write following commands)
```
FLASK_APP=app.py # main flask application 
FLASK_ENV=development
```