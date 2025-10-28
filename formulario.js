document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // 1. CONFIGURACIÓN Y DECLARACIÓN DE ELEMENTOS
    // ====================================================================

    // Variables del Modal Principal (Formulario)
    const mainModal = document.getElementById("modalPlantilla"); // *** CORREGIDO: Usando el ID real de tu HTML ***
    const mensajeExito = document.getElementById('mensajeExito'); // Asumo que tienes un div con este ID dentro del modal, si no existe, es posible que falle.
    const mensajeExitoTitulo = mensajeExito ? mensajeExito.querySelector('h3') : null;
    const mensajeExitoContenido = mensajeExito ? mensajeExito.querySelector('p') : null;
    const mensajeExitoSocial = mensajeExito ? mensajeExito.querySelector('.social-icons') : null;

    // Variables de Botones y Selector
    const btnDescargaDirecta = document.getElementById("openModalBtn"); // Botón: Descargar Ahora (GRATIS)
    const btnSolicitarSelector = document.getElementById("openSelectorBtn"); // Botón: Solicitar Plantilla (Abre selector)
    const selectorModal = document.getElementById("selectorModal");
    const closeSelector = selectorModal ? selectorModal.querySelector(".close-selector") : null;
    const optionFree = document.getElementById("optionFree"); // Botón interno del selector
    
    // Variables de Lógica Condicional del Modal Multi-pasos
    const nombreInput = document.getElementById('nombre-plantilla');
    const correoInput = document.getElementById('correo-plantilla');
    const tipoPersonaSelect = document.getElementById('tipoPersona');
    const plantillaSelect = document.getElementById('plantilla-select');
    const usoPlantillaInput = document.getElementById('usoPlantilla');
    const comentariosInput = document.getElementById('comentarios');
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');
    const opcionApoyoSelect = document.getElementById('opcionApoyo');
    const modoEntregaSelect = document.getElementById('modoEntrega');
    const entregaNota = document.getElementById('entregaNota'); // Si existe esta nota informativa

    // Variables de Navegación del Modal Multi-pasos
    const cerrarBtn = document.getElementById('cerrarModal');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    const enviarFormularioBtn = document.getElementById('enviarFormulario');
    let currentStep = 1;


    // 🚨 CONFIGURACIÓN DEL REGISTRO A GOOGLE SHEETS 🚨
    const GOOGLE_FORM_URL = 'https://forms.gle/pZnqsaGf5k5uh5vJ6'; // Reemplaza con tu URL real
    const FIELD_MAP = {
        'nombre': 'entry.1764658097', 
        'correo': 'entry.1065046570',
        'tipoPersona': 'entry.839337160',
        'plantillaSolicita': 'entry.1744670085',
        'usoPlantilla': 'entry.1030386183',
        'requiereApoyo': 'entry.1802951737',
        'opcionApoyo': 'entry.1464272175', 
        'modoEntrega': 'entry.793266826', 
        'comentarios': 'entry.1653561268',
        'timestamp': 'entry.1200000000',
    };
    
    // Mapeo de URL de Descarga (Asegúrate de que estas rutas sean correctas)
    const rutasPlantillas = {
        'Moral-estado-resultados': { nombre: 'Estado de Resultados', url: 'plantillas/moral_estado_resultados.xlsx' },
        'Moral-flujo-efectivo': { nombre: 'Flujo de Efectivo', url: 'plantillas/moral_flujo_efectivo.xlsx' },
        // ... (resto de las rutas)
        'Moral-nomina': { nombre: 'Plantilla de Nómina', url: 'plantillas/moral_nomina.xlsx' },
        'Moral-contabilidad-general': { nombre: 'Contabilidad General', url: 'plantillas/moral_contabilidad_general.xlsx' },
        'Fisica-estado-resultados': { nombre: 'Estado de Resultados', url: 'plantillas/fisica_estado_resultados.xlsx' },
        'Fisica-flujo-efectivo': { nombre: 'Flujo de Efectivo', url: 'plantillas/fisica_flujo_efectivo.xlsx' },
        'Fisica-nomina': { nombre: 'Plantilla de Nómina', url: 'plantillas/fisica_nomina.xlsx' },
        'Fisica-contabilidad-general': { nombre: 'Contabilidad General', url: 'plantillas/fisica_contabilidad_general.xlsx' },
        'No sabe-estado-resultados': { nombre: 'Estado de Resultados Genérico', url: 'plantillas/generica_estado_resultados.xlsx' },
        'No sabe-flujo-efectivo': { nombre: 'Flujo de Efectivo Genérico', url: 'plantillas/generica_flujo_efectivo.xlsx' },
        'No sabe-nomina': { nombre: 'Plantilla de Nómina Genérica', url: 'plantillas/generica_nomina.xlsx' },
        'No sabe-contabilidad-general': { nombre: 'Contabilidad General Genérica', url: 'plantillas/generica_contabilidad_general.xlsx' },
    };


    // ====================================================================
    // 2. LÓGICA DE APERTURA DE BOTONES (Selector y Modal Directo)
    // ====================================================================
    
    // Función para abrir el modal principal
    const openMainModal = (e) => {
        if (e) e.preventDefault();
        if (mainModal) mainModal.style.display = "block";
        // Asegurar que el modal inicie en el primer paso al abrir
        formSteps.forEach(step => step.classList.remove('active'));
        if (formSteps.length > 0) formSteps[0].classList.add('active');
        currentStep = 1;
    }

    // A. Botón "Descargar Ahora (GRATIS)" - Abre el modal principal
    if (btnDescargaDirecta && mainModal) {
        btnDescargaDirecta.addEventListener('click', (e) => { // CAMBIAMOS openMainModal por una función anónima
            if (e) e.preventDefault();
            
            // 1. Abrir el modal principal
            if (mainModal) mainModal.style.display = "block";
            
            // 2. Asegurar que el modal inicie en el primer paso
            formSteps.forEach(step => step.classList.remove('active'));
            if (formSteps.length > 0) formSteps[0].classList.add('active');
            currentStep = 1;

            // 🌟🌟🌟 MODIFICACIÓN CLAVE: PRE-SELECCIONAR PLANTILLA GRATUITA 🌟🌟🌟
            // Asumiendo que 'flujo-efectivo' es la plantilla que quieres dar GRATIS
            if (plantillaSelect) {
                 plantillaSelect.value = 'flujo-efectivo'; 
            }
            // Opcional: Deshabilitar el selector de plantilla para que el usuario no cambie
            // if (plantillaSelect) {
            //      plantillaSelect.disabled = true; 
            // }

        });
    }

