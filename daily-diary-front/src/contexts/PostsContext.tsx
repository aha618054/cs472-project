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
};

export type ContextType = {
    posts: Post[];
    searchDate: Date;
    isVoted: boolean;
    isAddedNew: boolean;
    loading: boolean;
    notify: {
        status: AlertColor;
        message: string;
    };  
    updatePosts: Function;
    updateSearchDate: Function;
    updateIsVoted: Function;
    updateIsAddedNew: Function;
    updateLoading: Function;
    updateNotify: Function;   
};

const initContextValue = {
    ...initStateValue,
    updatePosts: (posts: Post[]) => {},
    updateSearchDate: (searchDate: Date) => {},
    updateIsVoted: (isVoted: boolean) => {},
    updateIsAddedNew: (isVoted: boolean) => {},
    updateLoading: (loading: boolean) => {},
    updateNotify: (notify: Notify) => {},  
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
    
  

    return (
        <GlobalContext.Provider
            value={{
                posts: state.posts,
                searchDate: state.searchDate,
                isVoted: state.isVoted,                
                isAddedNew: state.isAddedNew,
                loading: state.loading,
                notify: state.notify,
                updatePosts,
                updateSearchDate,
                updateIsVoted,
                updateIsAddedNew,
                updateLoading,
                updateNotify,            
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
