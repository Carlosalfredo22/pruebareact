// services/userService.js
import { httpClient } from '../api/HttpClient'; // Importa tu configuración de Axios

export const obtenerUsuarios = () => {
  return httpClient.get('/user'); // Asume que la ruta correcta es '/user'
};