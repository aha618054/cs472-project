import { createContext, ReactNode, useState } from "react";
import { Post } from "../models/Post";
import { AlertColor } from "@mui/material";

type StateType = {
    posts: Post[];
    searchDate: Date;
    isVoted: boolean;
    isAddedNew: boolean;
    loading: boolean;
    notify: Notify;
    uid : number;    
};

type Notify = {
    status: AlertColor;
    message: string;
};

const initStateValue = {
    posts: [] as Post[],
    searchDate: new Date(),
    isVoted: false,
    isAddedNew: false,
    loading: false,
    notify: { status: "success" as AlertColor, message: "" },
    uid : 0,
};

export type ContextType = {
    posts: Post[];
    searchDate: Date;
    isVoted: boolean;
    isAddedNew: boolean;
    loading: boolean;
    notify: Notify;
    uid : number;
    updatePosts: (posts: Post[]) => void;
    updateSearchDate: (searchDate: Date) => void;
    updateIsVoted: (isVoted: boolean) => void;
    updateIsAddedNew: (isAddedNew: boolean) => void;
    updateLoading: (loading: boolean) => void;
    updateNotify: (notify: Notify) => void;
    updatePost: (id: string, updatedData: { title: string; body: string }) => void;
    deletePost: (id: string) => void; // Added deletePost type     
    updateUserId: (uid: number) => void; 
};

const initContextValue: ContextType = {
    ...initStateValue,
    updatePosts: () => {},
    updateSearchDate: () => {},
    updateIsVoted: () => {},
    updateIsAddedNew: () => {},
    updateLoading: () => {},
    updateNotify: () => {},
    updatePost: () => {},
    deletePost: () => {}, // Added deletePost initialization
    updateUserId: () => {},
};

export const GlobalContext = createContext(initContextValue);

export function PostsContext({ children }: { children: ReactNode }) {
    const [state, setState] = useState<StateType>(initStateValue);

    const updatePosts = (posts: Post[]) => {
        setState((prev) => ({ ...prev, posts }));
    };

    const updateSearchDate = (searchDate: Date) => {
        setState((prev) => ({ ...prev, searchDate }));
    };

    const updateIsVoted = (isVoted: boolean) => {
        setState((prev) => ({ ...prev, isVoted }));
    };

    const updateIsAddedNew = (isAddedNew: boolean) => {
        setState((prev) => ({ ...prev, isAddedNew }));
    };

    const updateLoading = (loading: boolean) => {
        setState((prev) => ({ ...prev, loading }));
    };

    const updateNotify = (notify: Notify) => {
        setState((prev) => ({ ...prev, notify }));
    };

    const updateUserId = (uid: number) => {
        setState((prev) => ({ ...prev, uid }));
    };


    // Function to update a post
    const updatePost = (id: string, updatedData: { title: string; body: string }) => {
        fetch(`http://localhost:8080/api/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...updatedData, date: state.searchDate.toISOString().split('T')[0] }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then((error) => {
                        console.error("Error response from backend:", error);
                        throw new Error(`Failed to update the post. Server response: ${error}`);
                    });
                }
                return response.json();
            })
            .then((updatedPost: Post) => {
                setState((prev) => ({
                    ...prev,
                    posts: prev.posts.map((post) => (post.id === id ? updatedPost : post)),
                }));
                updateNotify({ status: "success", message: "Post updated successfully" });
            })
            .catch(error => {
                console.error("Error updating post:", error);
                updateNotify({ status: "error", message: error.message || "Failed to update the post" });
            });
    };

    // Function to delete a post
    const deletePost = (id: string) => {
        //console.log(id +'Search Date' +state.searchDate.toISOString().split('T')[0])
        fetch(`http://localhost:8080/api/posts/${id}?date=${state.searchDate.toISOString().split('T')[0]}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then((error) => {
                        console.error("Error response from backend:", error);
                        throw new Error(`Failed to delete the post. Server response: ${error}`);
                    });
                }
                setState((prev) => ({
                    ...prev,
                    posts: prev.posts.filter((post) => post.id !== id),
                }));
                updateNotify({ status: "success", message: "Post deleted successfully" });
            })
            .catch(error => {
                console.error("Error deleting post:", error);
                updateNotify({ status: "error", message: error.message || "Failed to delete the post" });
            });
    };

    return (
        <GlobalContext.Provider
            value={{
                posts: state.posts,
                searchDate: state.searchDate,
                isVoted: state.isVoted,
                isAddedNew: state.isAddedNew,
                loading: state.loading,
                notify: state.notify,
                uid: state.uid,
                updatePosts,
                updateSearchDate,
                updateIsVoted,
                updateIsAddedNew,
                updateLoading,
                updateNotify,
                updatePost, 
                deletePost, // Provide the deletePost function in the context
                updateUserId,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}