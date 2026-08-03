import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const BarraDeBusqueda = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const textQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(textQuery);
  const navigate = useNavigate();
  useEffect(() => {
    setQuery(location.pathname === "/busqueda" ? textQuery : "");
  }, [location.pathname, textQuery]);
  const submit = event => {
    event.preventDefault();
    navigate(`/busqueda?q=${encodeURIComponent(query.trim())}`);
  };
  return (
    <form className="navbar-search" onSubmit={submit} role="search">
      <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
      <input aria-label="Buscar vinos" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar vino, viña o cepa" />
      {query && <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><i className="fa-solid fa-xmark" /></button>}
    </form>
  );
};

export default BarraDeBusqueda;
