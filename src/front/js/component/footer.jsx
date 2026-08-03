import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";
import logo from "../../img/logoElRinconDelVino.png";
import webpayLogo from "../../img/webpayLogo.png";
import consumoResponsableLogo from "../../img/consumoResponsableLogo.png";

const Footer = () => (
  <footer className="wine-footer">
    <div className="container wine-footer-grid">
      <div className="wine-footer-brand">
        <img src={logo} alt="El Rincón del Vino" />
        <p>Una selección de vinos chilenos para descubrir, compartir y celebrar.</p>
        <div className="wine-footer-social"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a><a href="https://github.com/JorgeOteiza" target="_blank" rel="noreferrer" aria-label="GitHub del desarrollador"><i className="fa-brands fa-github" /></a></div>
      </div>
      <div><h2>Explora</h2><nav><Link to="/busqueda?tipo=tinto">Vinos tintos</Link><Link to="/busqueda?tipo=blanco">Vinos blancos</Link><Link to="/busqueda?tipo=espumante">Espumantes</Link><Link to="/busqueda?ofertas=1">Ofertas</Link></nav></div>
      <div><h2>Información</h2><nav><a href="#">Despachos</a><a href="#">Términos y condiciones</a><a href="mailto:elrincondelvino14@gmail.com">Contacto</a><a href="#">Preguntas frecuentes</a></nav></div>
      <div className="wine-footer-payment"><h2>Compra segura</h2><img src={webpayLogo} alt="Pago con Webpay" /><div className="wine-responsible"><img src={consumoResponsableLogo} alt="Consumo responsable" /><p>Disfruta con responsabilidad.<br />Si bebes, no conduzcas.</p></div></div>
    </div>
    <div className="wine-footer-bottom"><div className="container"><span>© {new Date().getFullYear()} El Rincón del Vino</span><span>Proyecto colaborativo de bootcamp · Actualmente mantenido y evolucionado por Jorge Oteiza</span></div></div>
  </footer>
);

export default Footer;
