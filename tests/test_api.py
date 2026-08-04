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
from api.models import Favorito, HistorialCompra, Orden, OrdenProducto, Producto, User, db  # noqa: E402
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
            second_product = Producto(
                nombre="Segundo vino",
                categoria="reserva",
                tipo="blanco",
                unitFormat="750 ml",
                precio=8990,
                precio_oferta=None,
                marca="Viña de prueba",
                cepa="Sauvignon Blanc",
                descripcion="Segundo producto de prueba.",
                stock=2,
                active=True,
                image="segundo-vino.webp",
            )
            db.session.add_all([first_user, second_user, product, second_product])
            db.session.commit()
            self.product_id = product.id
            self.second_product_id = second_product.id

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

    def test_products_can_be_filtered_by_type_and_category(self):
        by_type = self.client.get("/api/productos/tipo/tinto")
        by_category = self.client.get("/api/productos/categoria/premium")

        self.assertEqual(by_type.status_code, 200)
        self.assertEqual(by_category.status_code, 200)
        self.assertEqual(by_type.get_json()[0]["id"], self.product_id)
        self.assertEqual(by_category.get_json()[0]["id"], self.product_id)

    def test_products_can_be_searched_by_name(self):
        response = self.client.get("/api/productos/Vino%20de%20prueba")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()[0]["nombre"], "Vino de prueba")

    def test_search_without_results_returns_404(self):
        response = self.client.get("/api/productos/inexistente")

        self.assertEqual(response.status_code, 404)

    def test_purchase_history_requires_authentication(self):
        response = self.client.get("/api/historial-compra")

        self.assertEqual(response.status_code, 401)

    def test_purchase_history_cannot_be_forged_without_checkout(self):
        headers = self.login_headers()
        response = self.client.post(
            "/api/historial-compra",
            headers=headers,
            json={"producto_id": self.product_id},
        )
        self.assertEqual(response.status_code, 405)

    def test_products_cannot_be_modified_through_public_catalog(self):
        self.assertEqual(
            self.client.put(f"/api/productos/{self.product_id}", json={"stock": 999}).status_code,
            405,
        )
        self.assertEqual(self.client.delete(f"/api/productos/{self.product_id}").status_code, 405)

    def test_user_cannot_read_or_delete_another_account(self):
        with app.app_context():
            other_id = User.query.filter_by(email="invitado@example.com").first().id
        headers = self.login_headers()
        self.assertEqual(self.client.get(f"/api/users/{other_id}", headers=headers).status_code, 403)
        self.assertEqual(self.client.delete(f"/api/users/{other_id}", headers=headers).status_code, 403)

    def test_invalid_email_is_rejected(self):
        response = self.client.post("/api/users", json={
            "username": "Usuario",
            "email": "correo-invalido",
            "password": "password123",
        })
        self.assertEqual(response.status_code, 400)

    def test_security_headers_are_added(self):
        response = self.client.get("/api/productos")
        self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response.headers["X-Frame-Options"], "DENY")

    def test_password_recovery_is_explicitly_disabled_for_demo(self):
        response = self.client.post("/api/reset_password", json={"email": "jorge@example.com"})
        self.assertEqual(response.status_code, 501)
        self.assertNotIn("user_id", response.get_json())

    def test_checkout_requires_authentication_and_items(self):
        unauthorized = self.client.post("/api/checkout", json={"items": []})
        empty = self.client.post(
            "/api/checkout", headers=self.login_headers(), json={"items": []}
        )

        self.assertEqual(unauthorized.status_code, 401)
        self.assertEqual(empty.status_code, 400)

    def test_checkout_creates_order_and_decreases_stock(self):
        response = self.client.post(
            "/api/checkout",
            headers=self.login_headers(),
            json={"items": [
                {"producto_id": self.product_id, "cantidad": 2},
                {"producto_id": self.second_product_id, "cantidad": 1},
            ]},
        )

        self.assertEqual(response.status_code, 201)
        order = response.get_json()["orden"]
        self.assertEqual(order["numero_orden"], "RV-000001")
        self.assertEqual(order["total"], 15990 * 2 + 8990)
        self.assertEqual(len(order["productos"]), 2)
        with app.app_context():
            self.assertEqual(db.session.get(Producto, self.product_id).stock, 4)
            self.assertEqual(db.session.get(Producto, self.second_product_id).stock, 1)
            self.assertEqual(Orden.query.count(), 1)
            self.assertEqual(OrdenProducto.query.count(), 2)
            self.assertEqual(HistorialCompra.query.count(), 2)

    def test_checkout_rejects_insufficient_stock_without_partial_changes(self):
        response = self.client.post(
            "/api/checkout",
            headers=self.login_headers(),
            json={"items": [
                {"producto_id": self.product_id, "cantidad": 1},
                {"producto_id": self.second_product_id, "cantidad": 3},
            ]},
        )

        self.assertEqual(response.status_code, 409)
        with app.app_context():
            self.assertEqual(db.session.get(Producto, self.product_id).stock, 6)
            self.assertEqual(db.session.get(Producto, self.second_product_id).stock, 2)
            self.assertEqual(Orden.query.count(), 0)
            self.assertEqual(OrdenProducto.query.count(), 0)

    def test_checkout_rejects_unknown_product_without_creating_order(self):
        response = self.client.post(
            "/api/checkout",
            headers=self.login_headers(),
            json={"items": [
                {"producto_id": self.product_id, "cantidad": 1},
                {"producto_id": 999999, "cantidad": 1},
            ]},
        )

        self.assertEqual(response.status_code, 404)
        with app.app_context():
            self.assertEqual(db.session.get(Producto, self.product_id).stock, 6)
            self.assertEqual(Orden.query.count(), 0)

    def test_account_with_purchase_can_be_deleted_safely(self):
        headers = self.login_headers()
        checkout = self.client.post(
            "/api/checkout",
            headers=headers,
            json={"items": [{"producto_id": self.product_id, "cantidad": 1}]},
        )
        deleted = self.client.delete("/api/users/me", headers=headers)

        self.assertEqual(checkout.status_code, 201)
        self.assertEqual(deleted.status_code, 200)
        with app.app_context():
            self.assertIsNone(User.query.filter_by(email="jorge@example.com").first())
            self.assertEqual(Orden.query.count(), 0)
            self.assertEqual(OrdenProducto.query.count(), 0)
            self.assertEqual(HistorialCompra.query.count(), 0)
            self.assertIsNotNone(User.query.filter_by(email="invitado@example.com").first())


if __name__ == "__main__":
    unittest.main()
