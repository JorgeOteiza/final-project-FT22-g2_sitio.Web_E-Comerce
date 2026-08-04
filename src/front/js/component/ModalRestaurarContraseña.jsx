import React from "react";
import "../../styles/modalRestaurarContraseña.css";

const RestaurarContraseña = () => (
  <div className="modal fade" tabIndex="-1" id="modalRestaurarContraseña" aria-labelledby="passwordRecoveryTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content password-recovery-modal">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
        <div className="password-recovery-icon"><i className="fa-solid fa-shield-halved" /></div>
        <span className="wine-eyebrow wine-eyebrow-dark">Cuenta de demostración</span>
        <h2 id="passwordRecoveryTitle">Recuperación protegida</h2>
        <p>El envío de correos y el cambio de contraseña están deshabilitados en esta demo para evitar solicitar datos personales sin un servicio transaccional configurado.</p>
        <p className="password-recovery-note"><i className="fa-regular fa-circle-check" /> Puedes crear una cuenta nueva con un correo ficticio para probar el recorrido completo.</p>
        <button type="button" className="wine-button wine-button-primary" data-bs-dismiss="modal">Entendido</button>
      </div>
    </div>
  </div>
);

export default RestaurarContraseña;
