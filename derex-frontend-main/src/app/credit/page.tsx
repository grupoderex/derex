"use client";

import { useRef } from "react";
import "@/assets/styles/CreditSimulator.css";

export default function Page() {

  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="credit-sim-container">
      <div ref={imageRef} className="credit-sim-image">
        <h1>
          <span>simulador de</span>
          <span>crédito hipotecario</span>
        </h1>
        <p>
          haz la prueba, en minutos sabrás que tan cerca estás de encontrar tu
          nuevo hogar, el hogar de tus sueños
        </p>
      </div>

      <div className="credit-sim-box">
        <div className="credit-sim-box-column">
          <div className="credit-sim-title">Precio de la propiedad*</div>
          <span className="credit-input-prefix-span">
            $
            <input type="number" />
          </span>
        </div>
        <div className="credit-sim-box-column">
          <div className="credit-sim-title">Enganche*</div>
          <span className="credit-input-prefix-span">
            $
            <input type="number" />
          </span>
        </div>
        <div className="credit-sim-box-column">
          <div className="credit-sim-title">¿A cuántos años?</div>
          <span className="credit-input-prefix-span">
            <input type="number" />
            Años
          </span>
        </div>
        <div className="credit-row">
          <div className="credit-sim-box-column">
            <div className="credit-sim-title">Préstamo Bancario</div>
            <div className="credit-result-row">
              <div>$453</div>
              <div>mxn</div>
            </div>
          </div>
          <div className="credit-sim-box-column">
            <div className="credit-sim-title">Pago Mensual**</div>
            <div className="credit-result-row">
              <div>$453</div>
              <div>mxn</div>
            </div>
          </div>
        </div>
      </div>

      <div className="credit-footer">
        <div className="credit-button">COMPARAR</div>
        <sub>
          **La tasa de interés promedio es de 11,28% según el Banco de México.
        </sub>
      </div>
    </div>
  );
}
