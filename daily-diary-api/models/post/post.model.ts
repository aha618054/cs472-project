import { User } from "./user.model";

export interface Post {
    id: string;
    title: string;
    body: string;
    vote: number;
    user: User
}
