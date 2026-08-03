"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Producto, Favorito, HistorialCompra
from api.utils import generate_sitemap, APIException
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError
# from email import sendMail

api = Blueprint('api', __name__)

# Rutas para la tabla User
@api.route('/users', methods=['POST'])
def manage_users():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not username or not email or len(password) < 8:
        return jsonify({
            'message': 'Usuario, email y una contraseña de al menos 8 caracteres son obligatorios'
        }), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Ya existe una cuenta con ese email'}), 409

    try:
        user = User(
            username=username,
            email=email,
            active=True,
            password=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Usuario creado exitosamente'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'No se pudo crear el usuario'}), 409

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user_id': user.id, 'message': 'Login successful'}), 200

# RUTA LISTA
@api.route('/productos/<int:producto_id>', methods=['GET', 'PUT', 'DELETE'])
def producto_detail(producto_id):
    producto = Producto.query.get_or_404(producto_id)
    if request.method == 'GET':
        return jsonify(producto.serialize())

# RUTA LISTA
@api.route('/productos', methods=['GET'])
def get_all_products():
    productos = Producto.query.all()
    return jsonify([producto.serialize() for producto in productos])

@api.route('/productos/tipo/<string:tipo>', methods=['GET'])
def get_products_by_type(tipo):

    productos = Producto.query.filter_by(tipo=tipo)
    return jsonify([producto.serialize() for producto in productos])

@api.route('/productos/categoria/<string:categoria>', methods=['GET'])
def get_all_products_by_category(categoria):

    productos = Producto.query.filter_by(categoria=categoria)
    return jsonify([category.serialize() for category in productos])

@api.route('/favoritos', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = int(get_jwt_identity())
    favoritos = Favorito.query.filter_by(user_id=user_id).order_by(Favorito.id.desc()).all()
    return jsonify([
        favorito.producto.serialize()
        for favorito in favoritos
        if favorito.producto is not None
    ]), 200

@api.route('/favoritos/<int:producto_id>', methods=['POST', 'DELETE'])
@jwt_required()
def manage_favorite(producto_id):
    user_id = int(get_jwt_identity())
    if db.session.get(User, user_id) is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    producto = db.session.get(Producto, producto_id)
    if producto is None:
        return jsonify({'message': 'Producto no encontrado'}), 404

    favorito = Favorito.query.filter_by(
        user_id=user_id,
        producto_id=producto_id
    ).first()

    if request.method == 'POST':
        if favorito is not None:
            return jsonify(producto.serialize()), 200
        try:
            favorito = Favorito(user_id=user_id, producto_id=producto_id)
            db.session.add(favorito)
            db.session.commit()
            return jsonify(producto.serialize()), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify(producto.serialize()), 200

    if favorito is None:
        return '', 204
    db.session.delete(favorito)
    db.session.commit()
    return '', 204

@api.route('/users/me', methods=['GET', 'DELETE'])
@jwt_required()
def current_user():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuario eliminado exitosamente'}), 200
    return jsonify(user.serialize()), 200

# RUTA LISTA
@api.route('/users/<int:user_id>', methods=['GET', 'DELETE'])
@jwt_required()
def user_detail(user_id):
    if int(get_jwt_identity()) != user_id:
        return jsonify({'message': 'No tienes permiso para acceder a esta cuenta'}), 403

    user = User.query.get_or_404(user_id)
    if request.method == 'GET':
        return jsonify({'username': user.username, 'email': user.email, 'active': user.active})
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuario eliminado exitosamente'})

@api.route('/productos/<string:busqueda>', methods=['GET'])
def get_products_by_search(busqueda):
    # Buscar productos por nombre, tipo o categoría
    productos = Producto.query.filter(
        (Producto.nombre.ilike(f"%{busqueda}%")) |
        (Producto.tipo.ilike(f"%{busqueda}%")) |
        (Producto.categoria.ilike(f"%{busqueda}%"))
    ).all()

    if productos:
        return jsonify([producto.serialize() for producto in productos])
    else:
        return jsonify({"message": "No se encontraron productos con ese nombre, tipo o categoría"}), 404

# RUTA LISTA
@api.route('/historial-compra', methods=['GET', 'POST'])
@jwt_required()
def get_historial():
    user_id = int(get_jwt_identity())
    if db.session.get(User, user_id) is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        producto_id = data.get('producto_id')

        if not producto_id:
            return jsonify({'message': 'producto_id is required'}), 400
        if db.session.get(Producto, producto_id) is None:
            return jsonify({'message': 'Producto no encontrado'}), 404

        historial_compra = HistorialCompra(producto_id=producto_id, user_id=user_id)
        historial_compra.save()

        return jsonify({'message': 'HistorialCompra created successfully'}), 201

    elif request.method == 'GET':
        historial_compras = HistorialCompra.query.filter_by(user_id=user_id).all()
        return jsonify([historial.serialize() for historial in historial_compras])
    
@api.route('/reset_password', methods=['POST', 'GET', 'PUT'])
def reset_password():
    if request.method == 'PUT':
        email = request.json.get('email')  # Obtener el correo electrónico del cuerpo de la solicitud
        user= User.query.filter_by(email=email).first()
        if user is not None:
            # Se tiene que crear nueva contraseña y borrar la anterior

            return jsonify({'user_id': user.id, 'message': 'url con el token'}), 200

        else:
            return("el usuario no fue encontrado")


# # Ruta para manejar la solicitud de restablecimiento de contraseña
# @api.route('/reset_password', methods=['POST', 'GET'])
# def reset_password():
#     if request.method == 'POST':
#         email = request.json.get('email')
#         user = User.query.filter_by(email=email).first()

#         if user:
#             # Generar token y enviar al correo del usuario
#             # Aquí deberías enviar un correo con un enlace que contenga el token
#             # por ejemplo, usando una librería como Flask-Mail
#             sendMail(email)

#             # Devolver la respuesta al frontend
#             return jsonify({'message': 'Email enviado con éxito'}), 200
#         else:
#             return jsonify({'message': 'Usuario no encontrado'}), 404
