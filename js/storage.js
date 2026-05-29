const STORAGE_KEYS = {
    NUTRIOLOGO: 'nutriHegn_nutriologo',
    PACIENTES: 'nutriHegn_pacientes',
    CONSULTAS: 'nutriHegn_consultas'
};

export function guardarDatos(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error guardando datos:', error);
        return false;
    }
}

export function obtenerDatos(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error obteniendo datos:', error);
        return [];
    }
}

export function guardarSesion(nutriologo) {
    try {
        sessionStorage.setItem(STORAGE_KEYS.NUTRIOLOGO, JSON.stringify(nutriologo));
        return true;
    } catch (error) {
        console.error('Error guardando sesión:', error);
        return false;
    }
}

export function obtenerSesion() {
    try {
        const sesion = sessionStorage.getItem(STORAGE_KEYS.NUTRIOLOGO);
        return sesion ? JSON.parse(sesion) : null;
    } catch (error) {
        console.error('Error obteniendo sesión:', error);
        return null;
    }
}

export function cerrarSesion() {
    sessionStorage.removeItem(STORAGE_KEYS.NUTRIOLOGO);
}

export function guardarPaciente(paciente) {
    const pacientes = obtenerDatos(STORAGE_KEYS.PACIENTES);
    pacientes.push(paciente);
    guardarDatos(STORAGE_KEYS.PACIENTES, pacientes);
    return paciente;
}

export function obtenerPacientes() {
    return obtenerDatos(STORAGE_KEYS.PACIENTES);
}

export function actualizarPaciente(pacienteActualizado) {
    const pacientes = obtenerPacientes();
    const index = pacientes.findIndex(p => p.id === pacienteActualizado.id);
    if (index !== -1) {
        pacientes[index] = pacienteActualizado;
        guardarDatos(STORAGE_KEYS.PACIENTES, pacientes);
    }
}

export function obtenerPacientePorId(id) {
    const pacientes = obtenerPacientes();
    return pacientes.find(p => p.id === id);
}

export function guardarConsulta(consulta) {
    const consultas = obtenerDatos(STORAGE_KEYS.CONSULTAS);
    consultas.push(consulta);
    guardarDatos(STORAGE_KEYS.CONSULTAS, consultas);
    return consulta;
}

export function obtenerConsultas() {
    return obtenerDatos(STORAGE_KEYS.CONSULTAS);
}

export function actualizarConsulta(consultaActualizada) {
    const consultas = obtenerConsultas();
    const index = consultas.findIndex(c => c.id === consultaActualizada.id);
    if (index !== -1) {
        consultas[index] = consultaActualizada;
        guardarDatos(STORAGE_KEYS.CONSULTAS, consultas);
    }
}

export function obtenerConsultasPorPaciente(pacienteId) {
    const consultas = obtenerConsultas();
    return consultas
        .filter(c => c.pacienteId === pacienteId)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}