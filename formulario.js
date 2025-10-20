document.addEventListener('DOMContentLoaded', () => {

    // 1. Mostrar/Ocultar el campo de apoyo condicional
    const requiereApoyoRadios = document.getElementsByName('requiereApoyo');
    const opcionApoyoDiv = document.getElementById('opcionApoyoDiv');

    requiereApoyoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Muestra u oculta la sección de tipo de apoyo
            opcionApoyoDiv.style.display = radio.value === 'Si' ? 'block' : 'none';
        });
    });

    // 2. Manejo del Envío del Formulario
    const form = document.getElementById('solicitudForm');
    const mensajeExito = document.getElementById('mensajeExito');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores para validación
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const tipoPersona = document.getElementById('tipoPersona').value;
        const usoPlantilla = document.getElementById('usoPlantilla').value.trim();
        
        // Validación básica de campos obligatorios
        if (!nombre || !correo || !tipoPersona || !usoPlantilla) {
            alert('⚠️ Por favor, complete todos los campos obligatorios.');
            return;
        }

        // Oculta el formulario y muestra el mensaje de éxito
        form.style.display = 'none';
        mensajeExito.classList.remove('oculto'); 
        
        // Opcional: Reinicia el formulario y regresa a la vista después de 6 segundos
        setTimeout(() => {
            form.reset();
            mensajeExito.classList.add('oculto'); 
            form.style.display = 'block';
        }, 6000); 
    });
    
    // 3. Animación suave de carga
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