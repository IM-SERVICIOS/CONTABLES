const abrir = document.getElementById('abrirPlantilla');
const modal = document.getElementById('modalPlantilla');
const cerrar = document.getElementById('cerrarModal');
const steps = document.querySelectorAll('.form-step');
let currentStep = 1;

abrir.addEventListener('click', e => {
  e.preventDefault();
  modal.style.display = 'flex';
  showStep(1);
});
cerrar.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target == modal) modal.style.display = 'none'; });

function showStep(step) {
  steps.forEach(s => s.classList.remove('active'));
  document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
  currentStep = step;
}

document.querySelectorAll('.next-step').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep === 1 && (!nombre.value || !correo.value))
      return alert('Por favor completa tus datos.');
    if (currentStep === 2 && !tipoCliente.value)
      return alert('Selecciona tu tipo de cliente.');
    if (currentStep === 3 && (!plantilla.value || !requiereApoyo.value))
      return alert('Selecciona la plantilla y si requiere apoyo.');
    if (currentStep === 4 && !modoEntrega.value)
      return alert('Selecciona el modo de entrega.');
    showStep(currentStep + 1);

    if (currentStep === 5) {
      document.getElementById('nombreConfirm').textContent = nombre.value;
      document.getElementById('correoConfirm').textContent = correo.value;
      document.getElementById('clienteConfirm').textContent = tipoCliente.options[tipoCliente.selectedIndex].text;
      document.getElementById('plantillaConfirm').textContent = plantilla.options[plantilla.selectedIndex].text;
      document.getElementById('apoyoConfirm').textContent = requiereApoyo.options[requiereApoyo.selectedIndex].text;
      document.getElementById('entregaConfirm').textContent = modoEntrega.options[modoEntrega.selectedIndex].text;

      const entrega = modoEntrega.value;
      const tipo = tipoCliente.value;
      const plantillaSel = plantilla.value;
      const accionesDiv = document.getElementById('accionesEntrega');
      accionesDiv.innerHTML = '';

      const rutas = {
        'empresa': {
          'estado-resultados': 'plantillas/empresa_estado_resultados.xlsx',
          'flujo-efectivo': 'plantillas/empresa_flujo_efectivo.xlsx',
          'nomina': 'plantillas/empresa_nomina.xlsx',
          'contabilidad': 'plantillas/empresa_contabilidad.xlsx'
        },
        'persona-fisica': {
          'estado-resultados': 'plantillas/pf_estado_resultados.xlsx',
          'flujo-efectivo': 'plantillas/pf_flujo_efectivo.xlsx',
          'nomina': 'plantillas/pf_nomina.xlsx',
          'contabilidad': 'plantillas/pf_contabilidad.xlsx'
        },
        'independiente': {
          'estado-resultados': 'plantillas/ind_estado_resultados.xlsx',
          'flujo-efectivo': 'plantillas/ind_flujo_efectivo.xlsx',
          'nomina': 'plantillas/ind_nomina.xlsx',
          'contabilidad': 'plantillas/ind_contabilidad.xlsx'
        }
      };

      const urlPlantilla = rutas[tipo]?.[plantillaSel] || '';

      if (entrega === 'descargar' && urlPlantilla) {
        accionesDiv.innerHTML = `<a href="${urlPlantilla}" download class="descargar-link">⬇ Descargar plantilla</a>`;
      } else if (entrega === 'correo') {
        accionesDiv.innerHTML = `<p>Tu solicitud será enviada al correo: <strong>${correo.value}</strong>. Recibirás el archivo en minutos.</p>`;
      }
    }
  });
});

document.querySelectorAll('.prev-step').forEach(btn => {
  btn.addEventListener('click', () => showStep(currentStep - 1));
});

document.getElementById('enviarFormulario').addEventListener('click', () => {
  alert('✅ Solicitud procesada correctamente.');
  modal.style.display = 'none';
});
