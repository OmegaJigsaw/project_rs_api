import prisma from '../../utils/prisma.js';

export async function updateComment(req, res) {
    const { id } = req.params;  // ID del comentario
    const { content, userId } = req.body; // Contenido del comentario y userId enviado en el cuerpo de la solicitud
    // const userId = req.userId;  // Obtener el userId del token o sesión (a través de middleware de autenticación)

    if (!id || !content || !userId) {
        return res.status(400).json({
            error: 'Faltan datos en la solicitud',
        });
    }

    try {
        const parsedId = parseInt(id, 10); // Convertir el ID del comentario a número
        const parsedUserId = parseInt(userId, 10); // Convertir el userId a número

        if (isNaN(parsedId) || isNaN(parsedUserId)) {
            return res.status(400).json({
                error: 'Identificadores no válidos',
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
        if (comment.userId !== parsedUserId) {
            return res.status(403).json({
                error: 'No tienes permiso para actualizar este comentario',
            });
        }

        // Actualizamos el comentario si la validación es correcta
        const updatedComment = await prisma.comment.update({
            where: { id: parsedId },
            data: { content },
        });

        res.json({
            message: 'Comentario actualizado con éxito',
            comment: updatedComment,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al actualizar el comentario',
            details: error.message,
        });
    }
}
