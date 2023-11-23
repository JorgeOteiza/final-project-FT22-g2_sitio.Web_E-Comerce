import React from "react";
import { Link } from "react-router-dom";
import rigoBaby from "../../img/rigo-baby.jpg";
import paymentMethods from "../../img/paymentMethods.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faShield } from "@fortawesome/free-solid-svg-icons";

const OrderDetails = () => {
  const products = [
    {
      name: "Botella de vino",
      quantity: 1,
      price: "40.000",
    },
    {
      name: "Botella de vino",
      quantity: 3,
      price: "45.000",
    },
  ];

  return (
    <section className="col-lg-7 col-md-8 col-sm-12 container-fluid text-center">
      <div className="container-price-button-cart">
        <div className="row align-items-center">
          {/* Botón a la izquierda */}
          <div className="col-auto">
            <button className="mx-3">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Título centrado */}
          <div className="col p-0">
            <h2 className="w-auto">Detalles del Pedido</h2>
          </div>
        </div>
        <div className="p-3">
          {/* CONTENIDO DE PRODUCTOS CARRITO */}
          <div className="contenedor-carrito-hover">
            {/* PRODUCT EXAMPLE CARRITO */}

            {products.map((product) => (
              <div className="product-example-carrito-hover text-nowrap d-flex m-3 px-3">
                <div className="product-image m-2">
                  <img
                    src={rigoBaby}
                    alt="example"
                    width="100px"
                    height="100px"
                    className="border"
                  />
                </div>
                {/* INFORMACIÓN DE PRODUCTO */}
                <div className="product-info-carrito-hover m-3 px-3">
                  <h5>{product.name}</h5>
                  <p>{product.quantity} unidad</p>
                  {/* BOTON AÑADIR Y QUITAR + PRECIO */}
                  <div className="product-price-carrito-hover d-inline-flex align-items-center justify-content-between">
                    <p className=" px-2 price-carrito-hover">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* SUBTOTAL Y BTN IR AL CARRITO */}
          </div>

          <div className="container-price-button-cart">
            <h4 className="subtotal-carrito-price">
              <FontAwesomeIcon icon={faShield} />Opciones seguras al finalizar la compra
            </h4>
            <img
              src={paymentMethods}
              alt="example"
              width="500px"
              height="50px"
              className="border d-flex align-items-center justify-content-center"
            />
            {/* ---- // SUBTOTAL MAS ENVIO Y PRECIO // ---- */}
            <div className="subtotal-envio-precio-metodo-de-pago row">
              <div className="lado-izquierdo-precio-metodo-de-pago col-6 text-start">
                <h5>Subtotal</h5>
                <h5>Envío</h5>
              </div>

              <div className="lado-derecho-precio-metodo-de-pago col-6 text-end">
                <h5>CLP 80.000</h5>
                <h5>Gratis</h5>
              </div>
            </div>

            {/* ---- // PRECIO TOTAL // ---- */}
            <div className="total-precio-metodo-de-pago row">
              <h5 className="col-6 text-start h4">Total (2 items)</h5>
              <h5 className="col-6 text-end h4">$ 80.000</h5>
            </div>
            <Link
              to="/carrito"
              className="d-flex justify-content-center text-decoration-none"
            >
              <button type="button" href="#" className="btn-ir-al-carrito">
                Continuar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
