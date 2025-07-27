from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

#Initalizes the each instance within the databse with a Base Class. Creates common timestamp fields and methods. Part of DRY (Don't repeat yourself) principle 
db = SQLAlchemy()
migrate = Migrate()
load_dotenv()

def create_app():
    app = Flask(__name__)
    #For Flask Sessions
    app.secret_key = 'test-key'
# Configure CORS
    CORS(app, 
     origins=[os.getenv('FRONTEND_URL')],  # Your Angular URL
     supports_credentials=True,
    )

    app.config.from_mapping(
        SECRET_KEY = 'dev',
        SQLALCHEMY_DATABASE_URI=os.getenv('DB_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    db.init_app(app)
    migrate.init_app(app, db)

    # Import models (do this after db initialization)
    from . import models

    # Create database tables
    with app.app_context():
        db.create_all()

    #Register blueprints/routes
    from .routes import api_bp  
    app.register_blueprint(api_bp, url_prefix = '/api')

    return app