// B. Botón "Solicitar Plantilla" - Abre el Selector
    if (btnSolicitarSelector && selectorModal) {
        btnSolicitarSelector.addEventListener('click', (e) => {
            e.preventDefault();
            // 🌟 Limpiar la pre-selección de plantilla
            if (plantillaSelect) {
                 plantillaSelect.value = ''; 
                 plantillaSelect.disabled = false; // Asegura que esté habilitado para elegir
            }
            selectorModal.style.display = "block";
        });
    }
    }

    // C. Manejo del Selector
    if (selectorModal && mainModal) {
        // Cierre con (X)
        if (closeSelector) {
            closeSelector.addEventListener('click', () => {
                selectorModal.style.display = "none";
            });
        }
        
        // Cierre al hacer clic fuera
        window.addEventListener('click', (event) => {
            if (event.target === selectorModal) {
                selectorModal.style.display = "none";
            }
        });

        // Opción 'Gratis' en el Selector: Cierra selector y abre el formulario principal
        if (optionFree) {
            optionFree.addEventListener('click', (e) => {
                selectorModal.style.display = "none"; 
                openMainModal(e);
            });
        }
    }

    // D. Cierre del Modal Principal (X) y Clic fuera
    if (cerrarBtn && mainModal) {
        cerrarBtn.addEventListener('click', () => {
            mainModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == mainModal) {
                mainModal.style.display = 'none';
            }
        });
    }


    // ====================================================================
    // 3. LÓGICA DE FORMULARIO MULTI-PASOS (MIGRADA Y ADAPTADA)
    // ====================================================================

    // FUNCIÓN PARA ENVIAR DATOS A GOOGLE SHEETS
    const registrarSolicitud = (formData) => {
        const dataToSubmit = new FormData();
        
        dataToSubmit.append(FIELD_MAP.timestamp, new Date().toLocaleString('es-MX')); 
        dataToSubmit.append(FIELD_MAP.nombre, formData.nombre);
        dataToSubmit.append(FIELD_MAP.correo, formData.correo);
        dataToSubmit.append(FIELD_MAP.tipoPersona, formData.tipoPersona);
        dataToSubmit.append(FIELD_MAP.plantillaSolicita, formData.plantillaSolicita);
        dataToSubmit.append(FIELD_MAP.usoPlantilla, formData.usoPlantilla);
        dataToSubmit.append(FIELD_MAP.requiereApoyo, formData.requiereApoyo);
        dataToSubmit.append(FIELD_MAP.opcionApoyo, formData.opcionApoyo);
        dataToSubmit.append(FIELD_MAP.modoEntrega, formData.modoEntrega);
        dataToSubmit.append(FIELD_MAP.comentarios, formData.comentarios);

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: dataToSubmit,
        })
        .then(() => console.log('Registro de solicitud enviado a Google Sheets.'))
        .catch(error => console.error('Error al enviar el registro:', error));
    };

    // Lógica Condicional (Apoyo y Modo de Entrega)
    const updateEntregaOptions = () => {
        const apoyoSiSeleccionado = document.getElementById('apoyoSi')?.checked || 
                                    (Array.from(requiereApoyoRadios).find(r => r.checked)?.value === 'Si');

        if (opcionApoyoDiv) opcionApoyoDiv.style.display = apoyoSiSeleccionado ? 'block' : 'none';

        const descargaOption = modoEntregaSelect ? modoEntregaSelect.querySelector('option[value="descargar"]') : null;
        
        if (descargaOption && entregaNota) {
            if (apoyoSiSeleccionado) {
                descargaOption.style.display = 'none';
                modoEntregaSelect.value = 'correo';
                modoEntregaSelect.disabled = true;
                entregaNota.textContent = '🔒 Si requiere apoyo, la plantilla se enviará automáticamente por correo.';
            } else {
                descargaOption.style.display = 'block';
                modoEntregaSelect.disabled = false;
                if(modoEntregaSelect.value === 'correo' && modoEntregaSelect.disabled === false) {
                    modoEntregaSelect.value = ''; // Limpia si estaba en 'correo' antes
                }
                entregaNota.textContent = 'Elige si quieres descargarla inmediatamente o recibirla por email.';
            }
        }
    };
    
    // Asignación de eventos de cambio para lógica condicional
    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', updateEntregaOptions);
    });
    
    if (modoEntregaSelect) {
        updateEntregaOptions();
    }
    
    // Función para actualizar la pantalla de confirmación (Paso 5)
    function updateConfirmation() {
        const nombre = nombreInput.value;
        const correo = correoInput.value;
        const tipoCliente = tipoPersonaSelect.options[tipoPersonaSelect.selectedIndex].text;
        const plantilla = plantillaSelect.options[plantillaSelect.selectedIndex].text;
        const requiereApoyo = Array.from(requiereApoyoRadios).find(r => r.checked).value;
        const apoyo = requiereApoyo === 'Si' ? opcionApoyoSelect.options[opcionApoyoSelect.selectedIndex].text : 'No requiere';
        const entrega = modoEntregaSelect.value;
        const entregaTexto = modoEntregaSelect.options[modoEntregaSelect.selectedIndex].text;
        
        // Actualizar resumen (Asegúrate de tener estos IDs en el HTML del Paso 5)
        document.getElementById('nombreConfirm').textContent = nombre;
        document.getElementById('correoConfirm').textContent = correo;
        document.getElementById('tipoClienteConfirm').textContent = tipoCliente;
        document.getElementById('plantillaConfirm').textContent = plantilla;
        document.getElementById('apoyoConfirm').textContent = apoyo;
        document.getElementById('entregaConfirm').textContent = entregaTexto;
        
        // Acciones de Entrega
        const accionesDiv = document.getElementById('accionesEntrega');
        if (accionesDiv) {
             accionesDiv.innerHTML = '';
             if (entrega === 'descargar') {
                accionesDiv.innerHTML = '<p class="nota">La descarga será inmediata al finalizar la solicitud.</p>';
                enviarFormularioBtn.textContent = 'Finalizar y Descargar';
            } else {
                accionesDiv.innerHTML = '<p class="nota">Recibirás la plantilla en el correo en unos minutos.</p>';
                enviarFormularioBtn.textContent = 'Finalizar Solicitud';
            }
        }
    }


    // ----------------------------------------------------
    // NAVEGACIÓN ENTRE PASOS
    // ----------------------------------------------------

    // Navegación (Siguiente)
    nextBtns.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepElement = formSteps[currentStep - 1];
            // Aquí puedes agregar la validación de campos del paso actual
            let allValid = true; 
            // ... (Tu código de validación de campos obligatorios aquí)

            if (allValid) {
                if (currentStep < formSteps.length) {
                    currentStepElement.classList.remove('active');
                    currentStep++;
                    formSteps[currentStep - 1].classList.add('active');
                    if (currentStep === formSteps.length) {
                        updateConfirmation();
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

    // ----------------------------------------------------
    // ENVÍO FINAL DEL FORMULARIO (BOTÓN 'enviarFormulario')
    // ----------------------------------------------------
    if (enviarFormularioBtn) {
        enviarFormularioBtn.addEventListener('click', () => {
            
            const requiereApoyoValor = Array.from(requiereApoyoRadios).find(r => r.checked)?.value || 'No';

            const formData = {
                nombre: nombreInput?.value.trim(),
                correo: correoInput?.value.trim(),
                tipoPersona: tipoPersonaSelect?.value,
                plantillaSolicita: plantillaSelect?.value,
                usoPlantilla: usoPlantillaInput?.value.trim(), 
                requiereApoyo: requiereApoyoValor,
                opcionApoyo: (requiereApoyoValor === 'Si') ? opcionApoyoSelect?.value : 'N/A',
                modoEntrega: modoEntregaSelect?.value, 
                comentarios: comentariosInput?.value.trim(),
            };
            
            // 💥 PASO CLAVE: REGISTRAR SOLICITUD A GOOGLE SHEETS 💥
            registrarSolicitud(formData);

            const urlKey = `${formData.tipoPersona}-${formData.plantillaSolicita}`;
            const plantillaInfo = rutasPlantillas[urlKey];

            // ----------------------------------------------------
            // Lógica de éxito y mensaje final (Necesita un div con id="mensajeExito" en tu HTML)
            // ----------------------------------------------------
            
            // Si tienes un mensaje de éxito, úsalo. Si no, usa un simple alert.
            alert('✅ ¡Gracias! Tu plantilla ha sido solicitada. Revisa tu correo o inicia la descarga.');
            
            // Descarga directa si aplica (Solo si no hay mensajeExito visual)
            if (formData.modoEntrega === 'descargar' && plantillaInfo && plantillaInfo.url) {
                // Crea un enlace temporal y simula un clic para forzar la descarga
                const tempLink = document.createElement('a');
                tempLink.href = plantillaInfo.url;
                tempLink.download = `${plantillaInfo.nombre}.xlsx`;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            }

            // Cierra el modal y resetea el formulario
            if (mainModal) mainModal.style.display = 'none';
            // Si el formulario estuviera envuelto en un <form>, lo haríamos: form.reset();
            // Como son inputs sueltos, solo cerramos.

            // Puedes añadir un reset visual de los inputs si lo deseas.
        });
    }

    // Lógica para el formulario de Contacto (El del final de la página)
    const formContacto = document.getElementById('contactForm');
    formContacto?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Gracias. Tu solicitud de contacto ha sido recibida.');
        formContacto.reset();
    });

});





