import os
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-with-at-least-32-bytes"
os.environ["FLASK_DEBUG"] = "0"

from app import app  # noqa: E402
from api.models import Favorito, Producto, User, db  # noqa: E402
from werkzeug.security import generate_password_hash  # noqa: E402


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

        with app.app_context():
            db.drop_all()
            db.create_all()
            first_user = User(
                username="Jorge",
                email="jorge@example.com",
                active=True,
                password=generate_password_hash("password123"),
            )
            second_user = User(
                username="Invitado",
                email="invitado@example.com",
                active=True,
                password=generate_password_hash("password123"),
            )
            product = Producto(
                nombre="Vino de prueba",
                categoria="premium",
                tipo="tinto",
                unitFormat="750 ml",
                precio=19990,
                precio_oferta=15990,
                marca="Viña de prueba",
                cepa="Cabernet Sauvignon",
                descripcion="Producto usado exclusivamente por las pruebas.",
                stock=6,
                active=True,
                image="vino-prueba.webp",
            )
            db.session.add_all([first_user, second_user, product])
            db.session.commit()
            self.product_id = product.id

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def login_headers(self, email="jorge@example.com"):
        response = self.client.post(
            "/api/login",
            json={"email": email, "password": "password123"},
        )
        self.assertEqual(response.status_code, 200)
        token = response.get_json()["token"]
        return {"Authorization": f"Bearer {token}"}

    def test_product_detail_can_be_opened(self):
        response = self.client.get(f"/api/productos/{self.product_id}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["nombre"], "Vino de prueba")

    def test_short_password_is_rejected(self):
        response = self.client.post(
            "/api/users",
            json={
                "username": "Nuevo usuario",
                "email": "nuevo@example.com",
                "password": "corta",
            },
        )

        self.assertEqual(response.status_code, 400)

    def test_current_user_requires_authentication(self):
        response = self.client.get("/api/users/me")

        self.assertEqual(response.status_code, 401)

    def test_login_allows_loading_current_user(self):
        response = self.client.get("/api/users/me", headers=self.login_headers())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["email"], "jorge@example.com")

    def test_favorites_require_authentication(self):
        self.assertEqual(self.client.get("/api/favoritos").status_code, 401)
        self.assertEqual(
            self.client.post(f"/api/favoritos/{self.product_id}").status_code,
            401,
        )

    def test_favorite_lifecycle_is_idempotent(self):
        headers = self.login_headers()

        first_add = self.client.post(
            f"/api/favoritos/{self.product_id}", headers=headers
        )
        repeated_add = self.client.post(
            f"/api/favoritos/{self.product_id}", headers=headers
        )
        favorites = self.client.get("/api/favoritos", headers=headers)

        self.assertEqual(first_add.status_code, 201)
        self.assertEqual(repeated_add.status_code, 200)
        self.assertIsInstance(favorites.get_json(), list)
        self.assertEqual(len(favorites.get_json()), 1)
        with app.app_context():
            self.assertEqual(Favorito.query.count(), 1)

        deleted = self.client.delete(
            f"/api/favoritos/{self.product_id}", headers=headers
        )
        empty_favorites = self.client.get("/api/favoritos", headers=headers)

        self.assertEqual(deleted.status_code, 204)
        self.assertEqual(empty_favorites.get_json(), [])

    def test_favorites_are_isolated_by_user(self):
        first_headers = self.login_headers()
        second_headers = self.login_headers("invitado@example.com")

        self.client.post(f"/api/favoritos/{self.product_id}", headers=first_headers)

        first_favorites = self.client.get("/api/favoritos", headers=first_headers)
        second_favorites = self.client.get("/api/favoritos", headers=second_headers)

        self.assertEqual(len(first_favorites.get_json()), 1)
        self.assertEqual(second_favorites.get_json(), [])

    def test_unknown_product_cannot_be_favorited(self):
        response = self.client.post("/api/favoritos/999999", headers=self.login_headers())

        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
