import { guardarSesion, obtenerSesion, cerrarSesion } from './storage.js';

export function iniciarSesion(nombreNutriologo) {
    if (!nombreNutriologo || nombreNutriologo.trim() === '') {
        throw new Error('El nombre del nutriólogo es requerido');
    }
    
    const nutriologo = {
        nombre: nombreNutriologo.trim(),
        fechaIngreso: new Date().toISOString()
    };
    
    guardarSesion(nutriologo);
    return nutriologo;
}

export function verificarSesion() {
    const sesion = obtenerSesion();
    return sesion !== null;
}

export function obtenerUsuarioActual() {
    return obtenerSesion();
}

export function cerrarSesionUsuario() {
    cerrarSesion();
}