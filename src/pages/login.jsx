import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { httpClient } from '../api/HttpClient';
import '../style/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await httpClient.post('/login', { email, password });
      localStorage.setItem('token', response.data.access_token);

      const userRole = response.data.role;

      if (userRole.includes('cliente')) {
        localStorage.setItem('role', 'cliente');
        navigate('/cliente', { replace: true });
      } else if (userRole.includes('admin')) {
        localStorage.setItem('role', 'admin');
        navigate(from, { replace: true });
      } else {
        localStorage.setItem('role', 'otro');
        navigate('/NoAutorizado', { replace: true });
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${darkMode ? 'dark' : ''}`}>
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Entrar</button>
            {error && <div className="error">{error}</div>}
          </form>
        )}

        <div
          className={`toggle-btn ${darkMode ? 'dark' : ''}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <div className="circle">{darkMode ? '🌙' : '🌞'}</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
