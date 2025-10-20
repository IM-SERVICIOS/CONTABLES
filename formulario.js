document.addEventListener('DOMContentLoaded', () => {

    // 1. Declaración de Elementos
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');
    const modoEntregaSelect = document.getElementById('modoEntrega');
    const entregaNota = document.getElementById('entregaNota');
    
    const form = document.getElementById('solicitudForm');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeExitoContenido = mensajeExito.querySelector('p'); // Para inyectar el mensaje dinámico
    const mensajeExitoSocial = mensajeExito.querySelector('.social-icons'); // Para inyectar el botón de descarga o iconos sociales


    // Mapeo de URL de Descarga (🚨 AJUSTA ESTAS RUTAS SEGÚN TU ESTRUCTURA DE ARCHIVOS 🚨)
    // El formato debe ser: [Valor del select tipoPersona][Valor del select plantillaSolicita]
    const rutasPlantillas = {
        'Moral-estado-resultados': 'plantillas/moral_estado_resultados.xlsx',
        'Moral-flujo-efectivo': 'plantillas/moral_flujo_efectivo.xlsx',
        'Moral-nomina': 'plantillas/moral_nomina.xlsx',
        'Moral-contabilidad-general': 'plantillas/moral_contabilidad_general.xlsx',

        'Fisica-estado-resultados': 'plantillas/fisica_estado_resultados.xlsx',
        'Fisica-flujo-efectivo': 'plantillas/fisica_flujo_efectivo.xlsx',
        'Fisica-nomina': 'plantillas/fisica_nomina.xlsx',
        'Fisica-contabilidad-general': 'plantillas/fisica_contabilidad_general.xlsx',
        
        // Asumiendo que "No sabe" usa las mismas plantillas que Física o unas genéricas:
        'No sabe-estado-resultados': 'plantillas/generica_estado_resultados.xlsx',
        'No sabe-flujo-efectivo': 'plantillas/generica_flujo_efectivo.xlsx',
        'No sabe-nomina': 'plantillas/generica_nomina.xlsx',
        'No sabe-contabilidad-general': 'plantillas/generica_contabilidad_general.xlsx',
    };


    // 2. Lógica Condicional (Apoyo y Modo de Entrega)
    const updateEntregaOptions = () => {
        const apoyoSiSeleccionado = document.getElementById('apoyoSi').checked;
        opcionApoyoDiv.style.display = apoyoSiSeleccionado ? 'block' : 'none';

        const descargaOption = modoEntregaSelect.querySelector('option[value="descarga"]');
        
        if (apoyoSiSeleccionado) {
            // Si requiere apoyo, forzar a Correo
            descargaOption.style.display = 'none';
            modoEntregaSelect.value = 'correo';
            modoEntregaSelect.disabled = true;
            entregaNota.textContent = '🔒 Si requiere apoyo (tutorial o meet), la plantilla se enviará automáticamente por correo.';
        } else {
            // Si NO requiere apoyo, habilitar ambas opciones
            descargaOption.style.display = 'block';
            modoEntregaSelect.disabled = false;
            
            if(modoEntregaSelect.value === 'correo' && modoEntregaSelect.disabled === false) {
                 modoEntregaSelect.value = ''; 
            }
            
            entregaNota.textContent = 'Elige si quieres descargarla inmediatamente o recibirla por email.';
        }
    };
    
    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', updateEntregaOptions);
    });
    
    updateEntregaOptions();


    // 3. Manejo del Envío del Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const tipoPersona = document.getElementById('tipoPersona').value;
        const plantillaSolicita = document.getElementById('plantillaSolicita').value;
        const modoEntrega = modoEntregaSelect.value; 

        // Validación de campos obligatorios
        if (!nombre || !correo || !tipoPersona || !plantillaSolicita || !modoEntrega) {
            alert('⚠️ Por favor, complete todos los campos obligatorios y seleccione el modo de entrega.');
            return;
        }

        // Determinar la clave para la URL
        const urlKey = `${tipoPersona}-${plantillaSolicita}`;
        const urlDescarga = rutasPlantillas[urlKey];
        
        // 💥 LÓGICA DE MENSAJE DINÁMICO Y DESPEDIDA 💥
        if (modoEntrega === 'descarga' && urlDescarga) {
            // Modo: DESCARGA
            mensajeExitoContenido.innerHTML = `
                ¡Tu solicitud fue exitosa! A continuación, puedes **descargar tu plantilla** y usarla de inmediato. 
                Si tienes dudas, no olvides seguirnos en redes:
            `;
            
            // Reemplaza los iconos sociales con el botón de descarga
            mensajeExitoSocial.innerHTML = `
                <a href="${urlDescarga}" download class="btn primary lg" style="margin-bottom: 15px; display: inline-block;">
                    ⬇️ Descargar Plantilla Ahora
                </a>
                <p style="font-size: 0.9em; color: var(--muted);">Este enlace expira en 5 minutos.</p>
            `;

        } else {
            // Modo: CORREO (Incluye caso en que se forzó a correo por requerir apoyo)
            mensajeExitoContenido.innerHTML = `
                ¡Tu solicitud fue exitosa! Recibirás la plantilla en tu correo <strong>${correo}</strong> 
                en un plazo de <strong>1 a 48 horas</strong>.
            `;
            
            // Restaura los iconos sociales (asumiendo que estaban en el HTML original)
             mensajeExitoSocial.innerHTML = `
                <a href="https://instagram.com" target="_blank">📸</a>
                <a href="https://facebook.com" target="_blank">📘</a>
                <a href="https://tiktok.com" target="_blank">🎵</a>
            `;
        }


        // Mostrar mensaje de éxito
        form.style.display = 'none';
        mensajeExito.classList.remove('oculto'); 
        
        // Opcional: Después de 6 segundos, regresa a la vista del formulario
        setTimeout(() => {
            form.reset();
            updateEntregaOptions(); 
            mensajeExito.classList.add('oculto'); 
            form.style.display = 'block';
        }, 6000); 
    });
    
    // 4. Animación suave de carga
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
