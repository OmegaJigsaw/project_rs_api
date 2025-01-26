import express from "express";
import { getAllUsers, getUserById } from "../controller/user/get-controller.js";
import { createUser } from "../controller/user/post-controller.js";
import { updateUser, updateUserPassword } from "../controller/user/update-controller.js";
import { deleteUser } from "../controller/user/delete-controller.js";
// import { createUser, deleteUser, getAllUsers, getUserById, updateUser, updateUserPassword } from "../controller/user/user-controller.js";

const router = express.Router();

// Rutas de los usuarios que se pueden acceder desde el navegador
// Con las funciones definidas en el controlador
router.get("/all/", getAllUsers);

router.get("/get/:id/", getUserById);

router.post("/create/", createUser);

router.put("/update/:id/", updateUser);

router.put("/update-password/:id", updateUserPassword);

router.delete("/delete/:id", deleteUser);

export default router;