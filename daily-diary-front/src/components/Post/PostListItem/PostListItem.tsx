import { useContext } from "react";
import PostItem from "../PostItem/PostItem";
import { GlobalContext } from "../../../contexts/PostsContext";

export default function PostListItem() {
    const { posts, updatePost, deletePost } = useContext(GlobalContext);

    return (
        <>
            {posts.map((post) => (
                <PostItem key={post.id} post={post} updatePost={updatePost} deletePost={deletePost}></PostItem>
            ))}
        </>
    );
}
