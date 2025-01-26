import prisma from '../../utils/prisma.js'

export async function getAllComments(req, res) {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                content: true,
                user: {
                    select:{
                        id: true,
                        username: true
                    }
                }
            }
        });
        if ( comments.length === 0 ) {
            return res.status(404).json({
                error: 'No hay comentarios'
            });
        }
        res.json( comments )
    } catch (error) {
        return res.status(500).json({
            error: 'Fallo al traer los comentarios',
            details: error.message
        });
    }
}

export async function getCommentsByPost(req, res) {
    const { postId } = req.params;  // Obtener postId desde los parámetros de la URL

    if ( !postId ) {
        return res.status(400).json({ error: 'Falta el id del post' });
    }

    try {
        const parsedPostId = parseInt(postId, 10);

        if ( isNaN(parsedPostId) ) {
            return res.status(400).json({ error: 'El id del post no es válido' });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: parsedPostId  // Filtrar comentarios por postId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                content: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (comments.length === 0) {
            return res.status(404).json({
                error: 'No hay comentarios para este post'
            });
        }

        res.json(comments);
    } catch (error) {
        return res.status(500).json({
            error: 'Error al obtener los comentarios',
            details: error.message
        });
    }
}

export async function getCommentById(req, res){
    const { id } = req.params;
    if ( !id ) {
        return res.status(400).json({
            error: 'Identificador no encontrado'
        });
    }
    try {
        const parsedId = parseInt(id);
        if ( isNaN(parsedId) ){
            return res.status(400).json({
                error: 'Identificador no valido'
            });
        }

        const comment = await prisma.comment.findUnique({
            where: {
                id: parsedId
            },
            select: {
                id: true,
                content: true,
                user: {
                    select:{
                        id: true,
                        username: true
                    }
                }
            }
        });
        
        if ( !comment ){
            return res.status(404).json({
                error: 'Comentario no encontrado'
            });
        }

        res.json( comment );
    } catch ( error ){
        return res.status(500).json({
            error: 'No se pudo traer el comentario',
            details: error.message
        });
    }
}