// Función para manejar el envío del formulario de contacto
async function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        const formData = {
            nombre: form.nombre.value,
            email: form.email.value,
            mensaje: form.mensaje.value
        };
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('¡Mensaje enviado con éxito!');
            form.reset();
        } else {
            throw new Error('Error al enviar el mensaje');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Inicializar el formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}); 