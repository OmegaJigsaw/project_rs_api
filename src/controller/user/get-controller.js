import prisma from "../../utils/prisma.js";

export async function getAllUsers(req, res) {
    try{
        const users = await prisma.user.findMany();
        if ( users.length === 0 ) {
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
