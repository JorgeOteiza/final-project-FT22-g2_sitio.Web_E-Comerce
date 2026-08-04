"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from datetime import datetime, timezone
import re
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Producto, Favorito, HistorialCompra, Orden, OrdenProducto
from api.utils import generate_sitemap, APIException
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError

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
    if len(username) > 120 or len(email) > 120 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return jsonify({'message': 'Ingresa un nombre y un correo electrónico válidos'}), 400
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
        return jsonify({'message': 'El correo y la contraseña son obligatorios'}), 400
    user = User.query.filter_by(email=email).first()

    if not user or not user.active or not check_password_hash(user.password, password):
        return jsonify({'message': 'Correo o contraseña incorrectos'}), 401

    user.last_login = datetime.now(timezone.utc)
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user_id': user.id, 'message': 'Sesión iniciada'}), 200

# RUTA LISTA
@api.route('/productos/<int:producto_id>', methods=['GET'])
def producto_detail(producto_id):
    producto = Producto.query.filter_by(id=producto_id, active=True).first_or_404()
    return jsonify(producto.serialize())

# RUTA LISTA
@api.route('/productos', methods=['GET'])
def get_all_products():
    productos = Producto.query.filter_by(active=True).all()
    return jsonify([producto.serialize() for producto in productos])

@api.route('/productos/tipo/<string:tipo>', methods=['GET'])
def get_products_by_type(tipo):

    productos = Producto.query.filter_by(tipo=tipo, active=True)
    return jsonify([producto.serialize() for producto in productos])

@api.route('/productos/categoria/<string:categoria>', methods=['GET'])
def get_all_products_by_category(categoria):

    productos = Producto.query.filter_by(categoria=categoria, active=True)
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
        (Producto.categoria.ilike(f"%{busqueda}%")),
        Producto.active.is_(True),
    ).all()

    if productos:
        return jsonify([producto.serialize() for producto in productos])
    else:
        return jsonify({"message": "No se encontraron productos con ese nombre, tipo o categoría"}), 404

# RUTA LISTA
@api.route('/historial-compra', methods=['GET'])
@jwt_required()
def get_historial():
    user_id = int(get_jwt_identity())
    if db.session.get(User, user_id) is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    historial_compras = HistorialCompra.query.filter_by(user_id=user_id).order_by(HistorialCompra.id.desc()).all()
    return jsonify([historial.serialize() for historial in historial_compras])

@api.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    if db.session.get(User, user_id) is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    data = request.get_json(silent=True) or {}
    raw_items = data.get('items')
    if not isinstance(raw_items, list) or not raw_items:
        return jsonify({'message': 'El carrito está vacío'}), 400

    quantities = {}
    for item in raw_items:
        if not isinstance(item, dict):
            return jsonify({'message': 'El carrito contiene un producto inválido'}), 400
        product_id = item.get('producto_id')
        quantity = item.get('cantidad')
        if not isinstance(product_id, int) or not isinstance(quantity, int) or quantity < 1:
            return jsonify({'message': 'Cada producto debe tener una cantidad válida'}), 400
        quantities[product_id] = quantities.get(product_id, 0) + quantity

    try:
        products = (
            Producto.query
            .filter(Producto.id.in_(quantities.keys()))
            .with_for_update()
            .all()
        )
        products_by_id = {product.id: product for product in products}

        missing_ids = [product_id for product_id in quantities if product_id not in products_by_id]
        if missing_ids:
            db.session.rollback()
            return jsonify({
                'message': 'Uno o más productos ya no están disponibles',
                'productos': missing_ids,
            }), 404

        unavailable = []
        for product_id, quantity in quantities.items():
            product = products_by_id[product_id]
            if not product.active or product.stock < quantity:
                unavailable.append({
                    'id': product.id,
                    'nombre': product.nombre,
                    'solicitado': quantity,
                    'disponible': product.stock if product.active else 0,
                })
        if unavailable:
            db.session.rollback()
            return jsonify({
                'message': 'No hay stock suficiente para completar la compra',
                'productos': unavailable,
            }), 409

        total = sum(
            (product.precio_oferta or product.precio) * quantities[product.id]
            for product in products
        )
        order = Orden(
            fecha=datetime.now(timezone.utc),
            total=total,
            status='confirmada',
            user_id=user_id,
        )
        db.session.add(order)
        db.session.flush()

        for product in products:
            quantity = quantities[product.id]
            unit_price = product.precio_oferta or product.precio
            product.stock -= quantity
            db.session.add(OrdenProducto(
                cantidad=quantity,
                precio=unit_price,
                orden_id=order.id,
                producto_id=product.id,
            ))
            db.session.add(HistorialCompra(producto_id=product.id, user_id=user_id))

        db.session.commit()
        return jsonify({
            'message': 'Compra confirmada',
            'orden': order.serialize(),
        }), 201
    except Exception:
        db.session.rollback()
        return jsonify({'message': 'No se pudo completar la compra'}), 500
    
@api.route('/reset_password', methods=['POST'])
def reset_password():
    # No se simula un cambio de contraseña inseguro. La demo responde de forma
    # uniforme para no revelar si una dirección está registrada.
    return jsonify({
        'message': 'La recuperación de contraseña no está habilitada en esta demostración'
    }), 501

# Fin de las rutas públicas de la API.
