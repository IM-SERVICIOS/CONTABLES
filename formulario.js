// CÓDIGO JAVASCRIPT: REEMPLAZA TODO EL CONTENIDO DEL ARCHIVO .JS CON ESTO
document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // 1. CONFIGURACIÓN Y DECLARACIÓN DE ELEMENTOS
    // ====================================================================

    // Variables del Modal Principal
    const mainModal = document.getElementById("modalPlantilla");
    
    // Variables de Lógica Condicional del Modal Multi-pasos
    const nombreInput = document.getElementById('nombre-plantilla');
    const correoInput = document.getElementById('correo-plantilla');
    const tipoPersonaSelect = document.getElementById('tipoPersona');
    
    // Variables de Navegación del Modal Multi-pasos
    const cerrarBtn = document.getElementById('cerrarModal');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const explorerGrid = document.getElementById('plantillaExplorerGrid');
    const enviarFormularioGratisBtn = document.getElementById('enviarFormularioGratis');
    
    let currentStep = 1;
    let selectedPlantillaValue = ''; // Código interno de la plantilla
    let selectedPlantillaName = ''; // Nombre legible de la plantilla
    let selectedPlantillaType = ''; // 'GRATIS' o 'PAGO'

    // 🚨 CONFIGURACIÓN DEL REGISTRO A GOOGLE SHEETS 🚨
    const GOOGLE_FORM_URL = 'https://forms.gle/pZnqsaGf5k5uh5vJ6'; // REEMPLAZA CON TU URL REAL
    const FIELD_MAP = {
        'nombre': 'entry.1764658097', 
        'correo': 'entry.1065046570',
        'tipoPersona': 'entry.839337160',
        'plantillaSolicita': 'entry.1744670085',
        'esPago': 'entry.999999999', // Campo que debes añadir en tu form si quieres registrar el tipo de solicitud
        'timestamp': 'entry.1200000000',
    };
    
    // ====================================================================
    // 2. DATA DE PLANTILLAS Y RUTAS (MODIFICAR AQUÍ)
    // ====================================================================

    const PLANTILLAS_DATA = [
        // GRATUITAS (Flujo de Efectivo) - Disponibles para ambos
        { code: 'flujo-efectivo', name: 'Flujo de Efectivo', desc: 'Control de ingresos y egresos diarios.', type: 'GRATIS', price: 0, url: 'plantillas/generica_flujo_efectivo.xlsx', allowed: ['Fisica', 'Moral'] },
        
        // PAGO
        { code: 'estado-resultados', name: 'Estado de Resultados', desc: 'Calcula la utilidad o pérdida de tu negocio.', type: 'PAGO', price: 15.00, url: 'plantillas/premium_estado_resultados.xlsx', allowed: ['Fisica', 'Moral'], paymentLink: 'https://link-de-pago.com/estado-resultados' },
        { code: 'nomina-fiscal', name: 'Cálculo de Nómina Fiscal', desc: 'Formato para sueldos, deducciones e impuestos.', type: 'PAGO', price: 25.00, url: 'plantillas/premium_nomina_fiscal.xlsx', allowed: ['Moral'], paymentLink: 'https://link-de-pago.com/nomina' },
        { code: 'contabilidad-general', name: 'Contabilidad General', desc: 'Registro completo de activos, pasivos y capital.', type: 'PAGO', price: 40.00, url: 'plantillas/premium_contabilidad_general.xlsx', allowed: ['Moral'], paymentLink: 'https://link-de-pago.com/contabilidad' },
        { code: 'declaracion-anual', name: 'Declaración Anual Simplificada', desc: 'Plantilla de apoyo para tu declaración anual.', type: 'PAGO', price: 30.00, url: 'plantillas/premium_declaracion_anual.xlsx', allowed: ['Fisica'], paymentLink: 'https://link-de-pago.com/declaracion-anual' },

        // Si quieres añadir otra GRATIS, por ejemplo, solo para Física
        // { code: 'caja-chica', name: 'Control de Caja Chica', desc: 'Control de gastos menores.', type: 'GRATIS', price: 0, url: 'plantillas/fisica_caja_chica.xlsx', allowed: ['Fisica'] },
    ];


    // ====================================================================
    // 3. LÓGICA DE APERTURA Y RESET
    // ====================================================================
    
    const resetModal = () => {
        currentStep = 1;
        selectedPlantillaValue = '';
        selectedPlantillaName = '';
        selectedPlantillaType = '';
        formSteps.forEach(step => step.classList.remove('active'));
        if (formSteps.length > 0) formSteps[0].classList.add('active');
        document.getElementById('formPlantilla')?.reset();
        document.querySelectorAll('.form-step input, .form-step select').forEach(input => input.style.border = '');
    };
    
    // Asumiendo que tienes un botón o botones que abren el modal (ej: openModalBtn)
    document.querySelectorAll('#openModalBtn, #openSelectorBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            resetModal(); 
            if (mainModal) mainModal.style.display = "block";
        });
    });

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
    // 4. LÓGICA DE RENDERIZADO DE PLANTILLAS (PASO 3)
    // ====================================================================

    const renderPlantillas = (tipoPersona) => {
        if (!explorerGrid) return;
        explorerGrid.innerHTML = '';
        
        const filteredPlantillas = PLANTILLAS_DATA.filter(p => p.allowed.includes(tipoPersona));
        
        filteredPlantillas.forEach(plantilla => {
            const card = document.createElement('div');
            card.classList.add('plantilla-option-card', `type-${plantilla.type.toLowerCase()}`);
            card.setAttribute('data-plantilla', plantilla.code);
            card.setAttribute('data-nombre', plantilla.name);
            card.setAttribute('data-type', plantilla.type);

            let buttonHTML = '';
            if (plantilla.type === 'GRATIS') {
                // Botón para avanzar al Paso 4 (Confirmación)
                buttonHTML = `<button type="button" class="btn primary select-plantilla-btn" data-action="select-gratis">Seleccionar</button>`;
            } else {
                // Botón con link de pago y manejo de referencia
                buttonHTML = `
                    <p style="font-weight: bold; margin-top: 10px;">Costo: $${plantilla.price.toFixed(2)} USD</p>
                    <a href="${plantilla.paymentLink}" target="_blank" class="btn secondary comprar-plantilla-btn" data-action="comprar-pago">Comprar y Recibir por Correo</a>
                `;
            }

            card.innerHTML = `
                <h3>${plantilla.name} ${plantilla.type === 'GRATIS' ? '🆓' : '💳'}</h3>
                <p>${plantilla.desc}</p>
                ${buttonHTML}
            `;
            
            explorerGrid.appendChild(card);
        });
        
        // Añadir listeners a los nuevos botones
        addPlantillaActionListeners();
    };
    
    const addPlantillaActionListeners = () => {
        document.querySelectorAll('.select-plantilla-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.plantilla-option-card');
                selectedPlantillaValue = card.getAttribute('data-plantilla');
                selectedPlantillaName = card.getAttribute('data-nombre');
                selectedPlantillaType = card.getAttribute('data-type');
                
                // Avanzar al Paso 4 (Confirmación/Descarga GRATIS)
                navigateToStep(4); 
            });
        });
        
        document.querySelectorAll('.comprar-plantilla-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.plantilla-option-card');
                const plantillaName = card.getAttribute('data-nombre');
                const correo = correoInput.value.trim();
                const username = correo.split('@')[0];
                
                // 1. Mensaje de Instrucción (Alerta o Modal de Pago)
                alert(`¡Gracias por tu interés en la plantilla "${plantillaName}"! \n\nInstrucciones de Pago:\n1. Haz clic en ACEPTAR para ir al link de pago.\n2. **IMPORTANTE:** Usa tu email o el username "${username}" como REFERENCIA DE PAGO para que podamos enviarte la plantilla a tu correo.`);
                
                // 2. Registrar la Solicitud de Pago antes de abrir el link
                registrarSolicitud({
                    nombre: nombreInput.value.trim(),
                    correo: correo,
                    tipoPersona: tipoPersonaSelect.value,
                    plantillaSolicita: plantillaName,
                    esPago: 'SI',
                    modoEntrega: 'correo (pago)',
                });

                // El link de pago se abre porque el botón es un <a> con target="_blank"
                // Aquí podrías añadir lógica para cerrar el modal si lo deseas, o dejarlo abierto
                // mainModal.style.display = 'none';
            });
        });
    };


    // ====================================================================
    // 5. NAVEGACIÓN Y VALIDACIÓN
    // ====================================================================
    
    const validateStep = (index) => {
        const step = formSteps[index];
        const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;

        inputs.forEach(input => {
            input.style.border = '';
            if (input.value.trim() === "") { 
                allValid = false;
                input.style.border = '1px solid red'; 
            }
        });
        
        if (index === 0 && allValid && !correoInput.value.includes('@')) { // Paso 1: Correo válido
            allValid = false;
            correoInput.style.border = '1px solid red';
            alert('⚠️ Por favor, ingresa un correo electrónico válido.');
        }

        if (!allValid) {
            alert('⚠️ Por favor, rellena todos los campos marcados con (*).');
        }
        return allValid;
    };
    
    const navigateToStep = (targetStep) => {
        formSteps[currentStep - 1].classList.remove('active');
        currentStep = targetStep;
        formSteps[currentStep - 1].classList.add('active');

        if (targetStep === 3) {
            // Lógica especial para el Paso 3: Renderizar plantillas
            const tipoPersona = tipoPersonaSelect.value;
            document.getElementById('tipoPersonaDisplay').textContent = (tipoPersona === 'Fisica' ? 'Persona Física' : 'Persona Moral');
            renderPlantillas(tipoPersona);
        }
        if (targetStep === 4) {
            updateConfirmation();
        }
    }

    // Navegación (Siguiente)
    nextBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep - 1)) {
                if (currentStep < 4) { // Solo permite avanzar hasta el Paso 3 por el botón
                    navigateToStep(currentStep + 1);
                }
            }
        });
    });

    // Navegación (Anterior)
    prevBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetStepAttr = e.target.getAttribute('data-target-step');
            const targetStep = targetStepAttr ? parseInt(targetStepAttr) : currentStep - 1;

            if (targetStep >= 1) {
                navigateToStep(targetStep);
            }
        });
    });

    // Función para actualizar la pantalla de confirmación (Paso 4 - SOLO GRATIS)
    function updateConfirmation() {
        if (selectedPlantillaType !== 'GRATIS') return; // Solo funciona para la descarga gratuita

        document.getElementById('nombreConfirm').textContent = nombreInput.value;
        document.getElementById('correoConfirm').textContent = correoInput.value;
        document.getElementById('tipoClienteConfirm').textContent = tipoPersonaSelect.options[tipoPersonaSelect.selectedIndex].text;
        document.getElementById('plantillaConfirm').textContent = selectedPlantillaName;
    }


    // ====================================================================
    // 6. ENVÍO FINAL (SOLO PLANTILLA GRATUITA)
    // ====================================================================

    // Función para enviar datos a Google Sheets
    const registrarSolicitud = (formData) => {
        const dataToSubmit = new FormData();
        
        dataToSubmit.append(FIELD_MAP.timestamp, new Date().toLocaleString('es-MX')); 
        dataToSubmit.append(FIELD_MAP.nombre, formData.nombre);
        dataToSubmit.append(FIELD_MAP.correo, formData.correo);
        dataToSubmit.append(FIELD_MAP.tipoPersona, formData.tipoPersona);
        dataToSubmit.append(FIELD_MAP.plantillaSolicita, formData.plantillaSolicita);
        
        // Opcional: registrar si es pago o gratis
        // if (FIELD_MAP.esPago) dataToSubmit.append(FIELD_MAP.esPago, formData.esPago || 'NO'); 

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: dataToSubmit,
        })
        .then(() => console.log('Registro de solicitud enviado a Google Sheets.'))
        .catch(error => console.error('Error al enviar el registro:', error));
    };

    if (enviarFormularioGratisBtn) {
        enviarFormularioGratisBtn.addEventListener('click', () => {
            if (selectedPlantillaType !== 'GRATIS' || !selectedPlantillaValue) return;
            
            const plantillaInfo = PLANTILLAS_DATA.find(p => p.code === selectedPlantillaValue);
            
            if (plantillaInfo && plantillaInfo.url) {
                // 1. Registro a Google Sheets (Flujo GRATIS)
                registrarSolicitud({
                    nombre: nombreInput.value.trim(),
                    correo: correoInput.value.trim(),
                    tipoPersona: tipoPersonaSelect.value,
                    plantillaSolicita: plantillaInfo.name,
                    esPago: 'NO',
                });

                // 2. Descarga directa
                const tempLink = document.createElement('a');
                tempLink.href = plantillaInfo.url;
                tempLink.download = `${plantillaInfo.name}_${tipoPersonaSelect.value}.xlsx`;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                alert(`✅ ¡Descarga Iniciada! Revisa tu carpeta de descargas. También recibirás un link de respaldo en ${correoInput.value}.`);
            } else {
                alert('⚠️ Error al encontrar la ruta de descarga. Por favor, intenta de nuevo o contacta a soporte.');
            }

            // 3. Cierre y Reset
            if (mainModal) mainModal.style.display = 'none';
            resetModal();
        });
    }
