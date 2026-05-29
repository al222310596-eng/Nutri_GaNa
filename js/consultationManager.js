import { guardarConsulta, obtenerConsultasPorPaciente, actualizarConsulta } from './storage.js';
import { formatearFecha, generarID } from './utils.js';
import { obtenerInfoPaciente } from './patientManager.js';

export function crearConsulta(pacienteId, evolucion, planAlimentacion, nutriologo) {
    const consulta = {
        id: generarID(),
        pacienteId: pacienteId,
        evolucion: evolucion,
        planAlimentacion: planAlimentacion,
        fecha: new Date().toISOString(),
        nutriologo: nutriologo
    };
    
    guardarConsulta(consulta);
    return consulta;
}

export function obtenerHistorialPaciente(pacienteId) {
    return obtenerConsultasPorPaciente(pacienteId);
}

export function renderizarHistorial(pacienteId, container) {
    if (!container) return;
    
    if (!pacienteId) {
        container.innerHTML = '<p style="text-align: center; color: #718096;">Seleccione un paciente para ver su historial</p>';
        return;
    }
    
    const consultas = obtenerHistorialPaciente(pacienteId);
    const paciente = obtenerInfoPaciente(pacienteId);
    
    if (!paciente) {
        container.innerHTML = '<p style="text-align: center; color: #f56565;">Paciente no encontrado</p>';
        return;
    }
    
    if (consultas.length === 0) {
        container.innerHTML = `
            <div class="patient-info">
                <h4>${paciente.nombre}</h4>
                <p>Edad: ${paciente.edad} años | IMC: ${paciente.imc} (${paciente.diagnostico})</p>
                <p style="margin-top: 10px; color: #718096;">No hay consultas registradas para este paciente</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="patient-info">
            <h4>${paciente.nombre}</h4>
            <p>Edad: ${paciente.edad} años | IMC: ${paciente.imc} (${paciente.diagnostico})</p>
        </div>
        <h3>Historial de Consultas (${consultas.length})</h3>
        ${consultas.map(consulta => `
            <div class="consultation-card">
                <h4>Consulta del ${formatearFecha(consulta.fecha)}</h4>
                <p class="date">Atendido por: ${consulta.nutriologo}</p>
                <div class="content">
                    <div class="evolution">
                        <strong> Evolución:</strong><br>
                        ${consulta.evolucion}
                    </div>
                    <div class="plan">
                        <strong> Plan de Alimentación:</strong><br>
                        ${consulta.planAlimentacion}
                    </div>
                </div>
            </div>
        `).join('')}
    `;
}

export function actualizarConsultaExistente(consultaId, nuevosDatos) {
    const consultaActualizada = {
        ...nuevosDatos,
        id: consultaId,
        fecha: new Date().toISOString()
    };
    actualizarConsulta(consultaActualizada);
    return consultaActualizada;
}