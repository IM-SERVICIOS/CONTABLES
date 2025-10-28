document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // 1. CONFIGURACIÓN Y DECLARACIÓN DE ELEMENTOS
    // ====================================================================

    // Variables del Modal Principal (Formulario)
    const mainModal = document.getElementById("modalPlantilla");
    // (Asumo que mensajeExito y sus dependencias existen o las eliminas)
    
    // Variables de Botones y Selector
    const btnDescargaDirecta = document.getElementById("openModalBtn"); // Botón: Descargar Ahora (GRATIS)
    const btnsSolicitar = document.querySelectorAll('#openSelectorBtn, #openSelectorBtn_Ingresos, #openSelectorBtn_Gastos'); // Botones: Solicitar Plantilla
    
    // Variables de Lógica Condicional del Modal Multi-pasos
    const nombreInput = document.getElementById('nombre-plantilla');
    const correoInput = document.getElementById('correo-plantilla');
    const tipoPersonaSelect = document.getElementById('tipoPersona');
    // NOTA: ELIMINAMOS plantillaSelect del HTML, ahora es un campo virtual en JS
    const usoPlantillaInput = document.getElementById('usoPlantilla');
    const comentariosInput = document.getElementById('comentarios');
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');
    const opcionApoyoSelect = document.getElementById('opcionApoyo');
    const modoEntregaSelect = document.getElementById('modoEntrega');
    const entregaNota = document.getElementById('entregaNota'); 
    
    // Variables de Navegación del Modal Multi-pasos
    const cerrarBtn = document.getElementById('cerrarModal');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const enviarFormularioBtn = document.getElementById('enviarFormulario');
    
    // Elementos del Nuevo Paso 2 (Listado Visual)
    const plantillaOptionCards = document.querySelectorAll('.plantilla-option-card');
    let currentStep = 1;
    let selectedPlantillaValue = ''; // 🌟 Almacena el valor de la plantilla seleccionada (por listado o gratis)


    // 🚨 CONFIGURACIÓN DEL REGISTRO A GOOGLE SHEETS 🚨
    const GOOGLE_FORM_URL = 'https://forms.gle/pZnqsaGf5k5uh5vJ6'; // Reemplaza con tu URL real
    const FIELD_MAP = {
        'nombre': 'entry.1764658097', 
        'correo': 'entry.1065046570',
        'tipoPersona': 'entry.839337160',
        'plantillaSolicita': 'entry.1744670085', // Usaremos selectedPlantillaValue
        'usoPlantilla': 'entry.1030386183',
        'requiereApoyo': 'entry.1802951737',
        'opcionApoyo': 'entry.1464272175', 
        'modoEntrega': 'entry.793266826', 
        'comentarios': 'entry.1653561268',
        'timestamp': 'entry.1200000000',
    };
    
    // Mapeo de URL de Descarga (Mantener rutas)
    const rutasPlantillas = {
        // ... (Tu objeto rutasPlantillas completo) ...
        'flujo-efectivo': { nombre: 'Flujo de Efectivo', url: 'plantillas/generica_flujo_efectivo.xlsx' }, // Añadido genérico
        'estado-resultados': { nombre: 'Estado de Resultados', url: 'plantillas/generica_estado_resultados.xlsx' },
        'nomina': { nombre: 'Plantilla de Nómina', url: 'plantillas/generica_nomina.xlsx' },
        'contabilidad-general': { nombre: 'Contabilidad General', url: 'plantillas/generica_contabilidad_general.xlsx' },
        // NOTA: La lógica de descarga final usará 'tipoPersona' + 'plantilla' si tienes rutas específicas.
    };


    // ====================================================================
    // 2. LÓGICA DE APERTURA DE BOTONES Y MODAL
    // ====================================================================
    
    const resetModal = () => {
        currentStep = 1;
        selectedPlantillaValue = ''; // Limpiar la plantilla seleccionada
        formSteps.forEach(step => step.classList.remove('active'));
        if (formSteps.length > 0) formSteps[0].classList.add('active');
        // Resetear visualmente las tarjetas
        plantillaOptionCards.forEach(card => card.classList.remove('selected')); 
        // Deshabilitar selector de plantilla si se había deshabilitado antes (por la lógica GRATIS)
        if (tipoPersonaSelect) tipoPersonaSelect.disabled = false;
        // Limpiar inputs (si es necesario)
        document.getElementById('formPlantilla')?.reset();
    };

    // Función para abrir el modal principal
    const openMainModal = (e, isFree = false) => {
        if (e) e.preventDefault();
        resetModal(); // Asegura un estado limpio
        if (mainModal) mainModal.style.display = "block";
        
        if (isFree) {
            // 🌟 Plantilla GRATUITA: Pre-seleccionar y SALTAR PASO 2 (Selección Visual)
            selectedPlantillaValue = 'flujo-efectivo';
            
            // Opcional: Si quieres saltar directamente al paso 3 (Tipo de Cliente)
            if (formSteps.length > 1) {
                formSteps[0].classList.remove('active'); // Paso 1 (Datos de contacto)
                formSteps[1].classList.add('active'); // Paso 2 (Selección Visual) - Aún tiene que pasar por el
                currentStep = 2; // Inicia en el Paso 2

                // HACK: Simular paso siguiente para saltar el listado, si ya seleccionamos
                // Para esto, necesitarías una lógica más compleja que pre-valide el paso 2.
                // LO MÁS FÁCIL es que el botón 'Descargar Ahora' abra en el paso 1, y el usuario haga 'Siguiente'.
            }

            // Marcar la tarjeta visualmente como seleccionada
            const freeCard = document.querySelector('.plantilla-option-card[data-plantilla="flujo-efectivo"]');
            if(freeCard) freeCard.classList.add('selected');
        }
    }

    // A. Botón "Descargar Ahora (GRATIS)"
    btnDescargaDirecta?.addEventListener('click', (e) => openMainModal(e, true));

    // B. Botones "Solicitar Plantilla" (Catálogo)
    btnsSolicitar.forEach(btn => {
        btn.addEventListener('click', (e) => openMainModal(e, false)); // No es gratis, inicia normal
    });
    
    // Cierre del Modal Principal (X) y Clic fuera
    cerrarBtn?.addEventListener('click', () => {
        mainModal.style.display = 'none';
        resetModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target == mainModal) {
            mainModal.style.display = 'none';
            resetModal();
        }
    });


    // ====================================================================
    // 3. LÓGICA DEL NUEVO PASO 2 (SELECCIÓN VISUAL)
    // ====================================================================
    plantillaOptionCards.forEach(card => {
        card.querySelector('.select-plantilla-btn').addEventListener('click', () => {
            // 1. Deseleccionar todo
            plantillaOptionCards.forEach(c => c.classList.remove('selected'));
            
            // 2. Seleccionar la tarjeta actual
            card.classList.add('selected');
            
            // 3. Almacenar el valor
            selectedPlantillaValue = card.getAttribute('data-plantilla');
            
            // 4. Mover al siguiente paso automáticamente
            const currentStepElement = document.querySelector('.form-step[data-step="2"]');
            if (currentStepElement) {
                currentStepElement.classList.remove('active');
                currentStep = 3;
                formSteps[currentStep - 1].classList.add('active');
            }
        });
    });


    // ====================================================================
    // 4. NAVEGACIÓN Y VALIDACIÓN
    // ====================================================================

    // Función de Validación (Asegurar que la Plantilla esté seleccionada)
    const validateStep = (index) => {
        const step = formSteps[index];
        const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;

        if (index === 1) { // Nuevo Paso 2 (Selección Visual)
            if (!selectedPlantillaValue) {
                alert('⚠️ Por favor, selecciona una plantilla para continuar.');
                return false;
            }
            return true;
        }

        inputs.forEach(input => {
             // Lógica de validación visual
            if (input.value.trim() === "") { 
                allValid = false;
                input.style.border = '1px solid red'; 
            } else {
                input.style.border = ''; 
            }
        });

        if (!allValid) {
            alert('⚠️ Por favor, rellena todos los campos marcados como obligatorios.');
        }
        return allValid;
    };
    
    // Asignación de eventos de cambio para lógica condicional (Paso 4)
    const updateEntregaOptions = () => {
        const apoyoSiSeleccionado = document.getElementById('apoyoSi')?.checked;
        if (opcionApoyoDiv) opcionApoyoDiv.style.display = apoyoSiSeleccionado ? 'block' : 'none';

        const descargaOption = modoEntregaSelect ? modoEntregaSelect.querySelector('option[value="descargar"]') : null;
        
        if (descargaOption && entregaNota) {
            // Lógica: Si requiere apoyo, forzamos el correo.
            if (apoyoSiSeleccionado) {
                descargaOption.style.display = 'none';
                modoEntregaSelect.value = 'correo';
                modoEntregaSelect.disabled = true;
                entregaNota.textContent = '🔒 Si requiere apoyo, la plantilla se enviará automáticamente por correo.';
            } else {
                descargaOption.style.display = 'block';
                modoEntregaSelect.disabled = false;
                entregaNota.textContent = 'Elige si quieres descargarla inmediatamente o recibirla por email.';
            }
        }
    };
    
    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', updateEntregaOptions);
    });
    
    updateEntregaOptions();


    // Navegación (Siguiente)
    nextBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep - 1)) {
                if (currentStep < formSteps.length) {
                    formSteps[currentStep - 1].classList.remove('active');
                    currentStep++;
                    formSteps[currentStep - 1].classList.add('active');
                    if (currentStep === formSteps.length) {
                        updateConfirmation();
                    }
                }
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
        const nombre = nombreInput.value;
        const correo = correoInput.value;
        const tipoCliente = tipoPersonaSelect.options[tipoPersonaSelect.selectedIndex].text;
        
        // Obtener el nombre legible de la plantilla usando el valor
        const plantillaName = rutasPlantillas[selectedPlantillaValue]?.nombre || selectedPlantillaValue;

        const requiereApoyo = Array.from(requiereApoyoRadios).find(r => r.checked)?.value || 'No';
        const apoyo = requiereApoyo === 'Si' ? opcionApoyoSelect.options[opcionApoyoSelect.selectedIndex].text : 'No requiere';
        const entrega = modoEntregaSelect.value;
        const entregaTexto = modoEntregaSelect.options[modoEntregaSelect.selectedIndex].text;
        
        // Actualizar resumen
        document.getElementById('nombreConfirm').textContent = nombre;
        document.getElementById('correoConfirm').textContent = correo;
        document.getElementById('tipoClienteConfirm').textContent = tipoCliente;
        document.getElementById('plantillaConfirm').textContent = plantillaName; // Usar el nombre legible
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
    // ENVÍO FINAL DEL FORMULARIO (BOTÓN 'enviarFormulario')
    // ----------------------------------------------------
    if (enviarFormularioBtn) {
        enviarFormularioBtn.addEventListener('click', () => {
            
            const requiereApoyoValor = Array.from(requiereApoyoRadios).find(r => r.checked)?.value || 'No';
            const plantillaCode = selectedPlantillaValue; // Usamos el código guardado
            const tipoPersonaCode = tipoPersonaSelect?.value;

            const formData = {
                nombre: nombreInput?.value.trim(),
                correo: correoInput?.value.trim(),
                tipoPersona: tipoPersonaCode,
                plantillaSolicita: plantillaCode,
                usoPlantilla: usoPlantillaInput?.value.trim(), 
                requiereApoyo: requiereApoyoValor,
                opcionApoyo: (requiereApoyoValor === 'Si') ? opcionApoyoSelect?.value : 'N/A',
                modoEntrega: modoEntregaSelect?.value, 
                comentarios: comentariosInput?.value.trim(),
            };
            
            // 💥 PASO CLAVE: REGISTRAR SOLICITUD A GOOGLE SHEETS 💥
            // Asegúrate de que tu Google Form reciba el código de la plantilla (plantillaCode)
            const dataToSubmit = new FormData();
            dataToSubmit.append(FIELD_MAP.timestamp, new Date().toLocaleString('es-MX')); 
            dataToSubmit.append(FIELD_MAP.nombre, formData.nombre);
            dataToSubmit.append(FIELD_MAP.correo, formData.correo);
            dataToSubmit.append(FIELD_MAP.tipoPersona, formData.tipoPersona);
            dataToSubmit.append(FIELD_MAP.plantillaSolicita, formData.plantillaSolicita); // Usamos el código
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


            // ----------------------------------------------------
            // Lógica de éxito y mensaje final
            // ----------------------------------------------------
            
            alert('✅ ¡Gracias! Tu plantilla ha sido solicitada. Revisa tu correo o inicia la descarga.');
            
            // Descarga directa si aplica
            if (formData.modoEntrega === 'descargar') {
                // Combina el tipo de persona y la plantilla para la ruta final
                const urlKey = `${tipoPersonaCode}-${plantillaCode}`;
                const plantillaInfo = rutasPlantillas[urlKey] || rutasPlantillas[plantillaCode]; // Fallback a genérica si no hay key combinada

                if (plantillaInfo && plantillaInfo.url) {
                    const tempLink = document.createElement('a');
                    tempLink.href = plantillaInfo.url;
                    tempLink.download = `${plantillaInfo.nombre}_${tipoPersonaCode}.xlsx`;
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                } else {
                    console.error('Ruta de descarga no encontrada para:', urlKey);
                }
            }

            // Cierra el modal y resetea el formulario
            if (mainModal) mainModal.style.display = 'none';
            resetModal();
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




