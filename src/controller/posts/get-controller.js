import prisma from '../../utils/prisma.js';

export async function getAllPosts(req, res) {
    // Obtenemos todos los posts
    // Esto debe ajustarse con algun filtro de cantidades por la carga de datos que pueda traer (este es un ejemplo simple sin filtros)
    try {
        const posts = await prisma.post.findMany({
            // Ordenamos los posts por fecha de creacion de forma descendente
            orderBy:{
                createdAt: 'desc'
            },
            // Incluimos los usuarios y comentarios de cada post
            include: {
                user: {
                    // Select es para elegir que campos queremos traer
                    select: { id: true, username: true }
                }, 
                comments: {
                    select: {
                        id: true,
                        content: true,
                        // Incluimos el usuario que hizo el comentario
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                }
            }
        });
        if ( posts.length === 0 ) {
            return res.status(404).json({ error: 'No hay posts registrados'})
        }
        res.json(posts);
    } catch ( error ) {
        res.status(500).json({ 
            error: 'Error al traer los posts',
            details: error.message
         });
    }
}

export async function getPostById(req, res) {
    const { id } = req.params;
    if ( !id ) {
        return res.status(400).json({ error: 'Falta el id del post' });
    }
    try {
        const parsedId = parseInt(id, 10);
        if ( isNaN(parsedId)){
            return res.status(400).json({ error: 'Identificador no valido' });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: parsedId
            },
            include: {
                user:{
                    select:{
                        id: true,
                        username: true
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        user:{
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                }
            }
        })
        if ( !post ) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }
        res.json(post);
    } catch ( error ) {
        res.status(500).json({ 
            error: 'Error al traer el post',
            details: error.message
         });
    }
}