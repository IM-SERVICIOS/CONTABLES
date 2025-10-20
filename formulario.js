document.addEventListener('DOMContentLoaded', () => {

    // 1. Declaración de Elementos
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');
    const modoEntregaSelect = document.getElementById('modoEntrega');
    const entregaNota = document.getElementById('entregaNota');
    
    const form = document.getElementById('solicitudForm');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeExitoTitulo = mensajeExito.querySelector('h3');
    const mensajeExitoContenido = mensajeExito.querySelector('p'); 
    const mensajeExitoSocial = mensajeExito.querySelector('.social-icons'); 


    // 🚨 Mapeo de URL de Descarga (¡Asegúrate que las URL sean correctas!) 🚨
    const rutasPlantillas = {
        'Moral-estado-resultados': { nombre: 'Estado de Resultados', url: 'plantillas/moral_estado_resultados.xlsx' },
        'Moral-flujo-efectivo': { nombre: 'Flujo de Efectivo', url: 'plantillas/moral_flujo_efectivo.xlsx' },
        'Moral-nomina': { nombre: 'Plantilla de Nómina', url: 'plantillas/moral_nomina.xlsx' },
        'Moral-contabilidad-general': { nombre: 'Contabilidad General', url: 'plantillas/moral_contabilidad_general.xlsx' },

        'Fisica-estado-resultados': { nombre: 'Estado de Resultados', url: 'plantillas/fisica_estado_resultados.xlsx' },
        'Fisica-flujo-efectivo': { nombre: 'Flujo de Efectivo', url: 'plantillas/fisica_flujo_efectivo.xlsx' },
        'Fisica-nomina': { nombre: 'Plantilla de Nómina', url: 'plantillas/fisica_nomina.xlsx' },
        'Fisica-contabilidad-general': { nombre: 'Contabilidad General', url: 'plantillas/fisica_contabilidad_general.xlsx' },
        
        // Plantillas genéricas para "No sabe"
        'No sabe-estado-resultados': { nombre: 'Estado de Resultados Genérico', url: 'plantillas/generica_estado_resultados.xlsx' },
        'No sabe-flujo-efectivo': { nombre: 'Flujo de Efectivo Genérico', url: 'plantillas/generica_flujo_efectivo.xlsx' },
        'No sabe-nomina': { nombre: 'Plantilla de Nómina Genérica', url: 'plantillas/generica_nomina.xlsx' },
        'No sabe-contabilidad-general': { nombre: 'Contabilidad General Genérica', url: 'plantillas/generica_contabilidad_general.xlsx' },
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


    // 3. Manejo del Envío del Formulario y Mensaje Final
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const tipoPersona = document.getElementById('tipoPersona').value;
        const plantillaSolicita = document.getElementById('plantillaSolicita').value;
        const modoEntrega = modoEntregaSelect.value; 
        
        // Obtener el nombre legible de la plantilla seleccionada
        const plantillaTexto = document.getElementById('plantillaSolicita').options[document.getElementById('plantillaSolicita').selectedIndex].text;

        // Validación de campos obligatorios
        if (!nombre || !correo || !tipoPersona || !plantillaSolicita || !modoEntrega) {
            alert('⚠️ Por favor, complete todos los campos obligatorios y seleccione el modo de entrega.');
            return;
        }

        // Determinar la información de la plantilla
        const urlKey = `${tipoPersona}-${plantillaSolicita}`;
        const plantillaInfo = rutasPlantillas[urlKey];
        
        // 💥 LÓGICA DE MENSAJE DINÁMICO Y DESPEDIDA 💥

        if (modoEntrega === 'descarga' && plantillaInfo && plantillaInfo.url) {
            // Modo: DESCARGA
            
            // Mensaje profesional
            mensajeExitoContenido.innerHTML = `
                Gracias por visitar nuestra página. Aquí tienes tu plantilla de: <strong>${plantillaInfo.nombre}</strong>.
                Esperamos que le sea útil y podamos seguir en contacto en diversos proyectos apoyando a su tranquilidad.
            `;
            
            // Inyecta el botón de descarga con el estilo CSS
            mensajeExitoSocial.innerHTML = `
                <a href="${plantillaInfo.url}" download class="btn primary lg">
                    ⬇️ DESCARGAR ${plantillaInfo.nombre.toUpperCase()} AHORA
                </a>
            `;

        } else {
            // Modo: CORREO (Incluye caso en que se forzó a correo)
            
            // Mensaje profesional para correo
            mensajeExitoContenido.innerHTML = `
                Gracias por visitar nuestra página. Recibirás tu plantilla de <strong>${plantillaInfo.nombre}</strong> 
                en el correo <strong>${correo}</strong> en un plazo de <strong>1 a 48 horas</strong>. 
                Esperamos que le sea útil y podamos seguir en contacto en diversos proyectos apoyando a su tranquilidad.
            `;
            
            // Restaura los iconos sociales
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
