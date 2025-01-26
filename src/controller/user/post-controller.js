import prisma from "../../utils/prisma.js";
import bcrypt from 'bcryptjs';

export async function createUser(req, res) {
    const { username, email, password } = req.body;
    if ( !username || !email || !password ) {
        return res.status(400).json({ error: 'Faltan datos para crear el usuario' });
    }
    try {

        // Validación de email y username únicos
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username },
                ],
            },
        });
    
        if ( existingUser ) {
            return res.status(400).json({
            error: existingUser.email === email
                ? 'Ya existe un usuario con este email'
                : 'Ya existe un usuario con este username',
            });
        }
        
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        })
        res.json({ message: 'Usuario creado correctamente', user: newUser });
    } catch ( error) {
        return res.status(500).json({ 
            error: 'No se pudo crear al usuario',
            details: error.message
        });
    }
}
