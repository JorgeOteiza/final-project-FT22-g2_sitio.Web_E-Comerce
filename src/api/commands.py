import click
from werkzeug.security import generate_password_hash

from api.models import db, User, Producto


DEMO_PRODUCT_NAMES = [
    "Cordillera Cabernet Sauvignon", "Valle Central Carménère",
    "Altos del Maipo Merlot", "Costa Fría Pinot Noir",
    "Brisa del Valle Sauvignon Blanc", "Luz de Casablanca Chardonnay",
    "Jardín Austral Rosé", "Atardecer del Pacífico Rosé",
    "Estrellas del Sur Brut", "Cumbre Andina Extra Brut",
    "Viñedo Antiguo Syrah", "Terrazas del Itata País",
]

CATALOG_PRODUCTS = [
    {
        "nombre": "Casillero del Diablo Cabernet Sauvignon",
        "marca": "Viña Concha y Toro", "tipo": "tinto", "cepa": "Cabernet Sauvignon",
        "categoria": "reserva", "unitFormat": "Botella 750 ml", "precio": 6010,
        "precio_oferta": None, "stock": 12,
        "descripcion": "Vino tinto chileno de cuerpo firme, con notas a cereza y ciruela y 13° de alcohol.",
        "image": "/casillero-del-diablo-cabernet.webp",
    },
    {
        "nombre": "Toro de Piedra Cabernet Sauvignon",
        "marca": "Viña Requingua", "tipo": "tinto", "cepa": "Cabernet Sauvignon",
        "categoria": "gran reserva", "unitFormat": "Botella 750 ml", "precio": 8690,
        "precio_oferta": None, "stock": 12,
        "descripcion": "Vino de taninos redondos, final achocolatado y toques de café. Ideal para carnes rojas, embutidos y quesos.",
        "image": "/toro-de-piedra-cabernet.webp",
    },
    {
        "nombre": "Montes Alpha Carménère", "marca": "Valle de Colchagua",
        "tipo": "tinto", "cepa": "Carménère", "categoria": "premium",
        "unitFormat": "Botella 750 ml", "precio": 16290, "precio_oferta": 13032,
        "stock": 6,
        "descripcion": "Aromas intensos a frutos negros, especias, chocolate amargo y roble; cuerpo medio-alto, taninos redondos y final largo.",
        "image": "/montes-alpha-carmenere.webp",
    },
    {
        "nombre": "Bicicleta Merlot", "marca": "Viña Cono Sur", "tipo": "tinto",
        "cepa": "Merlot", "categoria": "reserva", "unitFormat": "Botella 750 ml",
        "precio": 3990, "precio_oferta": None, "stock": 12,
        "descripcion": "Aromas a frutas rojas maduras, ciruelas y vainilla. Fresco y frutal, con notas herbales y final equilibrado.",
        "image": "/bicicleta-merlot.webp",
    },
    {
        "nombre": "Casas del Bosque Sauvignon Blanc", "marca": "Valle de Casablanca",
        "tipo": "blanco", "cepa": "Sauvignon Blanc", "categoria": "reserva",
        "unitFormat": "Botella 750 ml", "precio": 9490, "precio_oferta": 7690,
        "stock": 12,
        "descripcion": "Color pajizo pálido con reflejos verdes, aromas florales y cítricos. Seco y fresco, con notas de manzana y final largo.",
        "image": "/casas-del-bosque-sauvignon-blanc.webp",
    },
    {
        "nombre": "Misiones de Rengo Sauvignon Blanc", "marca": "Viña Misiones de Rengo",
        "tipo": "blanco", "cepa": "Sauvignon Blanc", "categoria": "reserva",
        "unitFormat": "Botella 750 ml", "precio": 3390, "precio_oferta": None,
        "stock": 12,
        "descripcion": "Sauvignon Blanc fresco y frutal, con notas cítricas, acidez equilibrada y 13° de alcohol.",
        "image": "/misiones-de-rengo-sauvignon-blanc.webp",
    },
    {
        "nombre": "Santa Ema Select Terroir", "marca": "Viña Santa Ema",
        "tipo": "blanco", "cepa": "Sauvignon Blanc", "categoria": "reserva",
        "unitFormat": "Botella 750 ml", "precio": 4390, "precio_oferta": None,
        "stock": 12,
        "descripcion": "Amarillo pajizo brillante, aromas a frutas cítricas y peras maduras, acidez equilibrada y final frutal.",
        "image": "/santa-ema-sauvignon-blanc.webp",
    },
    {
        "nombre": "Marqués de Casa Concha Rosé Cinsault", "marca": "Viña Concha y Toro",
        "tipo": "rosé", "cepa": "Cinsault Rosé", "categoria": "reserva",
        "unitFormat": "Botella 750 ml", "precio": 15990, "precio_oferta": 9594,
        "stock": 12,
        "descripcion": "Notas a granada, melón rosado, frutilla y cereza. Seco, untuoso, mineral, cremoso y de gran frescor.",
        "image": "/marques-casa-concha-rose.webp",
    },
    {
        "nombre": "Late Harvest Rosé", "marca": "Viña Concha y Toro", "tipo": "rosé",
        "cepa": "89,5% Sauvignon Blanc, 10% Riesling y 0,5% Syrah", "categoria": "reserva",
        "unitFormat": "Botella 375 ml", "precio": 4150, "precio_oferta": 3490,
        "stock": 12,
        "descripcion": "Aromas a frutos rojos dulces, flores y miel. Dulce y frutal, con un final suave y agradable.",
        "image": "/late-harvest-rose.webp",
    },
    {
        "nombre": "Valdivieso Brut", "marca": "Viña Valdivieso", "tipo": "espumante",
        "cepa": "Chardonnay y Pinot Noir", "categoria": "sin categoría",
        "unitFormat": "Botella 750 ml", "precio": 7090, "precio_oferta": None,
        "stock": 12,
        "descripcion": "Aromas frutales y cítricos con leves notas florales. Burbuja gentil, gran frescura y viva acidez.",
        "image": "/valdivieso-brut.webp",
    },
    {
        "nombre": "Morandé Espumoso Brut Nature", "marca": "Viñedo Belén, Valle de Casablanca",
        "tipo": "espumante", "cepa": "Chardonnay y Pinot Noir", "categoria": "premium",
        "unitFormat": "Botella 750 ml", "precio": 22190, "precio_oferta": 19970,
        "stock": 12,
        "descripcion": "Aromas a flores y frutas frescas con pan de miel; gran estructura, acidez fresca y burbujas vivas.",
        "image": "/morande-brut-nature.webp",
    },
    {
        "nombre": "Tarapacá Etiqueta Negra", "marca": "Viña Tarapacá", "tipo": "tinto",
        "cepa": "Cabernet Sauvignon", "categoria": "gran reserva",
        "unitFormat": "Botella 750 ml", "precio": 15990, "precio_oferta": None,
        "stock": 12,
        "descripcion": "Notas a cassis, moras y cedro; taninos firmes y sabores a chocolate con frutas maduras.",
        "image": "/tarapaca-etiqueta-negra.webp",
    },
    {
        "nombre": "Don Melchor Cabernet Sauvignon", "marca": "Concha y Toro - Viña Don Melchor",
        "tipo": "tinto", "cepa": "Cabernet Sauvignon", "categoria": "premium",
        "unitFormat": "Botella 750 ml", "precio": 299990, "precio_oferta": 276990,
        "stock": 6,
        "descripcion": "Aromas a frutas negras maduras, chocolate y especias. Estructura elegante, taninos sedosos y final largo; ideal con carnes rojas, cordero o quesos maduros.",
        "image": "/don-melchor-cabernet.webp",
    },
    {
        "nombre": "Almaviva 2022", "marca": "Concha y Toro", "tipo": "tinto",
        "cepa": "72% Cabernet Sauvignon, 23% Carménère, 4% Cabernet Franc y 1% Petit Verdot",
        "categoria": "premium", "unitFormat": "Botella 750 ml", "precio": 500000,
        "precio_oferta": 469000, "stock": 3,
        "descripcion": "Vino de gran complejidad, elegancia y delicadeza, con aromas a grosellas negras, lavanda y grafito.",
        "image": "/almaviva-2022.webp",
    },
]


def setup_commands(app):
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        for x in range(1, int(count) + 1):
            email = f"test_user{x}@test.com"
            if User.query.filter_by(email=email).first():
                continue
            db.session.add(User(
                username=f"Usuario demo {x}", email=email,
                password=generate_password_hash("Demo1234"), active=True,
            ))
        db.session.commit()
        click.echo("Usuarios de prueba listos")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        removed = Producto.query.filter(Producto.nombre.in_(DEMO_PRODUCT_NAMES)).delete(
            synchronize_session=False
        )
        created = 0
        updated = 0

        for data in CATALOG_PRODUCTS:
            product = Producto.query.filter_by(nombre=data["nombre"]).first()
            if product is None:
                product = Producto(nombre=data["nombre"])
                db.session.add(product)
                created += 1
            else:
                updated += 1
            for field, value in data.items():
                setattr(product, field, value)
            product.active = True

        db.session.commit()
        click.echo(
            f"Catálogo listo: {created} creados, {updated} actualizados y "
            f"{removed} artificiales eliminados."
        )
