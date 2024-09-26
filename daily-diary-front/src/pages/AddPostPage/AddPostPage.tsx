import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    TextField,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { GlobalContext } from "../../contexts/PostsContext";
import { PostService } from "../../services/post/postService";
import { convertDateToFormat } from "../../utils/utils";
import { CustomError } from "../../utils/customError";
import { isRequired, isValidMaxlength } from "../../utils/validateInput";

type PostInputForm = {
    title: string;
    errorTitle: string;
    description: string;
    errorDescription: string;
    isValidForm: boolean;
};

export default function AddPostPage() {
    const navigate = useNavigate();
    const postService = new PostService();
    const { searchDate, updateIsAddedNew, updateLoading, updateNotify } =
        useContext(GlobalContext);

    const [postInputForm, setPostInputForm] = useState({
        title: "",
        errorTitle: "",
        description: "",
        errorDescription: "",
        isValidForm: false,
    });

    const validateInputForm = (): boolean => {
        let tempErrors = {
            errorTitle: "",
            errorDescription: "",
            isValidForm: false,
        };

        if (!isRequired(postInputForm.title)) {
            tempErrors.errorTitle = "Title is required";
        } else if (!isValidMaxlength(postInputForm.title, 200)) {
            tempErrors.errorTitle = "Title must be less len 200 characters";
        }

        if (!isRequired(postInputForm.description)) {
            tempErrors.errorDescription = "Description is required";
        } else if (!isValidMaxlength(postInputForm.description, 1000)) {
            tempErrors.errorDescription =
                "Description must be less len 1000 characters";
        }

        tempErrors.isValidForm =
            !tempErrors.errorTitle && !tempErrors.errorDescription;

        setPostInputForm((prev) => ({
            ...prev,
            errorTitle: tempErrors.errorTitle,
            errorDescription: tempErrors.errorDescription,
            isValidForm: tempErrors.isValidForm,
        }));
        return tempErrors.isValidForm;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateInputForm()) {
            addPost();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPostInputForm({ ...postInputForm, [e.target.name]: e.target.value });
    };

    const addPost = async () => {
        try {
            updateLoading(true);
            await postService.addPost(
                convertDateToFormat(searchDate, "MM-dd-yyyy"),
                {
                    id: "",
                    title: postInputForm.title,
                    body: postInputForm.description,
                    vote: 0,
                    user: {
                        uid: sessionStorage.getItem('uid') === null ? 0 : parseInt(sessionStorage.getItem('uid') as string, 10),
                        uname: sessionStorage.getItem('uname') || ''
                    }
                }
            );
            updateIsAddedNew(true);
            updateLoading(false);
            updateNotify({
                status: "success",
                message: "Add post successfully",
            });
            navigate("/posts");
        } catch (error) {
            let errMsg: string = "Unknow error";
            if (error instanceof CustomError) {
                errMsg = error.message;
            }

            updateLoading(false);
            updateNotify({
                status: "error",
                message: errMsg,
            });
        }
    };

    return (
        <Container maxWidth="xl">
            <Card variant="outlined" sx={{ m: 2, p: 2 }}>
                <CardHeader title="New Post" />
                <CardContent>
                    <Box
                        component="form"
                        sx={{
                            "& .MuiTextField-root": {
                                mt: 1,
                                mb: 1,
                                width: "100%",
                            },
                            Button: { mt: 1 },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                name="title"
                                value={postInputForm.title}
                                placeholder="Enter title"
                                onChange={handleChange}
                                error={postInputForm.errorTitle.length > 0}
                                helperText={postInputForm.errorTitle}
                            />
                        </div>
                        <div>
                            <TextField
                                required
                                fullWidth
                                label="Description"
                                multiline
                                rows={15}
                                name="description"
                                value={postInputForm.description}
                                placeholder="Enter description"
                                onChange={handleChange}
                                error={
                                    postInputForm.errorDescription.length > 0
                                }
                                helperText={postInputForm.errorDescription}
                            />
                        </div>
                        <div>
                            <Button
                                component={Link}
                                to="/posts"
                                variant="outlined"
                                startIcon={<SkipPreviousOutlinedIcon />}
                                sx={{ mt: 1 }}
                            >
                                Back
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<SendOutlinedIcon />}
                                type="submit"
                                sx={{ ml: 1 }}
                            >
                                Submit
                            </Button>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
