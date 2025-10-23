document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // 1. CONFIGURACIÓN Y DECLARACIÓN DE ELEMENTOS
    // ====================================================================

    // Variables del Modal Principal (Formulario)
    const mainModal = document.getElementById("modalPlantilla"); // *** ¡CORREGIDO! Usa el ID real de tu HTML ***
    const form = document.getElementById('solicitudForm');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeExitoTitulo = mensajeExito ? mensajeExito.querySelector('h3') : null;
    const mensajeExitoContenido = mensajeExito ? mensajeExito.querySelector('p') : null;
    const mensajeExitoSocial = mensajeExito ? mensajeExito.querySelector('.social-icons') : null;

    // Variables de Lógica Condicional
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');
    const modoEntregaSelect = document.getElementById('modoEntrega');
    const entregaNota = document.getElementById('entregaNota');
    
    // Variables de Botones y Selector
    const btnDescargaDirecta = document.getElementById("openModalBtn"); // Botón: Descargar Ahora (GRATIS)
    const btnSolicitarSelector = document.getElementById("openSelectorBtn"); // Botón: Solicitar Plantilla (Abre selector)
    const selectorModal = document.getElementById("selectorModal");
    const closeSelector = selectorModal ? selectorModal.querySelector(".close-selector") : null;
    const optionFree = document.getElementById("optionFree"); // Botón interno del selector

    // 🚨 CONFIGURACIÓN DEL REGISTRO A GOOGLE SHEETS 🚨
    const GOOGLE_FORM_URL = 'https://forms.gle/pZnqsaGf5k5uh5vJ6'; 
    const CATALOGO_URL = 'catalogo-adicional.html'; // URL de tu nuevo catálogo
    
    // CÓDIGOS ENTRY.XXXXX
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
    
    // Mapeo de URL de Descarga
    const rutasPlantillas = {
        'Moral-estado-resultados': { nombre: 'Estado de Resultados', url: 'plantillas/moral_estado_resultados.xlsx' },
        'Moral-flujo-efectivo': { nombre: 'Flujo de Efectivo', url: 'plantillas/moral_flujo_efectivo.xlsx' },
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

    // A. Botón "Descargar Ahora (GRATIS)" - Abre el modal principal directamente
    if (btnDescargaDirecta && mainModal) {
        btnDescargaDirecta.addEventListener('click', (e) => {
            e.preventDefault();
            mainModal.style.display = "block"; 
        });
    }

    // B. Botón "Solicitar Plantilla" - Abre el Selector
    if (btnSolicitarSelector && selectorModal) {
        btnSolicitarSelector.addEventListener('click', (e) => {
            e.preventDefault();
            selectorModal.style.display = "block";
        });
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
            optionFree.addEventListener('click', () => {
                selectorModal.style.display = "none"; 
                mainModal.style.display = "block";   
            });
        }
        
        // Opción 'Explorar Opciones': Redirecciona (manejado por el <a> en HTML, no necesita JS aquí)
    }


    // ====================================================================
    // 3. FUNCIONES CORE DEL FORMULARIO ORIGINAL
    // ====================================================================

    // FUNCIÓN PARA ENVIAR DATOS A GOOGLE SHEETS
    const registrarSolicitud = (formData) => {
        const dataToSubmit = new FormData();
        
        // 1. Añadir fecha y hora
        dataToSubmit.append(FIELD_MAP.timestamp, new Date().toLocaleString('es-MX')); 
        
        // 2. Mapear y añadir los demás campos
        dataToSubmit.append(FIELD_MAP.nombre, formData.nombre);
        dataToSubmit.append(FIELD_MAP.correo, formData.correo);
        dataToSubmit.append(FIELD_MAP.tipoPersona, formData.tipoPersona);
        dataToSubmit.append(FIELD_MAP.plantillaSolicita, formData.plantillaSolicita);
        dataToSubmit.append(FIELD_MAP.usoPlantilla, formData.usoPlantilla);
        dataToSubmit.append(FIELD_MAP.requiereApoyo, formData.requiereApoyo);
        dataToSubmit.append(FIELD_MAP.opcionApoyo, formData.opcionApoyo);
        dataToSubmit.append(FIELD_MAP.modoEntrega, formData.modoEntrega);
        dataToSubmit.append(FIELD_MAP.comentarios, formData.comentarios);

        // Envío de los datos al Google Form
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
        const apoyoSiSeleccionado = document.getElementById('apoyoSi')?.checked;
        opcionApoyoDiv.style.display = apoyoSiSeleccionado ? 'block' : 'none';

        const descargaOption = modoEntregaSelect ? modoEntregaSelect.querySelector('option[value="descarga"]') : null;
        
        if (descargaOption) { // Asegura que el elemento existe
            if (apoyoSiSeleccionado) {
                // Si requiere apoyo, no puede descargar, se envía por correo
                descargaOption.style.display = 'none';
                modoEntregaSelect.value = 'correo';
                modoEntregaSelect.disabled = true;
                entregaNota.textContent = '🔒 Si requiere apoyo (tutorial o meet), la plantilla se enviará automáticamente por correo.';
            } else {
                // Si NO requiere apoyo, puede elegir
                descargaOption.style.display = 'block';
                modoEntregaSelect.disabled = false;
                
                if(modoEntregaSelect.value === 'correo' && modoEntregaSelect.disabled === false) {
                    modoEntregaSelect.value = ''; // Limpia si estaba en 'correo' antes
                }
                
                entregaNota.textContent = 'Elige si quieres descargarla inmediatamente o recibirla por email.';
            }
        }
    };
    
    // Asignación de eventos de cambio
    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', updateEntregaOptions);
    });
    
    // Ejecutar al inicio
    if (modoEntregaSelect) {
        updateEntregaOptions();
    }


    // 4. Manejo del Envío del Formulario (Evento 'submit')
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores
            const requiereApoyoValor = document.querySelector('input[name="requiereApoyo"]:checked')?.value || 'No';

            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                correo: document.getElementById('correo').value.trim(),
                tipoPersona: document.getElementById('tipoPersona').value,
                plantillaSolicita: document.getElementById('plantillaSolicita').value,
                usoPlantilla: document.getElementById('usoPlantilla').value.trim(),
                requiereApoyo: requiereApoyoValor,
                opcionApoyo: (requiereApoyoValor === 'Si') ? document.getElementById('opcionApoyo').value : 'N/A',
                modoEntrega: modoEntregaSelect.value, 
                comentarios: document.getElementById('comentarios').value.trim(),
            };

            const plantillaSelect = document.getElementById('plantillaSolicita');
            const plantillaTexto = plantillaSelect.options[plantillaSelect.selectedIndex].text;
            
            // Validación de campos obligatorios
            if (!formData.nombre || !formData.correo || !formData.tipoPersona || !formData.plantillaSolicita || !formData.usoPlantilla || !formData.modoEntrega) {
                alert('⚠️ Por favor, complete todos los campos obligatorios y seleccione el modo de entrega.');
                return;
            }

            // 💥 PASO CLAVE: REGISTRAR SOLICITUD 💥
            registrarSolicitud(formData);

            const urlKey = `${formData.tipoPersona}-${formData.plantillaSolicita}`;
            const plantillaInfo = rutasPlantillas[urlKey];

            if (mensajeExitoTitulo) mensajeExitoTitulo.textContent = '¡Solicitud Exitosa!';

            if (formData.modoEntrega === 'descarga' && plantillaInfo && plantillaInfo.url && mensajeExitoContenido && mensajeExitoSocial) {
                // Modo: DESCARGA
                mensajeExitoContenido.innerHTML = `
                    Gracias por visitar nuestra página. Aquí tienes tu plantilla de: <strong>${plantillaInfo.nombre}</strong>.
                    Esperamos que le sea útil y podamos seguir en contacto en diversos proyectos apoyando a su tranquilidad.
                `;
                
                mensajeExitoSocial.innerHTML = `
                    <a href="${plantillaInfo.url}" download class="btn primary lg">
                        ⬇️ DESCARGAR ${plantillaInfo.nombre.toUpperCase()} AHORA
                    </a>
                `;

            } else if (mensajeExitoContenido && mensajeExitoSocial) {
                // Modo: CORREO / Requiere Apoyo (siempre va por correo)
                mensajeExitoContenido.innerHTML = `
                    Gracias por visitar nuestra página. Recibirás tu plantilla de <strong>${plantillaInfo ? plantillaInfo.nombre : 'Plantilla Solicitada'}</strong> 
                    en el correo <strong>${formData.correo}</strong> en un plazo de <strong>1 a 48 horas</strong>. 
                    Esperamos que le sea útil y podamos seguir en contacto en diversos proyectos apoyando a su tranquilidad.
                `;
                
                mensajeExitoSocial.innerHTML = `
                    <a href="https://instagram.com" target="_blank">📸</a>
                    <a href="https://facebook.com" target="_blank">📘</a>
                    <a href="https://tiktok.com" target="_blank">🎵</a>
                `;
            }

            // Mostrar mensaje de éxito
            form.style.display = 'none';
            if (mensajeExito) mensajeExito.classList.remove('oculto');
            
            // Regresa al formulario después de 6 segundos
            setTimeout(() => {
                form.reset();
                updateEntregaOptions(); 
                if (mensajeExito) mensajeExito.classList.add('oculto'); 
                form.style.display = 'block';
            }, 6000); 
        });
    }
    
    // 5. Animación suave de carga (Mantenido)
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.opacity = 0;
        formContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            formContainer.style.transition = 'all 0.8s ease';
            formContainer.style.opacity = 1;
            formContainer.style.transform = 'translateY(0)';
        }, 150);
    }
});




