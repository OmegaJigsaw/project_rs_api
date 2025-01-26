import prisma from "../../utils/prisma.js";

export async function updatePost(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: 'Falta el identificador del post'
        });
    }
    try {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({
                error: 'Identificador no válido'
            });
        }

        // Verificar si el post existe
        const existingPost = await prisma.post.findUnique({
            where: { id: parsedId }
        });
        if (!existingPost) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Obtener los datos a actualizar
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                error: 'Falta el contenido del post'
            });
        }

        // Actualizar el post
        const updatedPost = await prisma.post.update({
            where: { id: parsedId },
            data: { content } // Actualizar solo el contenido del post
        });

        res.json({
            message: 'Post actualizado correctamente',
            post: updatedPost
        });

    } catch (error) {
        return res.status(500).json({
            error: 'No se pudo actualizar el post',
            details: error.message
        });
    }
}
