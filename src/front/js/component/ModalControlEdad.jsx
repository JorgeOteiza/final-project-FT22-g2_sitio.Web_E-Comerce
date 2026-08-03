import React, { useEffect } from "react";
import "../../styles/modalControlEdad.css";
import logoElRinconDelVino from "../../img/logoElRinconDelVino.png";

const ModalControlEdad = () => {
    useEffect(() => {
        if (sessionStorage.getItem("ageVerified") === "true") return undefined;

        const timer = window.setTimeout(() => {
            const element = document.getElementById("staticBackdrop");
            if (!element) return;
            const ageModal = bootstrap.Modal.getOrCreateInstance(element, {
                backdrop: "static",
                keyboard: false,
            });
            ageModal.show();
        }, 650);

        return () => window.clearTimeout(timer);
    }, []);

    const confirmAge = () => sessionStorage.setItem("ageVerified", "true");

    const redirectToSenda = () => {
        window.location.href = "https://www.senda.gob.cl/informacion-sobre-drogas/conoce-mas-sobre-las-drogas/alcohol/";
    };

    return (
        <div className="modal fade age-modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-describedby="ageModalDescription" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal-content-control-edad">
                    <div className="age-modal-accent" aria-hidden="true" />
                    <div className="modal-header-control-edad">
                        <img src={logoElRinconDelVino} className="modal-control" alt="El Rincón del Vino" />
                    </div>
                    <div className="modal-body-control-edad">
                        <span className="age-modal-eyebrow">Consumo responsable</span>
                        <div className="age-modal-icon"><i className="fa-solid fa-wine-glass" /></div>
                        <h1 id="staticBackdropLabel">¿Tienes la edad legal para beber alcohol?</h1>
                        <p id="ageModalDescription">Para ingresar a nuestra tienda debes confirmar que cumples la edad legal vigente en tu país.</p>
                    </div>
                    <div className="modal-footer-control-edad">
                        <button type="button" className="age-modal-button age-modal-confirm" data-bs-dismiss="modal" onClick={confirmAge}>Sí, ingresar</button>
                        <button type="button" className="age-modal-button age-modal-decline" onClick={redirectToSenda}>No, salir</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ModalControlEdad;
