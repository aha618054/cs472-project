import { Post } from "../../models/Post";
import { APIService } from "../apiService";
import { StatusCode } from "../../models/enums/StatusCodeEnum";

export class PostService extends APIService {
    
    // Method to add a post
    addPost = async (date: string, post: Post): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts`;
        const requestBody = {
            ...post,
            date: date,
        };
        
        const response: Response = await this.postData(url, requestBody);

        if (response.status !== StatusCode.CREATED) {
            await this.throwError(response);
        }

        return await response.json();
    };

    // Method to get all posts
    getAllPosts = async (date: string): Promise<Post[]> => {
        const url: string = `${this.getBaseUrl()}/posts?date=${date}`;
        const response: Response = await this.getData(url);

        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }

        return await response.json();
    };

    // Method to get a post by its ID
    getPostById = async (id: string, date: string): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts/${id}?date=${date}`;
        const response: Response = await this.getData(url);

        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }

        return await response.json();
    };

    // Method to update votes for a post by its ID
    votedPostById = async (
        id: string,
        date: string,
        votes: number
    ): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts/${id}/vote`; // Updated to match the backend route
        const requestBody = {
            date: date,
            votes: votes,
        };

        const response: Response = await this.patchData(url, requestBody);

        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }
        return await response.json();
    };

    // Method to update a post by its ID
    updatePostById = async (
        id: string,
        date: string,
        updatedData: { title: string; body: string }
    ): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts/${id}`;
        const requestBody = {
            ...updatedData,
            date: date,
        };

        const response: Response = await this.putData(url, requestBody);

        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }

        return await response.json();
    };
}
