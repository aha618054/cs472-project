// PostItem.tsx
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    TextField,
    Button
} from "@mui/material";
import { useContext, useState } from "react";
import diaryJpg from "../../../assets/images/diary.jpg";
import Votes from "../Votes/Votes";
import { Post } from "../../../models/Post";
import { GlobalContext } from "../../../contexts/PostsContext";
import { isToday } from "date-fns";
import { convertDateToFormat } from "../../../utils/utils";
 
interface PostItemProps {
    post: Post;
    updatePost: (id: string, updatedData: { title: string; body: string }) => void;
    deletePost: (id: string) => void;
}
 
const currentUser = {
    uid: localStorage.getItem('uid') === null ? 0 : parseInt(localStorage.getItem('uid') as string, 10),
    uname: localStorage.getItem('uname') || '' 
}

export default function PostItem({ post, updatePost, deletePost }: PostItemProps) {
    const { searchDate } = useContext(GlobalContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedBody, setEditedBody] = useState(post.body);
 
    const handleEditClick = () => {
        setIsEditing(true);
    };
 
    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedTitle(post.title);
        setEditedBody(post.body);
    };
 
    const handleSaveClick = () => {
        updatePost(post.id, {
            title: editedTitle,
            body: editedBody
        });
        setIsEditing(false);
    };
 
    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost(post.id);
        }
    };
 
    return (
        <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
            <CardHeader              
             
                subheader={
                    `${isToday(searchDate)
                        ? "Today"
                        : convertDateToFormat(new Date(searchDate), "MMMM dd, yyyy")}`
                }
            />
            <CardMedia
                component="img"
                height="200"
                image={diaryJpg}
                alt="Daily diary"
            />
            <CardContent>
                {isEditing ? (
                    <>
                        <TextField
                            fullWidth
                            label="Title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Body"
                            value={editedBody}
                            onChange={(e) => setEditedBody(e.target.value)}
                            multiline
                            rows={4}
                        />
                        <Button onClick={handleSaveClick} variant="contained" sx={{ mt: 2, mr: 1 }}>
                            Save
                        </Button>
                        <Button onClick={handleCancelClick} variant="outlined" sx={{ mt: 2 }}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography color="text.primary">{post.title}</Typography>
                        <Typography color="text.secondary" paragraph sx={{ whiteSpace: "pre-wrap" }}>
                            {post.body}
                        </Typography>
                    </>
                )}
            </CardContent>
            <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
                <Votes post={post} /> {/* Voting component stays left-aligned */}
                {!isEditing && currentUser.uid === post.user.uid && (
                    <div>
                        <Button onClick={handleEditClick} variant="outlined" sx={{ ml: 2 }}>
                            Edit
                        </Button>
                        <Button onClick={handleDeleteClick} variant="contained" color="error" sx={{ ml: 2 }}>
                            Delete
                        </Button>
                    </div>
                )}
            </CardActions>
        </Card>
    );
}