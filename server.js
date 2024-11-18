const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configurar rutas estáticas específicas
app.use('/Css', express.static(path.join(__dirname, 'public', 'Css')));
app.use('/Js', express.static(path.join(__dirname, 'public', 'Js')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Rutas para las páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'index.html'));
});

app.get('/catalogo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'catalogo.html'));
});

app.get('/sobre-nosotros.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'sobre-nosotros.html'));
});

app.get('/contactenos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'contactenos.html'));
});

app.get('/carrito.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'carrito.html'));
});

app.get('/formulario-envio.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Html', 'formulario-envio.html'));
});

// Ruta para el envío de correos de contacto
app.post('/api/contact', async (req, res) => {
    console.log('Recibida solicitud de contacto:', req.body);
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ 
            success: false, 
            error: 'Faltan campos requeridos' 
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Email para el administrador
        console.log('Enviando email al administrador...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Nuevo mensaje de contacto - Ambelocks',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mensaje:</strong> ${mensaje}</p>
                </div>
            `
        });
        console.log('Email enviado al administrador');

        // Email de confirmación para el usuario
        console.log('Enviando email de confirmación al usuario...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Gracias por contactar a Ambelocks',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">¡Gracias por contactarnos!</h2>
                    <p>Hola ${nombre},</p>
                    <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h4 style="margin-top: 0;">Tu mensaje:</h4>
                        <p style="color: #666;">${mensaje}</p>
                    </div>
                </div>
            `
        });
        console.log('Email de confirmación enviado al usuario');

        res.json({ success: true });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Error al enviar el email' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    // Para debugging
    console.log('Directorio actual:', __dirname);
    console.log('Ruta a public/Html:', path.join(__dirname, 'public', 'Html'));
    // Verificar si el archivo existe
    const contactenosPath = path.join(__dirname, 'public', 'Html', 'contactenos.html');
    const fs = require('fs');
    fs.access(contactenosPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('El archivo contactenos.html no existe en:', contactenosPath);
        } else {
            console.log('El archivo contactenos.html existe en:', contactenosPath);
        }
    });
}); 