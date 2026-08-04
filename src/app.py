"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import datetime
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db, User, Profile, Producto, Factura, FacturaProducto, Orden, OrdenProducto, Favorito
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS

load_dotenv()

# from models import Person
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
secret_key = os.getenv('SECRET_KEY')
if ENV == 'production' and (not secret_key or len(secret_key) < 32):
    raise RuntimeError('SECRET_KEY debe contener al menos 32 caracteres en producción')
app.config['JWT_SECRET_KEY'] = secret_key or 'development-only-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=7)
jwt = JWTManager(app)

@jwt.expired_token_loader
def expired_token_callback(_jwt_header, _jwt_payload):
    return jsonify({'message': 'Tu sesión expiró. Vuelve a iniciar sesión.'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(_reason):
    return jsonify({'message': 'La sesión no es válida.'}), 401

@jwt.unauthorized_loader
def missing_token_callback(_reason):
    return jsonify({'message': 'Debes iniciar sesión para continuar.'}), 401



allowed_origins = os.getenv('FRONTEND_URL', 'http://localhost:3000').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=ENV == 'development')
