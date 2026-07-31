
import click
from werkzeug.security import generate_password_hash
from api.models import db, User, Producto

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creando usuarios de prueba")
        for x in range(1, int(count) + 1):
            email = f"test_user{x}@test.com"
            if User.query.filter_by(email=email).first():
                continue
            user = User(
                username=f"Usuario demo {x}",
                email=email,
                password=generate_password_hash("Demo1234"),
                active=True,
            )
            db.session.add(user)

        db.session.commit()
        print("Usuarios de prueba listos")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        products = [
            ("Cordillera Cabernet Sauvignon", "reserva", "tinto", 8990),
            ("Valle Central Carménère", "reserva", "tinto", 9490),
            ("Altos del Maipo Merlot", "gran reserva", "tinto", 12990),
            ("Costa Fría Pinot Noir", "gran reserva", "tinto", 14990),
            ("Brisa del Valle Sauvignon Blanc", "reserva", "blanco", 7990),
            ("Luz de Casablanca Chardonnay", "gran reserva", "blanco", 11990),
            ("Jardín Austral Rosé", "reserva", "rosé", 8490),
            ("Atardecer del Pacífico Rosé", "gran reserva", "rosé", 10990),
            ("Estrellas del Sur Brut", "reserva", "espumante", 9990),
            ("Cumbre Andina Extra Brut", "gran reserva", "espumante", 13990),
            ("Viñedo Antiguo Syrah", "reserva", "tinto", 9290),
            ("Terrazas del Itata País", "gran reserva", "tinto", 12490),
        ]

        created = 0
        for name, category, wine_type, price in products:
            existing_product = Producto.query.filter_by(nombre=name).first()
            if existing_product:
                existing_product.categoria = category
                existing_product.tipo = wine_type
                existing_product.unitFormat = "Botella 750 ml"
                existing_product.precio = price
                existing_product.active = True
                existing_product.image = "/producto-vino-demo.webp"
                continue
            db.session.add(Producto(
                nombre=name,
                categoria=category,
                tipo=wine_type,
                unitFormat="Botella 750 ml",
                precio=price,
                active=True,
                image="/producto-vino-demo.webp",
            ))
            created += 1

        db.session.commit()
        click.echo(f"Catálogo listo: {created} productos creados, {len(products) - created} ya existían.")
