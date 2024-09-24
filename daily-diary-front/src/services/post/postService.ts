import { Post } from "../../models/Post";
import { APIService } from "../apiService";
import { StatusCode } from "../../models/enums/StatusCodeEnum";

export class PostService extends APIService {
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

    getAllPosts = async (date: string): Promise<Post[]> => {
        const url: string = `${this.getBaseUrl()}/posts?date=${date}`;
        const response: Response = await this.getData(url);
        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }

        return await response.json();
    };

    getPostById = async (id: string, date: string): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts/${id}?date=${date}`;        
        const response: Response = await this.getData(url);
        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }
        return await response.json();
    };

    deletePostById = async (id: string, date: string): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts/delete/${id}/${date}`;    
        const response: Response = await this.deleteData(url);
        if (response.status !== StatusCode.SUCCESS) {
            await this.throwError(response);
        }
        return await response.json();
    };

    votedPostById = async (
        id: string,
        date: string,
        votes: number
    ): Promise<Post> => {
        const url: string = `${this.getBaseUrl()}/posts/${id}`;
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
}
