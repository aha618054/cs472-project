import express, { json } from "express";
import {
    addPostHandler,
    deletePostByIdHandler,
    getAllPostsHandler,
    getPostByIdHandler,
    votePostHandler,
} from "../../controllers/posts/posts.controller";

const router = express.Router();

router.post("/", json(), addPostHandler);
router.get("/", getAllPostsHandler);
router.get("/:id", getPostByIdHandler);
router.patch("/:id", json(), votePostHandler);
router.delete("/delete/:id/:date",json(),deletePostByIdHandler)

export default router;
