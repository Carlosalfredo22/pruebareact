import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/StyleHomepage.css"; // Tu CSS custom

const App = () => {
  const slidesRef = useRef([]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (slidesRef.current.length === 0) return;
      slidesRef.current[current].classList.remove("active");
      current = (current + 1) % slidesRef.current.length;
      slidesRef.current[current].classList.add("active");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <img src="/src/assets/CarmabeShop.jpg" alt="Logo de empresa" className="logo" />
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido" aria-controls="navbarContenido" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContenido">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#informacion">Información</a></li>
              <li className="nav-item"><a className="nav-link" href="#noticias">Noticias</a></li>
              <li className="nav-item"><a className="nav-link" href="#sobrenosotros">Sobre Nosotros</a></li>
            </ul>

            <form className="d-flex me-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" />
              <button className="btn btn-outline-success" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>

            <a href="/login" className="btn btn-outline-secondary">
              <i className="bi bi-person"></i>
            </a>
          </div>
        </div>
      </nav>

      {/* Carrusel */}
      <section className="carousel">
        <div className="carousel-container">
          {[1, 2, 3].map((num, i) => (
            <div key={i} className={`slide ${i === 0 ? "active" : ""}`} ref={el => (slidesRef.current[i] = el)}>
              <img src={`/src/assets/${num}.jpg`} alt={`Imagen ${num}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="banner">
        <h1 className="title-banner">Inicio de sección</h1>
        <a href="#" className="btn-banner">BOTÓN</a>
      </section>

      {/* Artículo */}
      <section className="article" id="informacion">
        <h2 className="title-article">Información</h2>
        <p className="paragraph-article">
          Aquí encontrarás información útil sobre nuestros productos y servicios.
        </p>
        <div className="galery">
          {["camisa1.jpg", "camisa3.jpeg", "camis4.jpeg", "camisa5.jpg"].map((img, i) => (
            <div className="box-galery" key={i}>
              <div className="box-img">
                <img src={`/src/assets/${img}`} alt="Imagen" />
              </div>
              <a href="#" className="btn-img">BOTÓN</a>
            </div>
          ))}
        </div>
      </section>

      <section className="article" id="noticias">
        <h2 className="title-article">Noticias</h2>
        <p className="paragraph-article">
          Entérate de las últimas novedades y actualizaciones de Carmabe Shop.
        </p>
      </section>

      <section className="article" id="sobrenosotros">
        <h2 className="title-article">Sobre Nosotros</h2>
        <p className="paragraph-article">
          Somos una tienda dedicada a ofrecer moda de calidad y buen servicio desde 2020.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Carmabe Shop. Todos los derechos reservados.</p>
          <p>Contacto: contacto@carmabeshop.com | Tel: +54 11 1234-5678</p>
          <p>Desarrollado con ❤️ por el equipo de Carmabe</p>
        </div>
      </footer>
    </>
  );
};

export default App;
