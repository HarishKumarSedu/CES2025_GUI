from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request,jsonify
from flask_cors import CORS

import os 

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///CES2025.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

with app.app_context():
  db.create_all()
  
# Api routes 

@app.route('/',methods=['GET'])
def hello():
  return jsonify({'':'Hello'})

#import common routes 
import common_routes
# import ivm6311_routes
import ivm6310_Dragonfly_routes

if __name__ == "__main__":
  app.run(debug=True)