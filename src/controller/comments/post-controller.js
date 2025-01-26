import prisma from '../../utils/prisma.js';

export async function createComment(req, res) {
    const { content, userId, postId } = req.body;
    if ( !content || !userId || !postId ) {
        return res.status(400).json({error: 'Faltan datos para continuar'});
    }
    try {
        const parsedUserId = parseInt(userId, 10);
        const parsedPostId = parseInt(postId, 10);

        if ( isNaN(parsedPostId) || isNaN(parsedUserId) ){
            return res.status(400).json({
                error: 'Identificador de usuario o post no valido'
            })
        }

        // Se puede hacer esto para consultar multiples existencias al mismo tiempo
        const [currentUser, post] = await Promise.all([
            prisma.user.findUnique({ where: { id: parsedUserId } }),
            prisma.post.findUnique({ where: { id: parsedPostId } })
        ])
        
        if( !currentUser ){
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        if( !post ){
            return res.status(404).json({
                error: 'Post no encontrado'
            });
        }

        const newComment = await prisma.comment.create({
            data:{
                content,
                post:{
                    connect:{
                        id: parsedPostId
                    }
                },
                user:{
                    connect:{
                        id: parsedUserId
                    }
                }
            }
        });
        res.status(201).json( newComment );
    } catch ( error ){
        return res.status(500).json({
            error: 'Error al crear el comentario',
            details: error.message
        })
    }
}