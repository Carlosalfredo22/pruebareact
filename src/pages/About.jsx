import React from 'react';
import Navbar from '../components/Navbar';
import '../style/Home.css';

function About() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1 className="home-title">Acerca de</h1>
        <p className="home-text">Esta es la sección Acerca de nuestra aplicación.</p>
      </div>
    </div>
  );
}

export default About;
