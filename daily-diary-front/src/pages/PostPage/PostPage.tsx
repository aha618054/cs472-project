import { Card, CardContent, CardHeader, Container } from "@mui/material";
import PostListItem from "../../components/Post/PostListItem/PostListItem";
import DateButtonGroup from "../../components/Post/DateButtonGroup/DateButtonGroup";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/PostsContext";
import { PostService } from "../../services/post/postService";
import { convertDateToFormat } from "../../utils/utils";
import { Post } from "../../models/Post";
import { CustomError } from "../../utils/customError";
import { isToday } from "date-fns";
import { useLocation } from "react-router-dom";

export default function PostPage() {
    const location = useLocation();
    const postService = new PostService();
    const {
        posts,
        searchDate,
        isVoted,
        isAddedNew,
      //  uid,
        updatePosts,
        updateLoading,
        updateNotify,
        updateIsVoted,
        updateIsAddedNew,
        updateSearchDate,
        updateUserId,
    } = useContext(GlobalContext);

    useEffect(() => {
        updateSearchDate(new Date());
    }, [location]);

    useEffect(() => {
        fetchPosts();
    }, [searchDate, isVoted, isAddedNew]);

    const fetchPosts = async () => {
        const currntUserId= sessionStorage.getItem('uid') === null ? 0 : parseInt(sessionStorage.getItem('uid') as string, 10);
        updateLoading(true);
        updateIsVoted(false);
        updateIsAddedNew(false);
        updateUserId(currntUserId);
        try {
            const posts: Post[] = await postService.getAllPosts(
                convertDateToFormat(searchDate, "MM-dd-yyyy")
            );
            updatePosts(posts);
            updateLoading(false);
        } catch (error) {
            let errorMsg: string = "Unknow error!";
            if (error instanceof CustomError) {
                errorMsg = error.message;
            }

            updateLoading(false);
            updateNotify({
                status: "error",
                message: errorMsg,
            });
        }
    };

    return (
        <Container maxWidth="xl">
            <Card variant="outlined" sx={{ m: 2, p: 2 }}>
            <CardHeader
            title={`List Posts (${
                isToday(searchDate)
                    ? "Today"
                    : convertDateToFormat(searchDate, "MMMM dd, yyyy")
            }) - Current User: ${sessionStorage.getItem('uname') ? sessionStorage.getItem('uname')   : ''}`}
             />
                <CardContent>
                    <DateButtonGroup />
                    {posts.length > 0 ? (
                        <PostListItem />
                    ) : (
                        <Card variant="outlined" sx={{ mt: 4, mb: 4 }}>
                            <CardContent>There is no posts</CardContent>
                        </Card>
                    )}
                    <DateButtonGroup />
                </CardContent>
            </Card>
        </Container>
    );
}