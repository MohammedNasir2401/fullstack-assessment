import { Box, Typography, } from "@mui/material";

function Error({ message }: { message: string }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography color="error" variant="h6">
                {message}
            </Typography>
        </Box>
    )
}

export default Error