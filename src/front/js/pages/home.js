import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import Hero from "../component/Hero.jsx";
import { Card, ProductCardSkeleton } from "../component/Card.jsx";
import ModalControlEdad from "../component/ModalControlEdad.jsx";
import { apiFetch } from "../services/api";
import originImage from "../../img/barriles-concha-y-toro.webp";
import vineyardCircleImage from "../../img/vina-circular-don-melchor.jpg";

const ProductSection = ({ eyebrow, title, description, products, loading, link, linkText }) => (
  <section className="wine-section container">
    <div className="wine-section-heading">
      <div>
        <span className="wine-eyebrow wine-eyebrow-dark">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link className="wine-text-link" to={link}>{linkText} <span aria-hidden="true">→</span></Link>
    </div>
    <div className="row g-4">
      {loading ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />) : <Card productos={products} compact />}
    </div>
  </section>
);

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/productos")
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const offers = useMemo(() => products.filter(product => product.precio_oferta).slice(0, 4), [products]);
  const premium = useMemo(() => products.filter(product => product.categoria?.toLowerCase() === "premium").slice(0, 4), [products]);

  return (
    <main className="home-page">
      <Hero />
      <section className="wine-benefits" aria-label="Beneficios de la tienda">
        <div><i className="fa-solid fa-wine-bottle" /><span><strong>Selección especializada</strong>Vinos para cada ocasión</span></div>
        <div><i className="fa-solid fa-truck-fast" /><span><strong>Despacho seguro</strong>Protegemos cada botella</span></div>
        <div><i className="fa-solid fa-shield-halved" /><span><strong>Compra confiable</strong>Información clara y stock real</span></div>
      </section>

      <ProductSection
        eyebrow="Precios especiales"
        title="Ofertas para brindar"
        description="Aprovecha descuentos reales calculados sobre el precio habitual de cada etiqueta."
        products={offers}
        loading={loading}
        link="/busqueda?ofertas=1"
        linkText="Ver todas las ofertas"
      />

      <section className="wine-origin-section">
        <div className="container wine-origin-grid">
          <div className="wine-origin-image"><img src={originImage} alt="Barricas de vino en una bodega chilena" /></div>
          <div className="wine-origin-copy">
            <span className="wine-eyebrow">Origen chileno</span>
            <h2>Del valle a tu mesa</h2>
            <p>Una colección inspirada en los valles vitivinícolas de Chile, con cepas, estilos y viñas que cuentan una historia distinta en cada copa.</p>
            <Link className="wine-button wine-button-light" to="/busqueda?q=">Explorar el catálogo</Link>
          </div>
        </div>
      </section>

      <section className="wine-terroir-section" style={{ backgroundImage: `url(${vineyardCircleImage})` }}>
        <div className="wine-terroir-overlay" />
        <div className="container wine-terroir-content">
          <span className="wine-eyebrow">Terroir y excelencia</span>
          <h2>El origen de una gran cosecha</h2>
          <p>Viñedos excepcionales, trabajo paciente y una selección pensada para quienes buscan etiquetas memorables.</p>
          <Link className="wine-button wine-button-outline" to="/busqueda?categoria=premium">Conocer vinos premium</Link>
        </div>
      </section>

      <ProductSection
        eyebrow="Ediciones destacadas"
        title="Selección Premium"
        description="Vinos de carácter excepcional para celebraciones, regalos y momentos inolvidables."
        products={premium}
        loading={loading}
        link="/busqueda?categoria=premium"
        linkText="Descubrir selección"
      />
      <ModalControlEdad />
    </main>
  );
};
