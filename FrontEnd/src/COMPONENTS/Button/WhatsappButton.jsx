import React from "react";
import { Whatsapp } from "react-bootstrap-icons";
import "./WhatsappButton.css";

function WhatsappButton() {
  const phoneNumber = "391234567890"; // Inserisci il tuo numero con prefisso internazionale
  const message = "Buongiorno Villa Fenix, vorrei chiedere informazioni per un soggiorno.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-float shadow-lg"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contattaci su WhatsApp"
    >
      <Whatsapp size={32} />
      <span className="tooltip-text bodyCopy">Contattaci</span>
    </a>
  );
}

export default WhatsappButton;

//TODO