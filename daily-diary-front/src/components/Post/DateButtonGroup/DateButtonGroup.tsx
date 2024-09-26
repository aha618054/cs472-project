import { Box, Button, ButtonGroup, Fab } from "@mui/material";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { addDays, subDays, isToday } from "date-fns";
import { useContext } from "react";
import { GlobalContext } from "../../../contexts/PostsContext";

export default function DateButtonGroup() {
    const { searchDate, updateSearchDate } = useContext(GlobalContext);
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
                justifyContent: "space-between",
            }}
        >
            <ButtonGroup variant="outlined" aria-label="Loading button group">
                <Button
                    startIcon={<SkipPreviousOutlinedIcon />}
                    onClick={() => updateSearchDate(subDays(searchDate, 1))}
                >
                    Back
                </Button>
                <Button
                    endIcon={<SkipNextOutlinedIcon />}
                    onClick={() => updateSearchDate(addDays(searchDate, 1))}
                    disabled={isToday(searchDate)}
                >
                    Next
                </Button>
            </ButtonGroup>
            <Button
                component={Link}
                to="/posts/add"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!isToday(searchDate)}
            >
                Add
            </Button>
        </Box>
    );
}
