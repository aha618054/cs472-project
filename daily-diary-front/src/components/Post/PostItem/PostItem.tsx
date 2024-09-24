import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton,
    IconButtonProps,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useState } from "react";
import styled from "@emotion/styled";
import diaryJpg from "../../../assets/images/diary.jpg";
import Votes from "../Votes/Votes";
import { Post } from "../../../models/Post";
import { GlobalContext } from "../../../contexts/PostsContext";
import { isToday } from "date-fns";
import { convertDateToFormat } from "../../../utils/utils";
import DeleteIcon from '@mui/icons-material/Delete'
import { PostService } from "../../../services/post/postService";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
}));

export default function PostItem({ post }: { post: Post }) {
    const { searchDate } = useContext(GlobalContext);
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDelete = (id: string,searchDate : Date) => {
        const postService = new PostService();
        postService.deletePostById(id,convertDateToFormat(searchDate,"MM-dd-yyyy"));  
    }

    return (
        <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
            <CardHeader
                subheader={
                    isToday(searchDate)
                        ? "Today"
                        : convertDateToFormat(searchDate, "MMMM dd, yyyy")
                }
                action={
                    <IconButton onClick={() => handleDelete(post.id,searchDate)} aria-label="delete">                        
                            <DeleteIcon />
                    </IconButton>
                }
            ></CardHeader>
            <CardMedia
                component="img"
                height="200"
                image={diaryJpg}
                alt="Daily diary"
            ></CardMedia>
            <CardContent>
                <Typography color="text.primary">{post.title}</Typography>
                <CardActions disableSpacing>
                    <Votes post={post}></Votes>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography
                            color="text.secondary"
                            paragraph
                            sx={{ whiteSpace: "pre-wrap" }}
                        >
                            {post.body}
                        </Typography>
                    </CardContent>
                </Collapse>
            </CardContent>
        </Card>
    );
}
