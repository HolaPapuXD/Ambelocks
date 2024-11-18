// Función para generar el HTML de la factura
function generarHTMLFactura(formData, cart) {
    let totalPedido = 0;
    const productosHTML = cart.map(item => {
        const precioUnitario = parseInt(item.price.replace(/[^0-9]/g, ''));
        const subtotal = precioUnitario * item.quantity;
        totalPedido += subtotal;
        return `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${subtotal.toLocaleString()} COP</td>
            </tr>
        `;
    }).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Factura de Compra - Ambelocks</h2>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <h3 style="margin-top: 0;">Información del Cliente</h3>
                <p><strong>Nombre:</strong> ${formData.get('nombre')}</p>
                <p><strong>Email:</strong> ${formData.get('email')}</p>
                <p><strong>Teléfono:</strong> ${formData.get('telefono')}</p>
                <p><strong>Identificación:</strong> ${formData.get('identificacion')}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3>Detalle de Productos</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Producto</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Cantidad</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Precio Unitario</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align: right; padding: 10px; border: 1px solid #ddd;"><strong>Total:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>${totalPedido.toLocaleString()} COP</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                <p>¡Gracias por tu compra!</p>
                <p>Para cualquier consulta, contáctanos en: <a href="mailto:contacto@ambelocks.com">contacto@ambelocks.com</a></p>
            </div>
        </div>
    `;
}

// Función para enviar el correo usando EmailJS
async function enviarCorreos(formData, cart) {
    try {
        const htmlFactura = generarHTMLFactura(formData, cart);

        // Preparar datos para el correo del administrador
        const adminTemplateParams = {
            to_email: 'angel.pruebas2006@gmail.com',
            from_name: formData.get('nombre'),
            message: htmlFactura,
            reply_to: formData.get('email'),
            subject: 'Nueva Orden de Compra - Ambelocks'
        };

        // Preparar datos para el correo del cliente
        const clientTemplateParams = {
            to_email: formData.get('email'),
            to_name: formData.get('nombre'),
            message: htmlFactura,
            subject: 'Tu Orden de Compra - Ambelocks'
        };

        // Enviar correos
        await emailjs.send("service_m0fdkq9", "template_vcxfu7j", adminTemplateParams, "0I-G9bBu_UeRjH0na");
        await emailjs.send("service_m0fdkq9", "template_1bo7vbv", clientTemplateParams, "0I-G9bBu_UeRjH0na");

        return true;
    } catch (error) {
        console.error("Error al enviar los correos:", error);
        throw error;
    }
}

// Exportar las funciones
window.orderEmail = {
    enviarCorreos,
    generarHTMLFactura
}; 