import prisma from "../../utils/prisma.js";

export async function createPost(req, res) {
    const { content, userId } = req.body;
    if ( !content || !userId ) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    try {
        const parsedUserId = parseInt(userId, 10);
        if ( isNaN(parsedUserId)){
            return res.status(400).json({ error: 'Identificador no valido' });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: parsedUserId
            }
        })
        
        if ( !user ) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const post = await prisma.post.create({
            data: {
                content,
                user: {
                    connect: {
                        id: parsedUserId
                    }
                }
            }
        })
        res.status(201).json({
            message: 'Post creado',
            post
        });
    } catch ( error ) {
        res.status(500).json({ 
            error: 'Error al crear el post',
            details: error.message
         });
    }
}