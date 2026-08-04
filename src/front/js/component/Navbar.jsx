import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoUrl from "../../img/logoElRinconDelVino.png";
import LogIn from "./LogIn.jsx";
import ModalContact from "./ModalContact.jsx";
import RestaurarContraseña from "./ModalRestaurarContraseña.jsx";
import BarraDeBusqueda from "./BarraDeBusqueda.jsx";
import { NavBarShoppingCart } from "./NavBarShoppingCart.jsx";

const DropdownLink = ({ to, children }) => <li><Link className="dropdown-item" to={to}>{children}</Link></li>;

const Navbar = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const syncSession = () => setToken(localStorage.getItem("token"));
    window.addEventListener("auth-expired", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("auth-expired", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("shoppingCart");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <LogIn />
      <ModalContact />
      <RestaurarContraseña />
      <nav className="navbar navbar-expand-lg wine-navbar" aria-label="Navegación principal">
        <div className="container-fluid wine-navbar-inner">
          <Link className="wine-navbar-brand" to="/" aria-label="Ir al inicio"><img src={logoUrl} alt="El Rincón del Vino" /></Link>
          <button className="navbar-toggler wine-navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Abrir menú"><i className="fa-solid fa-bars" /></button>
          <div className="collapse navbar-collapse wine-navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav wine-navbar-links">
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Tipos</button>
                <ul className="dropdown-menu wine-dropdown">
                  <DropdownLink to="/busqueda?tipo=tinto">Tintos</DropdownLink><DropdownLink to="/busqueda?tipo=blanco">Blancos</DropdownLink><DropdownLink to="/busqueda?tipo=rosé">Rosé</DropdownLink><DropdownLink to="/busqueda?tipo=espumante">Espumantes</DropdownLink>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Categorías</button>
                <ul className="dropdown-menu wine-dropdown">
                  <DropdownLink to="/busqueda?categoria=reserva">Reserva</DropdownLink><DropdownLink to="/busqueda?categoria=gran%20reserva">Gran reserva</DropdownLink><DropdownLink to="/busqueda?categoria=premium">Premium</DropdownLink><DropdownLink to="/busqueda?ofertas=1">Ofertas</DropdownLink>
                </ul>
              </li>
              <li className="nav-item"><button className="nav-link" data-bs-toggle="modal" data-bs-target="#ModalContact">Contáctanos</button></li>
            </ul>
            <div className="wine-navbar-search-wrap"><BarraDeBusqueda /></div>
            <div className="wine-navbar-actions">
              <NavBarShoppingCart />
              <div className="dropdown">
                <button className="wine-navbar-icon wine-user-trigger" data-bs-toggle="dropdown" aria-expanded="false" aria-label={token ? "Menú de usuario" : "Acceder"}><i className={`fa-solid ${token ? "fa-user" : "fa-right-to-bracket"}`} /><span className="wine-mobile-action-label">{token ? "Mi perfil" : "Acceder"}</span><i className="fa-solid fa-chevron-down wine-mobile-action-chevron" /></button>
                <ul className="dropdown-menu dropdown-menu-end wine-dropdown">
                  {token ? <><DropdownLink to="/perfil">Mi perfil</DropdownLink><DropdownLink to="/favoritos">Mis favoritos</DropdownLink><li><button className="dropdown-item" onClick={logout}>Cerrar sesión</button></li></> : <><li><button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalLogin">Acceder</button></li><DropdownLink to="/registro">Crear cuenta</DropdownLink></>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
