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


    // 🚨 CONFIGURACIÓN DEL REGISTRO A GOOGLE SHEETS 🚨
    // URL DE ACCIÓN CORREGIDA PARA TU FORMULARIO: 
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSd7g5_2X94X3M6u7e954i9uH0y1zS5w21zGqj0O8q6sK1K-7A/formResponse'; 
    
    // CÓDIGOS ENTRY.XXXXX OBTENIDOS DEL FORMULARIO
    const FIELD_MAP = {
        // Códigos confirmados en el código fuente de tu Google Form:
        'nombre': 'entry.1764658097', // (Nombre Completo)
        'correo': 'entry.1065046570', // (Correo Electrónico)
        'tipoPersona': 'entry.839337160', // (Tipo de Persona)
        'plantillaSolicita': 'entry.1744670085', // (Plantilla que solicita)
        'usoPlantilla': 'entry.1030386183', // (Uso)
        'requiereApoyo': 'entry.1802951737', // (Requiere Apoyo)
        
        // CÓDIGOS ASUMIDOS (basados en el orden de las preguntas. ¡REVISAR SI FALLAN!)
        'opcionApoyo': 'entry.1764658098', // ⚠️ Posible error, si falla cambia este código
        'modoEntrega': 'entry.1065046571', // ⚠️ Posible error, si falla cambia este código
        'comentarios': 'entry.839337161', // ⚠️ Posible error, si falla cambia este código
        'timestamp': 'entry.1200000000', // Campo genérico para fecha/hora.
    };
    

    // Mapeo de URL de Descarga (Asegúrate que estas rutas y archivos existan)
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


    // 2. Lógica Condicional (Apoyo y Modo de Entrega)
    const updateEntregaOptions = () => {
        const apoyoSiSeleccionado = document.getElementById('apoyoSi')?.checked;
        opcionApoyoDiv.style.display = apoyoSiSeleccionado ? 'block' : 'none';

        const descargaOption = modoEntregaSelect.querySelector('option[value="descarga"]');
        
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
    };
    
    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', updateEntregaOptions);
    });
    
    updateEntregaOptions();


    // 3. Manejo del Envío del Formulario y Mensaje Final
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

        const plantillaTexto = document.getElementById('plantillaSolicita').options[document.getElementById('plantillaSolicita').selectedIndex].text;
        
        // Validación de campos obligatorios
        if (!formData.nombre || !formData.correo || !formData.tipoPersona || !formData.plantillaSolicita || !formData.usoPlantilla || !formData.modoEntrega) {
            alert('⚠️ Por favor, complete todos los campos obligatorios y seleccione el modo de entrega.');
            return;
        }

        // 💥 PASO CLAVE: REGISTRAR SOLICITUD 💥
        registrarSolicitud(formData);

        const urlKey = `${formData.tipoPersona}-${formData.plantillaSolicita}`;
        const plantillaInfo = rutasPlantillas[urlKey];

        mensajeExitoTitulo.textContent = '¡Solicitud Exitosa!';

        if (formData.modoEntrega === 'descarga' && plantillaInfo && plantillaInfo.url) {
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

        } else {
            // Modo: CORREO / Requiere Apoyo (siempre va por correo)
            mensajeExitoContenido.innerHTML = `
                Gracias por visitar nuestra página. Recibirás tu plantilla de <strong>${plantillaInfo.nombre}</strong> 
                en el correo <strong>${formData.correo}</strong> en un plazo de <strong>1 a 48 horas</strong>. 
                Esperamos que le sea útil y podamos seguir en contacto en diversos proyectos apoyando a su tranquilidad.
            `;
            
             mensajeExitoSocial.innerHTML = `
                <a href="https://instagram.com" target="_blank">📸</a>
                <a href="https://facebook.com" target="_blank">📘</a>
                <a href="https://tiktok.com" target="_blank">🎵</a>
            `;
        }

        form.style.display = 'none';
        mensajeExito.classList.remove('oculto'); 
        
        // Regresa al formulario después de 6 segundos
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
