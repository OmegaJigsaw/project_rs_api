import express from 'express';
import { getAllPosts, getPostById } from '../controller/posts/get-controller.js';
import { createPost } from '../controller/posts/post-controller.js'
import { updatePost } from '../controller/posts/update-controller.js'
import { deletePost } from '../controller/posts/delete-controller.js'

const router = express.Router()

router.get('/all/', getAllPosts);

router.get('/get/id:/', getPostById);

router.post('/create/', createPost);

router.put('/update/:id/', updatePost);

router.delete('/delete/:id/', deletePost);

export default router;