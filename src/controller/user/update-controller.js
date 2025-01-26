import prisma from "../../utils/prisma.js";
import bcrypt from "bcryptjs";

export async function updateUser(req, res) {
    const { id } = req.params;
    if ( !id ) {
        return res.status(400).json({ error: 'Falta el id del usuario' });
    }

    try {
        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        // Validar si el usuario existe
        if ( !user ) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Obtener los datos a actualizar
        // Los nombres de las variables deben coincidir con los campos de la tabla
        const { username, email } = req.body;
        // Objeto con los datos a actualizar
        const updateData = {};

        // Validaciones de datos
        if ( !username && !email ) {
            return res.status(400).json({ error: 'Faltan datos para actualizar el usuario' });
        }

        if ( username === user.username && email === user.email ) {
            return res.status(400).json({ error: 'No hay cambios para actualizar' });
        }

        // Asignacion de datos a actualizar
        if ( username ) {
            updateData.username = username;
        }

        if ( email ) {
            updateData.email = email;
        }

        // Actualizar usuario
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: updateData
        });
        res.json({ 
            message: 'Usuario actualizado correctamente', 
            user: updatedUser 
        });
    } catch (error) {
        return res.status(500).json({ 
            error: 'No se pudo actualizar el usuario', 
            details: error.message 
        });
    }
}

export async function updateUserPassword(req, res) {
    const { id } = req.params;
    if ( !id ) {
        return res.status(400).json({ error: 'Falta el id del usuario' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if ( !user ) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { password } = req.body;
        if ( !password ) {
            return res.status(400).json({ error: 'Falta la nueva contraseña' });
        }
        
        // Coincidencia de contraseñas
        const passwordMatch = await bcrypt.compare(password, user.password); 
        if ( passwordMatch ) {
            return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la actual' });
        }

        // Actualizar Contraseña
        const hashedNewPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where:{
                id: parseInt(id)
            },
            data: {
                password: hashedNewPassword
            }
        })
        
        res.json({ 
            message: 'Contraseña actualizada correctamente', 
            user: updatedUser
        });
    } catch ( error ){
        return res.status(500).json({ 
            error: 'No se pudo actualizar la contraseña del usuario', 
            details: error.message 
        });
    }
}