export function calcularIMC(peso, altura) {
    if (!peso || !altura || altura === 0) return null;
    return (peso / (altura * altura)).toFixed(1);
}

export function obtenerDiagnostico(imc) {
    if (!imc) return 'No disponible';
    const imcNum = parseFloat(imc);
    if (imcNum < 18.5) return 'Bajo Peso';
    if (imcNum >= 18.5 && imcNum < 25) return 'Peso Normal';
    if (imcNum >= 25 && imcNum < 30) return 'Sobrepeso';
    return 'Obesidad';
}

export function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function generarID() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}