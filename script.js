// --- NAV y CARRUSEL (Existente) ---
  const navToggle = document.getElementById('navToggle')
  const navLinks = document.getElementById('navLinks')
  navToggle?.addEventListener('click', ()=>{
    navLinks.style.display = navLinks.style.display==='flex'?'none':'flex'
  })

  const carousel=document.getElementById('servicesCarousel')
  const prevBtn=document.getElementById('carouselPrev')
  const nextBtn=document.getElementById('carouselNext')
  function moveCarousel(d){
    const w=carousel.querySelector('.card').offsetWidth+18
    carousel.scrollBy({left:d*w,behavior:'smooth'})
  }
  prevBtn?.addEventListener('click',()=>moveCarousel(-1))
  nextBtn?.addEventListener('click',()=>moveCarousel(1))

  // --- FORMULARIO CONTACTO (Existente) ---
  const formContacto = document.getElementById('contactForm')
  formContacto?.addEventListener('submit',(e)=>{
    e.preventDefault()
    alert('Gracias. Tu solicitud de contacto ha sido recibida.')
    formContacto.reset()
  })

  // =========================================================
  // --- CONTROL DEL MODAL MULTI-PASOS (PLANTILLA CORREGIDO) ---
  // =========================================================
  const modal = document.getElementById('modalPlantilla');
  const abrirBtn = document.getElementById('abrirPlantillaModal');
  const cerrarBtn = document.getElementById('cerrarModal');
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');
  const formSteps = document.querySelectorAll('.form-step');
  let currentStep = 1;

  // Declaración de Variables de los Campos (Asegúrate que estos IDs coincidan con tu HTML)
  const nombreInput = document.getElementById('nombre-plantilla');
  const correoInput = document.getElementById('correo-plantilla');
  const tipoPersonaSelect = document.getElementById('tipoPersona-select');
  const plantillaSelect = document.getElementById('plantilla-select');
  const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
  const opcionApoyoSelect = document.getElementById('opcionApoyo-select');
  const modoEntregaSelect = document.getElementById('modoEntrega-select');
  const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');


  // Abrir y Cerrar Modal
  abrirBtn?.addEventListener('click', (e) => {
    e.preventDefault(); // 🛑 CLAVE: Evita la redirección
    modal.style.display = 'block';
    // Asegura que siempre se inicie en el paso 1
    formSteps.forEach((s, i) => s.classList.remove('active'));
    formSteps[0].classList.add('active');
    currentStep = 1;
  });

  cerrarBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
  
  // Lógica de Mostrar/Ocultar Apoyo (PASO 3)
  requiereApoyoRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      opcionApoyoDiv.style.display = radio.value === 'Si' ? 'block' : 'none';
    });
  });

  // Navegación (Siguiente)
  nextBtns.forEach(button => {
    button.addEventListener('click', () => {
      const currentStepElement = formSteps[currentStep - 1];
      const inputs = currentStepElement.querySelectorAll('[required]');
      let allValid = true;
      
      // Validación de campos del paso actual
      inputs.forEach(input => {
        // Validación básica: comprueba si el campo está visible y vacío
        if (input.offsetParent !== null && !input.value.trim()) {
          allValid = false;
        }
      });

      if (allValid) {
        if (currentStep < formSteps.length) {
          currentStepElement.classList.remove('active');
          currentStep++;
          formSteps[currentStep - 1].classList.add('active');
          if (currentStep === formSteps.length) {
            updateConfirmation(); // Ejecuta la función de resumen en el último paso
          }
        }
      } else {
        alert('⚠️ Por favor, rellena todos los campos marcados como obligatorios.');
      }
    });
  });

  // Navegación (Anterior)
  prevBtns.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep > 1) {
        formSteps[currentStep - 1].classList.remove('active');
        currentStep--;
        formSteps[currentStep - 1].classList.add('active');
      }
    });
  });

  // Función para actualizar la pantalla de confirmación (Paso 5)
  function updateConfirmation() {
    
    // Mapeo para URLs de descarga (Ajusta estas rutas si tus archivos .xlsx están en otra ubicación)
    const rutas = {
      'Moral': { // Empresa
        'estado-resultados': 'plantillas/empresa_estado_resultados.xlsx',
        'flujo-efectivo': 'plantillas/empresa_flujo_efectivo.xlsx',
        'nomina': 'plantillas/empresa_nomina.xlsx',
        'contabilidad-general': 'plantillas/empresa_contabilidad_general.xlsx'
      },
      'Fisica': { // Negocio / Act. Empresarial
        'estado-resultados': 'plantillas/pf_negocio_estado_resultados.xlsx',
        'flujo-efectivo': 'plantillas/pf_negocio_flujo_efectivo.xlsx',
        'nomina': 'plantillas/pf_negocio_nomina.xlsx',
        'contabilidad-general': 'plantillas/pf_negocio_contabilidad_general.xlsx'
      },
      'Independiente': { // Asalariado / Independiente
        'estado-resultados': 'plantillas/pf_ind_estado_resultados.xlsx',
        'flujo-efectivo': 'plantillas/pf_ind_flujo_efectivo.xlsx',
        'nomina': 'plantillas/pf_ind_nomina.xlsx',
        'contabilidad-general': 'plantillas/pf_ind_contabilidad_general.xlsx'
      }
    };

    // Lectura de datos
    const nombre = nombreInput.value;
    const correo = correoInput.value;
    const tipoCliente = tipoPersonaSelect.value; // Valor (Moral, Fisica, Independiente)
    const tipoClienteTexto = tipoPersonaSelect.options[tipoPersonaSelect.selectedIndex].text;
    const plantilla = plantillaSelect.value; // Valor (estado-resultados, flujo-efectivo, etc.)
    const plantillaTexto = plantillaSelect.options[plantillaSelect.selectedIndex].text;
    const requiereApoyo = Array.from(requiereApoyoRadios).find(r => r.checked).value;
    const apoyo = requiereApoyo === 'Si' ? opcionApoyoSelect.options[opcionApoyoSelect.selectedIndex].text : 'No requiere';
    const entrega = modoEntregaSelect.value;
    const entregaTexto = modoEntregaSelect.options[modoEntregaSelect.selectedIndex].text;
    
    // Obtener URL de descarga
    const urlPlantilla = rutas[tipoCliente]?.[plantilla] || '#';


    // 1. Actualizar resumen
    document.getElementById('nombreConfirm').textContent = nombre;
    document.getElementById('correoConfirm').textContent = correo;
    document.getElementById('tipoClienteConfirm').textContent = tipoClienteTexto;
    document.getElementById('plantillaConfirm').textContent = plantillaTexto;
    document.getElementById('apoyoConfirm').textContent = apoyo;
    document.getElementById('entregaConfirm').textContent = entregaTexto;
    
    // 2. Definir Acciones de Entrega
    const accionesDiv = document.getElementById('accionesEntrega');
    accionesDiv.innerHTML = '';
    
    if (entrega === 'descargar' && urlPlantilla !== '#') {
      // Si eligió descargar, ocultamos el botón de "Finalizar" y mostramos el de descarga
      accionesDiv.innerHTML = `<a href="${urlPlantilla}" download class="btn primary lg">🔗 DESCARGAR PLANTILLA AHORA</a><p class="nota">El link de descarga solo es temporal. ¡Guárdalo!</p>`;
      document.getElementById('enviarFormulario').style.display = 'none';
    } else {
      // Si eligió correo, mostramos el botón de "Finalizar"
      accionesDiv.innerHTML = `<p class="nota">Recibirás la plantilla en el correo <strong>${correo}</strong> en unos minutos.</p>`;
      document.getElementById('enviarFormulario').style.display = 'block';
    }
  }

  // Finalizar formulario (Simulación de envío final)
  document.getElementById('enviarFormulario')?.addEventListener('click', () => {
    alert('✅ ¡Gracias! Tu plantilla ha sido solicitada y será enviada por correo.');
    modal.style.display = 'none';
    // Aquí iría el código real para enviar todos los datos al servidor.
  });

