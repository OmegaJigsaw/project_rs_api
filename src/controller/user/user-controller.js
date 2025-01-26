// import { PrismaClient } from '@prisma/client';
import prisma from '../../utils/prisma.js';
import bcrypt from 'bcryptjs';

// Definir el cliente de Prisma si no esta importado en el archivo utils/prisma.js
// const prisma = new PrismaClient();

//Funciones del controlador que se llaman desde las rutas 
export async function getAllUsers(req, res) {
    try{
        const users = await prisma.user.findMany();
        if ( !users ) {
            return res.status(404).json({ error: 'No hay usuarios registrados'})
        }
        res.json(users);
    } catch ( error ) {
        res.status(500).json({ 
            error: 'No se pudo obtener los usuarios',
            details: error.message
        });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;
    if ( !id ) {
        return res.status(400).json({ error: 'Falta el id del usuario' });
    }
    try {
        const user = await prisma.user.findUnique ({
            where: {
                id: parseInt(id)
            }
        });
        if ( !user ) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        return res.status(500).json({ 
            error: 'No se pudo obtener el usuario',
            details: error.message 
        });
    }
}

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
        const { newUsername, newEmail } = req.body;
        // Objeto con los datos a actualizar
        const updateData = {};

        // Validaciones de datos
        if ( !newUsername && !newEmail ) {
            return res.status(400).json({ error: 'Faltan datos para actualizar el usuario' });
        }

        if ( newUsername === user.username && newEmail === user.email ) {
            return res.status(400).json({ error: 'No hay cambios para actualizar' });
        }

        // Asignacion de datos a actualizar
        if ( newUsername ) {
            updateData.username = newUsername;
        }

        if ( newEmail ) {
            updateData.email = newEmail;
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

export async function deleteUser(req, res) {
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

        await prisma.user.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error){
        return res.status(500).json({ 
            error: 'No se pudo eliminar el usuario', 
            details: error.message 
        });
    }
}