// ====================================================================
// CONTROL DEL MEGA MENÚ DESPLEGABLE (CORREGIDO)
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    const megaMenuBtn = document.getElementById('megaMenuBtn');
    
    if (megaMenuBtn) {
        // Buscamos al ancestro li que tiene la clase dropdown
        const dropdownParent = megaMenuBtn.closest('.nav-item.dropdown');

        megaMenuBtn.addEventListener('click', (e) => {
            // Evitamos que el enlace intente saltar a otra sección
            e.preventDefault();
            e.stopPropagation();
            
            // Alterna la clase 'open' para mostrar/ocultar el menú
            if (dropdownParent) {
                dropdownParent.classList.toggle('open');
                console.log("Menú interactuado. Estado:", dropdownParent.classList.contains('open'));
            }
        });

        // Cerrar el menú si se hace clic fuera de él (Mejorado)
        document.addEventListener('click', (e) => {
            if (dropdownParent && !dropdownParent.contains(e.target)) {
                dropdownParent.classList.remove('open');
            }
        });
    }
});

/* FUERZA LA APARICIÓN DEL MENÚ */
.nav-item.dropdown.open .mega-menu {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 99999 !important;
}

/* AJUSTE DE POSICIÓN PARA QUE NO SE ESCONDA */
.mega-menu {
    display: none; 
    position: absolute !important;
    top: 100% !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background-color: #ffffff !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
    border: 1px solid #ddd !important;
}




