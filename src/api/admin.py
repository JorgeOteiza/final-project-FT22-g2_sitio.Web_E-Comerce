from flask_admin import Admin
from .models import db, User, Profile, Producto, Factura, FacturaProducto, Orden, OrdenProducto, Favorito, HistorialCompra
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='El Rincón del Vino')
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Profile, db.session))
    admin.add_view(ModelView(Producto, db.session))
    admin.add_view(ModelView(Factura, db.session))
    admin.add_view(ModelView(FacturaProducto, db.session))
    admin.add_view(ModelView(Orden, db.session))
    admin.add_view(ModelView(OrdenProducto, db.session))
    admin.add_view(ModelView(Favorito, db.session))
    admin.add_view(ModelView(HistorialCompra, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
