import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Card, ProductCardSkeleton } from "../component/Card.jsx";
import "../../styles/favoritos.css";

const Favoritos = () => {
  const { store } = useContext(Context);
  const favorites = Array.isArray(store.favorites) ? store.favorites : [];
  const loading = store.favoritesLoading;
  return (
    <main className="container favorites-page">
      <header className="wine-catalog-header">
        <span className="wine-eyebrow wine-eyebrow-dark">Tu selección</span>
        <h1>Vinos favoritos</h1>
        <p>Guarda aquí las etiquetas que quieres volver a encontrar.</p>
      </header>
      {loading ? <div className="row g-4">{Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)}</div> : favorites.length ? <div className="row g-4"><Card productos={favorites} /></div> : (
        <div className="wine-empty-state">
          <i className="fa-regular fa-heart" />
          <h2>Aún no tienes favoritos</h2>
          <p>Explora el catálogo y guarda los vinos que más te interesen.</p>
          <Link className="wine-button wine-button-primary" to="/busqueda?q=">Explorar vinos</Link>
        </div>
      )}
    </main>
  );
};

export default Favoritos;
