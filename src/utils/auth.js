// src/utils/auth.js

import axios from 'axios';

export const login = async (correo, contraseña) => {
    try {
        const response = await axios.post('http://localhost:5000/api/login', { correo, contraseña });

        // Aquí asumimos que la respuesta contiene el ID del usuario y un token
        localStorage.setItem('userId', response.data.id); // Guardamos el ID del usuario en localStorage
        localStorage.setItem('authToken', response.data.token); // Si usas JWT

        return response.data; // Retornar los datos si es necesario (ID, token, etc.)
    } catch (error) {
        throw new Error('Error al iniciar sesión');
    }
};