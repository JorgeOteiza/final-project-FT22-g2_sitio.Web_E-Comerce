import React from "react";
import { Link } from "react-router-dom";
import heroUrl from "../../img/vina-concha-y-toro-hero.jpg";
import "../../styles/navbarHero.css";

const Hero = () => (
  <section className="wine-hero" style={{ backgroundImage: `url(${heroUrl})` }}>
    <div className="wine-hero-overlay" />
    <div className="container wine-hero-content">
      <span className="wine-eyebrow">Vinos chilenos seleccionados</span>
      <h1>Historias que comienzan en la viña</h1>
      <p>Descubre etiquetas memorables, desde reservas para compartir hasta grandes vinos para celebrar.</p>
      <div className="d-flex flex-wrap gap-3">
        <Link className="wine-button wine-button-primary" to="/busqueda?categoria=premium">Descubrir selección</Link>
        <Link className="wine-button wine-button-outline" to="/busqueda?ofertas=1">Ver ofertas</Link>
      </div>
    </div>
  </section>
);

export default Hero;
