import prisma from '../../utils/prisma.js';

export async function deleteComment(req, res) {
    const { id } = req.params; // Obtener el ID del comentario desde los parámetros de la URL
    const { userId } = req.body;
    // const userId = req.userId;  // Obtener el userId del token o sesión (a través de middleware de autenticación)

    if (!id) {
        return res.status(400).json({
            error: 'Identificador no proporcionado',
        });
    }

    try {
        const parsedId = parseInt(id, 10); // Convertir el ID a un número entero
        if (isNaN(parsedId)) {
            return res.status(400).json({
                error: 'Identificador no válido',
            });
        }

        // Buscar el comentario para verificar si el usuario que hace la solicitud es el propietario
        const comment = await prisma.comment.findUnique({
            where: { id: parsedId },
            select: { userId: true }, // Seleccionamos solo el userId para verificar la propiedad
        });

        if (!comment) {
            return res.status(404).json({
                error: 'Comentario no encontrado',
            });
        }

        // Verificamos si el usuario es el propietario del comentario
        if (comment.userId !== userId) {
            return res.status(403).json({
                error: 'No tienes permiso para eliminar este comentario',
            });
        }

        // Si pasa las validaciones, eliminamos el comentario
        await prisma.comment.delete({
            where: { id: parsedId },
        });

        res.json({
            message: 'Comentario eliminado con éxito',
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al eliminar el comentario',
            details: error.message,
        });
    }
}
