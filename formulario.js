document.addEventListener('DOMContentLoaded', () => {

    // 1. Declaración de Elementos
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');
    const modoEntregaSelect = document.getElementById('modoEntrega');
    const entregaNota = document.getElementById('entregaNota');
    
    const form = document.getElementById('solicitudForm');
    const mensajeExito = document.getElementById('mensajeExito');

    // 2. Lógica Condicional (Apoyo y Modo de Entrega)
    const updateEntregaOptions = () => {
        // Obtiene el estado del radio "Sí"
        const apoyoSiSeleccionado = document.getElementById('apoyoSi').checked;
        
        // Muestra/Oculta el selector de tipo de apoyo (Tutorial/Meet)
        opcionApoyoDiv.style.display = apoyoSiSeleccionado ? 'block' : 'none';

        // Elemento para la opción de descarga
        const descargaOption = modoEntregaSelect.querySelector('option[value="descarga"]');
        
        // 🚨 Lógica de restricción del Modo de Entrega
        if (apoyoSiSeleccionado) {
            // Si requiere apoyo, SOLO permite "Enviar por correo"
            
            // Oculta la opción de descarga
            descargaOption.style.display = 'none';
            
            // Selecciona "Enviar por correo" y deshabilita el selector
            modoEntregaSelect.value = 'correo';
            modoEntregaSelect.disabled = true;
            
            entregaNota.textContent = '🔒 Si requiere apoyo, la plantilla se enviará automáticamente por correo.';

        } else {
            // Si NO requiere apoyo, habilita ambas opciones
            descargaOption.style.display = 'block';
            modoEntregaSelect.disabled = false;
            
            // Si estaba forzado a 'correo', lo deseleccionamos para forzar al usuario a elegir
            if(modoEntregaSelect.value === 'correo' && modoEntregaSelect.disabled === false) {
                 modoEntregaSelect.value = ''; 
            }
            
            entregaNota.textContent = 'Elige si quieres descargarla inmediatamente o recibirla por email.';
        }
    };
    
    // Asigna el listener a los radios para actualizar las opciones de entrega
    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', updateEntregaOptions);
    });
    
    // Inicializa las opciones al cargar la página
    updateEntregaOptions();


    // 3. Manejo del Envío del Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores para validación
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const tipoPersona = document.getElementById('tipoPersona').value;
        const plantillaSolicita = document.getElementById('plantillaSolicita').value;
        const usoPlantilla = document.getElementById('usoPlantilla').value.trim();
        const modoEntrega = modoEntregaSelect.value; 

        // Validación de campos obligatorios
        if (!nombre || !correo || !tipoPersona || !plantillaSolicita || !usoPlantilla || !modoEntrega) {
            alert('⚠️ Por favor, complete todos los campos obligatorios y seleccione el modo de entrega.');
            return;
        }

        // Si el usuario seleccionó "Descargar ahora mismo"
        if (modoEntrega === 'descarga' && !modoEntregaSelect.disabled) {
            
            // 🚨 SIMULACIÓN DE DESCARGA: Aquí iría la lógica para redirigir/iniciar descarga
            alert('🔗 La descarga de la plantilla solicitada está iniciando...');
            
            // Si haces una descarga directa, no necesitas mostrar el mensaje de éxito tan largo,
            // pero para mantener la consistencia del flujo, lo dejamos.
        }
        
        // Oculta el formulario y muestra el mensaje de éxito
        form.style.display = 'none';
        mensajeExito.classList.remove('oculto'); 
        
        // Opcional: Después de 6 segundos, regresa a la vista del formulario
        setTimeout(() => {
            form.reset();
            updateEntregaOptions(); // Asegura que las opciones de entrega se restablezcan
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
