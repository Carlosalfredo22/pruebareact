import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/StyleHomepage.css";

import logo from "../assets/CarmabeShop.jpg";
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";

import camisa1 from "../assets/camisa1.jpg";
import camisa3 from "../assets/camisa3.jpeg";
import camis4 from "../assets/camis4.jpeg";
import camisa5 from "../assets/camisa5.jpg";

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const carouselImages = [img1, img2, img3];
  const galleryImages = [camisa1, camisa3, camis4, camisa5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Función para togglear el menú en mobile
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <img
            src={logo}
            alt="Logo de empresa"
            className="logo"
            style={{ height: "50px" }}
          />
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarContenido"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarContenido"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#informacion" onClick={() => setMenuOpen(false)}>
                  Información
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#noticias" onClick={() => setMenuOpen(false)}>
                  Noticias
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#sobrenosotros" onClick={() => setMenuOpen(false)}>
                  Sobre Nosotros
                </a>
              </li>
            </ul>

            <form className="d-flex me-3" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Buscar"
              />
              <button className="btn btn-outline-primary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>

            <a href="/login" className="btn btn-outline-primary">
              <i className="bi bi-person"></i>
            </a>
          </div>
        </div>
      </nav>

      {/* Carrusel */}
      <section className="carousel my-4">
        <div
          className="carousel-container position-relative overflow-hidden"
          style={{ height: "400px" }}
        >
          {carouselImages.map((img, i) => (
            <div
              key={i}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                opacity: i === currentSlide ? 1 : 0,
                transition: "opacity 1s ease",
                zIndex: i === currentSlide ? 10 : 0,
              }}
            >
              <img
                src={img}
                alt={`Imagen carrusel ${i + 1}`}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section
        className="banner text-center py-3 mb-3"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <h1 className="title-banner display-5 mb-2">Inicio de sección</h1>
        <a href="#" className="btn btn-primary btn-lg">
          BOTÓN
        </a>
      </section>

      {/* Artículo - Información */}
      <section className="article container mb-3" id="informacion">
        <h2 className="title-article mb-2">Información</h2>
        <p className="paragraph-article mb-3">
          Aquí encontrarás información útil sobre nuestros productos y servicios.
        </p>
        <div className="galery row g-3">
          {galleryImages.map((img, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="box-galery card h-100">
                <div className="box-img">
                  <img
                    src={img}
                    alt={`Camisa modelo ${i + 1}`}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                </div>
                <div className="card-body text-center">
                  <a href="#" className="btn btn-primary btn-img">
                    BOTÓN
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artículo - Noticias */}
      <section className="article container mb-3" id="noticias">
        <h2 className="title-article mb-2">Noticias</h2>
        <p className="paragraph-article">
          Entérate de las últimas novedades y actualizaciones de Carmabe Shop.
        </p>
      </section>

      {/* Artículo - Sobre Nosotros */}
      <section className="article container mb-3" id="sobrenosotros">
        <h2 className="title-article mb-2">Sobre Nosotros</h2>
        <p className="paragraph-article">
          Somos una tienda dedicada a ofrecer moda de calidad y buen servicio desde 2020.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-4">
        <div className="footer-content container">
          <p className="mb-1">&copy; 2025 Carmabe Shop. Todos los derechos reservados.</p>
          <p className="mb-1">Contacto: contacto@carmabeshop.com | Tel: +54 11 1234-5678</p>
          <p>Desarrollado con ❤️ por el equipo de Carmabe</p>
        </div>
      </footer>
    </>
  );
};

export default App;
