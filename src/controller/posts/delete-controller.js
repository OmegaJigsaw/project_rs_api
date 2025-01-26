import prisma from "../../utils/prisma.js";

export async function deletePost(req, res){
    const { id } = req.params;
    if ( !id ) {
        return res.status(400).json({
            error: 'Identificador no encontrado'
        })
    }
    try {
        const parsedId = parseInt(id, 10);
        if ( isNaN(parsedId) ) {
            return res.status(400).json({
                error: 'Identificador no Valido'
            })
        }

        // Verificar existencia
        const existingPost = await prisma.post.findUnique({
            where: { id: parsedId }
        });
        if (!existingPost) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        const post = await prisma.post.delete({
            where: {
                id: parsedId
            }
        })

        res.json({
            message: 'Post eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'No se pudo eliminar el post',
            details: error.message
        })
    }
}