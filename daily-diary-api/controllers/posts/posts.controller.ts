import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostService } from "../../services/post/post.service";
import { generateDataFilenameByDate } from "../../utils/utils";
import { Validation } from "../../utils/validation/validation";
import { validateInputParams } from "../../utils/validation/handle-validation";
import { ValidatorType } from "../../models/enums/validator-type.enum";
import { Post } from "../../models/post/post.model";
import { StatusCodes } from "../../models/enums/status.enum";
import { User } from "../../models/post/user.model";
import { errorLogStream } from "../../middlewares/middleware";

/**
 * Add new post by Date
 *
 * @param req
 * @param res
 * @param next
 */
export const addPostHandler: RequestHandler<
    unknown,
    unknown,
    {
        title: string;
        body: string;
        date: string;
        user: User
    },
    unknown
> = (req, res, next) => {
    try {
        // handle validate the input parameters
        const validations: Validation[] = [
            {
                field: "title",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.body.title,
                    },
                    {
                        type: ValidatorType.MAXLENGTH,
                        value: req.body.title,
                        extras: [200],
                    },
                ],
            },
            {
                field: "body",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.body.body,
                    },
                    {
                        type: ValidatorType.MAXLENGTH,
                        value: req.body.body,
                        extras: [1000],
                    },
                ],
            },
            {
                field: "date",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.body.date,
                    },
                    {
                        type: ValidatorType.DATE,
                        value: req.body.date,
                    },
                ],
            },
        ];
        validateInputParams(validations);

        // add post and response data
        const postService = new PostService(
            generateDataFilenameByDate(req.body.date)
        );

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
/*
delete Post By Id and file name by date 
*/

export const deletePostByIdHandler: RequestHandler<
    { id: string ,date : string},
    unknown,
    unknown,
    {date :string}
> = (req, res, next) => {
    try {
       
       
        const postService = new PostService(
            generateDataFilenameByDate(req.params.date)
        );
        errorLogStream.write("DateTime" +req.query.date)
        postService.deletePostById(req.params.id,req.params.date);        
        res.status(StatusCodes.SUCCESS).json(
            postService.getAllPosts()
        );
    } catch (error) {
        next(error);
    }
};


/**
 * Get all posts by Date
 *
 * @param req
 * @param res
 * @param next
 */
export const getAllPostsHandler: RequestHandler<
    unknown,
    unknown,
    unknown,
    { date: string }
> = (req, res, next) => {
    try {
        // handle validate the input parameters
        const validations: Validation[] = [
            {
                field: "date",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.query.date,
                    },
                    {
                        type: ValidatorType.DATE,
                        value: req.query.date,
                    },
                ],
            },
        ];
        validateInputParams(validations);

        // get all posts and response data
        const postService = new PostService(
            generateDataFilenameByDate(req.query.date)
        );

        let posts: Post[] = postService.getAllPosts();
        posts.sort((e1, e2) => {
            if (e2.vote > e1.vote) {
                return 1;
            }
            return -1;
        });

        res.status(StatusCodes.SUCCESS).json(posts);
    } catch (error) {
        next(error);
    }
};

/**
 * Get post by Date and Id
 *
 * @param req
 * @param res
 * @param next
 */
export const getPostByIdHandler: RequestHandler<
    { id: string },
    unknown,
    unknown,
    { date: string }
> = (req, res, next) => {
    try {
        // handle validate the input parameters
        const validations: Validation[] = [
            {
                field: "date",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.query.date,
                    },
                    {
                        type: ValidatorType.DATE,
                        value: req.query.date,
                    },
                ],
            },
        ];
        validateInputParams(validations);

        // get post by ID and response data
        const postService = new PostService(
            generateDataFilenameByDate(req.query.date)
        );

        res.status(StatusCodes.SUCCESS).json(
            postService.getPostById(req.params.id)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Voted post by Date and Id
 *
 * @param req
 * @param res
 * @param next
 */
export const votePostHandler: RequestHandler<
    { id: string },
    unknown,
    { votes: string; date: string },
    unknown
> = (req, res, next) => {
    try {
        // handle validate the input parameters
        const validations: Validation[] = [
            {
                field: "votes",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.body.votes,
                    },
                    {
                        type: ValidatorType.NUMERIC,
                        value: req.body.votes,
                    },
                ],
            },
            {
                field: "date",
                validators: [
                    {
                        type: ValidatorType.REQUIRED,
                        value: req.body.date,
                    },
                    {
                        type: ValidatorType.DATE,
                        value: req.body.date,
                    },
                ],
            },
        ];
        validateInputParams(validations);

        // voted post and response data
        const postService = new PostService(
            generateDataFilenameByDate(req.body.date)
        );

        const post: Post = postService.votedPostById(
            req.params.id,
            parseInt(req.body.votes)
        ) as Post;

        res.status(StatusCodes.SUCCESS).json(post);
    } catch (error) {
        next(error);
    }
};
