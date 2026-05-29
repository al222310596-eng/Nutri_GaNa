import { guardarPaciente, obtenerPacientes, actualizarPaciente, obtenerPacientePorId } from './storage.js';
import { calcularIMC, obtenerDiagnostico, generarID } from './utils.js';

export function registrarPaciente(nombre, edad, peso, altura) {
    const imc = calcularIMC(peso, altura);
    const diagnostico = obtenerDiagnostico(imc);
    
    const paciente = {
        id: generarID(),
        nombre: nombre,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        imc: imc,
        diagnostico: diagnostico,
        fechaRegistro: new Date().toISOString()
    };
    
    guardarPaciente(paciente);
    return paciente;
}

export function listarPacientes() {
    return obtenerPacientes();
}

export function obtenerInfoPaciente(id) {
    return obtenerPacientePorId(id);
}

export function renderizarListaPacientes(container) {
    if (!container) return;
    
    const pacientes = listarPacientes();
    
    if (pacientes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #718096;">No hay pacientes registrados</p>';
        return;
    }
    
    container.innerHTML = pacientes.map(paciente => `
        <div class="patient-card">
            <h4>${paciente.nombre}</h4>
            <p>Edad: ${paciente.edad} años | Peso: ${paciente.peso} kg | Altura: ${paciente.altura} m</p>
            <p>IMC: ${paciente.imc} - Diagnóstico: <strong>${paciente.diagnostico}</strong></p>
            <p style="font-size: 12px; color: #718096;">Registrado: ${new Date(paciente.fechaRegistro).toLocaleDateString()}</p>
        </div>
    `).join('');
}

export function llenarSelectPacientes(selectElement, incluirPlaceholder = true) {
    if (!selectElement) return;
    
    const pacientes = listarPacientes();
    
    if (incluirPlaceholder) {
        selectElement.innerHTML = '<option value="">-- Seleccione un paciente --</option>';
    } else {
        selectElement.innerHTML = '';
    }
    
    pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.id;
        option.textContent = `${paciente.nombre} - IMC: ${paciente.imc} (${paciente.diagnostico})`;
        selectElement.appendChild(option);
    });
}