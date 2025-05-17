import React from 'react';
import '../style/Footer.css'; // si lo tienes separado

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Carmabe Shop. Todos los derechos reservados.</p>
        <p>Contacto: contacto@carmabeshop.com | Tel: +54 11 1234-5678</p>
        <p>Desarrollado con ❤️ por el equipo de Carmabe</p>
      </div>
    </footer>
  );
}

export default Footer;
