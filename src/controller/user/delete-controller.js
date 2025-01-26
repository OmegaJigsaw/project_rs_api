import prisma from "../../utils/prisma.js";

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

