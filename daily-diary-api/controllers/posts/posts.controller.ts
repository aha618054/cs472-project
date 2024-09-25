// posts.controller.ts
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostService } from "../../services/post/post.service";
import { generateDataFilenameByDate } from "../../utils/utils";
import { validateInputParams } from "../../utils/validation/handle-validation";
import { ValidatorType } from "../../models/enums/validator-type.enum";
import { Post } from "../../models/post/post.model";
import { StatusCodes } from "../../models/enums/status.enum";


export const addPostHandler: RequestHandler = (req, res, next) => {
    try {
        const formattedDate = new Date(req.body.date).toISOString().split('T')[0];
        const postService = new PostService(generateDataFilenameByDate(formattedDate));

        const post: Post = {
            id: uuidv4(),
            title: req.body.title,
            body: req.body.body,
            vote: 0,
            user: req.body.user
        };

        postService.addPost(post);
        res.status(StatusCodes.CREATED).json(post);
    } catch (error) {
        next(error);
    }
};

export const getAllPostsHandler: RequestHandler = (req, res, next) => {
    try {
        const date = req.query.date as string;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const postService = new PostService(generateDataFilenameByDate(formattedDate));
        let posts = postService.getAllPosts();

        posts.sort((a, b) => b.vote - a.vote);
        res.status(StatusCodes.SUCCESS).json(posts);
    } catch (error) {
        next(error);
    }
};

export const getPostByIdHandler: RequestHandler = (req, res, next) => {
    try {
        const date = req.query.date as string;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const postService = new PostService(generateDataFilenameByDate(formattedDate));
        const post = postService.getPostById(req.params.id);

        res.status(StatusCodes.SUCCESS).json(post);
    } catch (error) {
        next(error);
    }
};

export const updatePostHandler: RequestHandler = (req, res, next) => {
    try {
        const date = req.body.date;
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const postService = new PostService(generateDataFilenameByDate(formattedDate));
        const updatedPost = postService.updatePostById(req.params.id, {
            title: req.body.title,
            body: req.body.body,
        });

        res.status(StatusCodes.SUCCESS).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const deletePostHandler: RequestHandler = (req, res, next) => {
    try {
        const date = req.query.date as string;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const postService = new PostService(generateDataFilenameByDate(formattedDate));

        postService.deletePostById(req.params.id, formattedDate);
        res.status(StatusCodes.SUCCESS).json({ message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const votedPostByIdHandler: RequestHandler = (req, res, next) => {
    try {
        const date = req.body.date;
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const postService = new PostService(generateDataFilenameByDate(formattedDate));
        const updatedPost = postService.votedPostById(req.params.id, req.body.votes);

        res.status(StatusCodes.SUCCESS).json(updatedPost);
    } catch (error) {
        next(error);
    }
};
