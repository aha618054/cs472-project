import { Typography } from "@mui/material";

export default function AdminInformation() {
    return (
        <>
            <div>
                <Typography component="span">
                    <strong>Student Name: </strong> John Doe
                </Typography>
            </div>
            <div>
                <Typography component="span">
                    <strong>Student ID: </strong> 617778
                </Typography>
            </div>
            <div>
                <Typography component="span">
                    <strong>Phone: </strong> [641]-233-9999
                </Typography>
            </div>
            <div>
                <Typography component="span">
                    <strong>Email: </strong> jhd@miu.edu
                </Typography>
            </div>
        </>
    );
}
