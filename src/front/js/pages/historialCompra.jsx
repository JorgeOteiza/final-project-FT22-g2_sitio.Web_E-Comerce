import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import { formatPrice } from "../component/Card.jsx";
import "../../styles/historialCompra.css";

const HistorialCompra = () => {
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    apiFetch("/historial-compra").then(data => { setHistory(data); setLoadError(""); }).catch(error => { setHistory([]); setLoadError(error.message); }).finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(() => history.filter(item => item.producto?.nombre?.toLowerCase().includes(query.toLowerCase())), [history, query]);

  return (
    <main className="history-page container">
      <header className="wine-catalog-header"><span className="wine-eyebrow wine-eyebrow-dark">Tu recorrido</span><h1>Historial de compras</h1><p>Consulta los vinos que has comprado anteriormente.</p></header>
      <label className="history-search"><i className="fa-solid fa-magnifying-glass" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar entre mis compras" /></label>
      {loading ? <div className="history-list">{[1,2].map(item => <div className="history-card history-skeleton" key={item}><div className="wine-skeleton" /></div>)}</div> : loadError ? <div className="wine-empty-state"><i className="fa-solid fa-triangle-exclamation" /><h2>No pudimos cargar tus compras</h2><p>{loadError}</p><button className="wine-button wine-button-primary" onClick={() => window.location.reload()}>Reintentar</button></div> : filtered.length ? (
        <div className="history-list">{filtered.map((item, index) => {
          const product = item.producto;
          return <article className="history-card" key={item.id}>
            <div className="history-number"><span>Compra</span><strong>#{String(item.id).padStart(4,"0")}</strong></div>
            <img src={product.image} alt={product.nombre} loading="lazy" decoding="async" />
            <div className="history-product"><span className="history-status"><i className="fa-solid fa-circle-check" /> Compra registrada</span><h2>{product.nombre}</h2><p>{product.marca} · {product.cepa}</p></div>
            <div className="history-price"><span>Precio</span><strong>{formatPrice(product.precio_oferta || product.precio)}</strong></div>
            <Link className="wine-card-button" to={`/producto/${product.id}`}>Volver a comprar</Link>
          </article>;
        })}</div>
      ) : <div className="wine-empty-state"><i className="fa-solid fa-receipt" /><h2>{query ? "No encontramos esa compra" : "Aún no tienes compras registradas"}</h2><p>{query ? "Prueba con otro nombre de vino." : "Cuando completes una compra, aparecerá aquí con la imagen real del producto."}</p><Link className="wine-button wine-button-primary" to="/busqueda?q=">Explorar vinos</Link></div>}
    </main>
  );
};

export default HistorialCompra;
