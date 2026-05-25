import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" sx={{
            p: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
                (theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800])
        }}>
            <Typography variant="body1" align="center">
                Job Application Tracker © {new Date().getFullYear()}
            </Typography>
        </Box>
    );
};

export default Footer;
