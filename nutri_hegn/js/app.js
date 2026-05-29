import { iniciarSesion, verificarSesion, obtenerUsuarioActual, cerrarSesionUsuario } from './auth.js';
import { registrarPaciente, renderizarListaPacientes, llenarSelectPacientes, obtenerInfoPaciente } from './patientManager.js';
import { crearConsulta, renderizarHistorial } from './consultationManager.js';
import { calcularIMC, obtenerDiagnostico } from './utils.js';

// Detectar en qué página estamos
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ==================== LOGIN PAGE ====================
if (currentPage === 'index.html' || currentPage === '') {
    // Si ya hay sesión activa, redirigir al panel
    if (verificarSesion()) {
        window.location.href = 'panel.html';
    }
    
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreInput = document.getElementById('nombreNutriologo');
            const nombre = nombreInput.value.trim();
            
            if (!nombre) {
                errorMessage.textContent = 'Por favor, ingrese su nombre';
                return;
            }
            
            try {
                iniciarSesion(nombre);
                window.location.href = 'panel.html';
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
}

// ==================== PANEL PAGE ====================
if (currentPage === 'panel.html') {
    // Verificar acceso
    if (!verificarSesion()) {
        window.location.href = 'index.html';
    }
    
    // Mostrar bienvenida
    const usuario = obtenerUsuarioActual();
    if (usuario) {
        const bienvenidaElement = document.getElementById('bienvenidaNutriologo');
        if (bienvenidaElement) {
            bienvenidaElement.innerHTML = `Bienvenido(a), <strong>${usuario.nombre}</strong> | ${new Date(usuario.fechaIngreso).toLocaleString()}`;
        }
    }
    
    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            cerrarSesionUsuario();
            window.location.href = 'index.html';
        });
    }
    
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const activeTab = document.getElementById(`${tabId}Tab`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            if (tabId === 'register') {
                renderizarListaPacientes(document.getElementById('listaPacientes'));
            } else if (tabId === 'consultation') {
                llenarSelectPacientes(document.getElementById('selectPaciente'));
            } else if (tabId === 'history') {
                llenarSelectPacientes(document.getElementById('selectPacienteHistorial'));
            }
        });
    });
    
    // Registrar Paciente
    const patientForm = document.getElementById('patientForm');
    const pesoInput = document.getElementById('pesoPaciente');
    const alturaInput = document.getElementById('alturaPaciente');
    const imcResult = document.getElementById('imcResult');
    
    function actualizarIMCPreview() {
        const peso = parseFloat(pesoInput?.value);
        const altura = parseFloat(alturaInput?.value);
        
        if (peso && altura && altura > 0 && imcResult) {
            const imc = calcularIMC(peso, altura);
            const diagnostico = obtenerDiagnostico(imc);
            imcResult.innerHTML = `
                <strong>Vista Previa:</strong><br>
                IMC: ${imc} - Diagnóstico: ${diagnostico}
            `;
        } else if (imcResult) {
            imcResult.innerHTML = '';
        }
    }
    
    if (pesoInput && alturaInput) {
        pesoInput.addEventListener('input', actualizarIMCPreview);
        alturaInput.addEventListener('input', actualizarIMCPreview);
    }
    
    if (patientForm) {
        patientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombrePaciente')?.value;
            const edad = document.getElementById('edadPaciente')?.value;
            const peso = parseFloat(pesoInput?.value);
            const altura = parseFloat(alturaInput?.value);
            
            if (!nombre || !edad || !peso || !altura) {
                alert('Por favor, complete todos los campos');
                return;
            }
            
            const paciente = registrarPaciente(nombre, edad, peso, altura);
            alert(`Paciente registrado exitosamente!\nIMC: ${paciente.imc} - Diagnóstico: ${paciente.diagnostico}`);
            
            patientForm.reset();
            if (imcResult) imcResult.innerHTML = '';
            renderizarListaPacientes(document.getElementById('listaPacientes'));
            
            llenarSelectPacientes(document.getElementById('selectPaciente'));
            llenarSelectPacientes(document.getElementById('selectPacienteHistorial'));
        });
    }
    
    // Nueva Consulta
    const consultationForm = document.getElementById('consultationForm');
    const selectPaciente = document.getElementById('selectPaciente');
    const infoPaciente = document.getElementById('infoPaciente');
    
    if (selectPaciente) {
        llenarSelectPacientes(selectPaciente);
        
        selectPaciente.addEventListener('change', () => {
            const pacienteId = selectPaciente.value;
            if (pacienteId && infoPaciente) {
                const paciente = obtenerInfoPaciente(pacienteId);
                if (paciente) {
                    infoPaciente.innerHTML = `
                        <strong>Paciente Seleccionado:</strong><br>
                        ${paciente.nombre} | Edad: ${paciente.edad} años<br>
                        Peso: ${paciente.peso} kg | Altura: ${paciente.altura} m<br>
                        IMC: ${paciente.imc} (${paciente.diagnostico})
                    `;
                }
            } else if (infoPaciente) {
                infoPaciente.innerHTML = '';
            }
        });
    }
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const pacienteId = selectPaciente?.value;
            const evolucion = document.getElementById('evolucion')?.value;
            const planAlimentacion = document.getElementById('planAlimentacion')?.value;
            const usuario = obtenerUsuarioActual();
            
            if (!pacienteId || !evolucion || !planAlimentacion) {
                alert('Por favor, complete todos los campos');
                return;
            }
            
            crearConsulta(pacienteId, evolucion, planAlimentacion, usuario?.nombre || 'Nutriólogo');
            alert('Consulta guardada exitosamente!');
            
            consultationForm.reset();
            if (selectPaciente) selectPaciente.value = '';
            if (infoPaciente) infoPaciente.innerHTML = '';
            
            llenarSelectPacientes(document.getElementById('selectPaciente'));
            llenarSelectPacientes(document.getElementById('selectPacienteHistorial'));
        });
    }
    
    // Historial
    const selectPacienteHistorial = document.getElementById('selectPacienteHistorial');
    const historialContainer = document.getElementById('historialConsultas');
    
    if (selectPacienteHistorial) {
        llenarSelectPacientes(selectPacienteHistorial);
        
        selectPacienteHistorial.addEventListener('change', () => {
            const pacienteId = selectPacienteHistorial.value;
            if (pacienteId && historialContainer) {
                renderizarHistorial(pacienteId, historialContainer);
            } else if (historialContainer) {
                historialContainer.innerHTML = '<p style="text-align: center; color: #718096;">Seleccione un paciente para ver su historial</p>';
            }
        });
    }
    
    // Cargar datos iniciales
    renderizarListaPacientes(document.getElementById('listaPacientes'));
}