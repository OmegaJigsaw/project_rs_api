import express from 'express';
import { getAllComments, getCommentById, getCommentsByPost } from '../controller/comments/get-controller.js'
import { createComment } from '../controller/comments/post-controller.js'
import { updateComment } from '../controller/comments/update-controller.js'
import { deleteComment } from '../controller/comments/delete-controller.js'

const router = express.Router()

router.get('/all/', getAllComments);

router.get('/get/id:/', getCommentById);

router.get('/get-post/id:/', getCommentsByPost);

router.post('/create/', createComment);

router.put('/update/:id/', updateComment);

router.delete('/delete/:id/', deleteComment);

export default router;