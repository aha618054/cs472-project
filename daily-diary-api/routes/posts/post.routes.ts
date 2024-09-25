import express from "express";
import {
    addPostHandler,
    getAllPostsHandler,
    getPostByIdHandler,
    updatePostHandler,
    deletePostHandler,
    votedPostByIdHandler, // Import the vote handler
} from "../../controllers/posts/posts.controller";

const router = express.Router();

router.use(express.json()); // Ensure this if body parsing is needed in routes

router.post("/", addPostHandler);
router.get("/", getAllPostsHandler);
router.get("/:id", getPostByIdHandler);
router.put("/:id", updatePostHandler);
router.patch("/:id/vote", votedPostByIdHandler); // Added this route for voting
router.delete("/:id", deletePostHandler);

export default router;
