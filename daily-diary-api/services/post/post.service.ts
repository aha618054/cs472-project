import { readFileSync, writeFileSync } from "fs";
import { join } from "node:path";
import { CustomError } from "../../utils/custom-error";
import { Post } from "../../models/post/post.model";
import { StatusCodes } from "../../models/enums/status.enum";
import { errorLogStream } from "../../middlewares/middleware";
import { generateDataFilenameByDate } from "../../utils/utils";

export class PostService {
    private posts: Post[] = [];
    private fullFilePath: string = "";

    constructor(public filename: string) {
        this.fullFilePath = join(__dirname, "../../data", filename);
        try {
            const fileContent: string = readFileSync(
                this.fullFilePath,
                "utf-8"
            );
            this.posts = [...JSON.parse(fileContent)];
        } catch (error) {
            errorLogStream.write(`File Read Error ${error.message}\n`);
            this.posts = [];
        }        
    }

    persist = (): void => {
        try {
            writeFileSync(this.fullFilePath, JSON.stringify(this.posts));
        } catch (error) {
            errorLogStream.write(`${error.message}\n`);
            throw new CustomError(
                StatusCodes.SERVER_ERROR,
                `Cannot write json file: ${this.filename}`,
                error.message
            );
        }
    };

    getAllPosts = (): Post[] => {
        return this.posts;
    };

    getPostById = (id: string): Post => {
        const post: Post = this.posts.find((e) => e.id === id) as Post;
        if (!post) {
            errorLogStream.write(`Not found post with id: ${id}\n`);
            throw new CustomError(
                StatusCodes.NOT_FOUND,
                `Not found post with id: ${id}`
            );
        }
        return post;
    };

    addPost = (post: Post): Post => {
        this.posts = [...this.posts, post];
    //    console.log(this.posts)
        this.persist();
        return post;
    };

    deletePostById = (id: string,date :string): void => {  
        const initialLength = this.posts.length;
        this.posts = this.posts.filter(p=> p.id !== id)               
        if(this.posts.length === initialLength){
            errorLogStream.write(`Not able to delete the post with id: ${id}\n`);
            throw new CustomError(
                StatusCodes.NOT_FOUND,
                `Not able to delete the post with id: ${id}`
            );
        }          
        this.persist();     
    };

    votedPostById = (id: string, votes: number): Post | null => {
        let post: Post | null = null;
        this.posts = this.posts.map((e) => {
            if (e.id === id) {
                e.vote = votes;
                post = e;
            }
            return e;
        });
        console.log(this.posts)
        if (!post) {
            errorLogStream.write(`Not found post with id: ${id}\n`);
            throw new CustomError(
                StatusCodes.NOT_FOUND,
                `Not found post with id: ${id}`
            );
        }

        this.persist();
        return post;
    };

    updatePostById = (id: string, updatedPost: Partial<Post>): Post => {
        console.log(this.posts)

        const index = this.posts.findIndex((post) => post.id === id);
        console.log(index)
        console.log(id)
        if (index === -1) {
            throw new CustomError(StatusCodes.NOT_FOUND, `Not found post with id: ${id}`);
        }

        this.posts[index] = { ...this.posts[index], ...updatedPost };
        this.persist();
        return this.posts[index];
    };
}