
import { Link } from 'react-router';
import { Box, Typography, Button } from '@mui/material';

export const NotFoundPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        px: 2
      }}
    >
      <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 'extrabold', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ mt: 3, alignSelf: 'center' }}
        >
          Return to Home
        </Button>
      </Box>
    </Box>
  );
};
export default NotFoundPage;
