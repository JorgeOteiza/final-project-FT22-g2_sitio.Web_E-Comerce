import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import { apiFetch } from "../services/api";
import usuarioFoto from "../../img/usuario-perfil.webp";
import "../../styles/perfilUsuario.css";
import "../../styles/responsive.css";

const PerfilUsuario = () => {
  const { store } = useContext(Context);
  const [user, setUser] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [historyCount, setHistoryCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    apiFetch("/users/me")
      .then(data => { setUser(data); setProfileError(""); })
      .catch(error => {
        setUser(null);
        if (error.status === 401) {
          setProfileError("Tu sesión expiró. Vuelve a acceder.");
          Swal.fire({
            icon: "info",
            title: "Tu sesión expiró",
            text: "Vuelve a acceder para consultar tu perfil y tus compras.",
            confirmButtonText: "Volver al inicio",
            confirmButtonColor: "#7b2121",
          }).then(() => navigate("/"));
          return;
        }
        setProfileError(error.message);
      });
    apiFetch("/historial-compra").then(data => setHistoryCount(data.length)).catch(() => setHistoryCount(0));
  }, [navigate]);
  const logout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user_id"); localStorage.removeItem("shoppingCart");
    navigate("/"); window.location.reload();
  };
  const deleteAccount = async () => {
    const result = await Swal.fire({ title:"¿Eliminar tu cuenta?", text:"Esta acción no se puede deshacer.", icon:"warning", showCancelButton:true, confirmButtonText:"Sí, eliminar", cancelButtonText:"Cancelar", confirmButtonColor:"#9c2630" });
    if (!result.isConfirmed) return;
    try {
      await apiFetch("/users/me", { method:"DELETE" });
      localStorage.clear();
      await Swal.fire({ icon:"success", title:"Cuenta eliminada", confirmButtonColor:"#7b2121" });
      navigate("/registro"); window.location.reload();
    } catch (error) { Swal.fire({ icon:"error", title:"No pudimos eliminar la cuenta", text:error.message, confirmButtonColor:"#7b2121" }); }
  };
  const cartUnits = (store.shoppingCart || []).reduce((sum,item) => sum + item.cantidad,0);

  return (
    <main className="profile-page">
      <div className="container profile-container">
        <header className="profile-hero"><div className="profile-avatar"><img src={usuarioFoto} alt="Racimo de uvas, imagen del perfil" /></div><div><span className="wine-eyebrow">Mi cuenta</span><h1>{user?.username || "Mi perfil"}</h1><p>{user?.email || profileError}</p></div></header>
        <section className="profile-stats"><div><i className="fa-regular fa-heart" /><span>Favoritos</span><strong>{Array.isArray(store.favorites) ? store.favorites.length : 0}</strong></div><div><i className="fa-solid fa-bag-shopping" /><span>En el carrito</span><strong>{cartUnits}</strong></div><div><i className="fa-solid fa-receipt" /><span>Compras</span><strong>{historyCount}</strong></div></section>
        <div className="profile-grid">
          <section className="profile-panel"><div className="profile-panel-heading"><div><span className="wine-eyebrow wine-eyebrow-dark">Datos personales</span><h2>Información de la cuenta</h2></div><i className="fa-regular fa-user" /></div><dl><div><dt>Nombre de usuario</dt><dd>{user?.username || "—"}</dd></div><div><dt>Correo electrónico</dt><dd>{user?.email || "—"}</dd></div><div><dt>Estado</dt><dd><span className="profile-active"><i className="fa-solid fa-circle" /> Cuenta activa</span></dd></div></dl></section>
          <aside className="profile-links"><h2>Accesos rápidos</h2><Link to="/favoritos"><i className="fa-regular fa-heart" /><span><strong>Mis favoritos</strong><small>Revisa tu selección guardada</small></span><i className="fa-solid fa-chevron-right" /></Link><Link to="/historial-compra"><i className="fa-solid fa-clock-rotate-left" /><span><strong>Historial de compras</strong><small>Consulta tus compras anteriores</small></span><i className="fa-solid fa-chevron-right" /></Link><Link to="/carrito"><i className="fa-solid fa-bag-shopping" /><span><strong>Mi carrito</strong><small>Continúa tu compra</small></span><i className="fa-solid fa-chevron-right" /></Link></aside>
        </div>
        <section className="profile-security"><div><h2>Sesión y seguridad</h2><p>Administra el acceso y permanencia de tu cuenta.</p></div><div><button className="profile-logout" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket" /> Cerrar sesión</button><button className="profile-delete" onClick={deleteAccount}><i className="fa-regular fa-trash-can" /> Eliminar cuenta</button></div></section>
      </div>
    </main>
  );
};

export default PerfilUsuario;
