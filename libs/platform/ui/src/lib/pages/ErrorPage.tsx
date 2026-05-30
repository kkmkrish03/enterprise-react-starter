
import { useRouteError } from 'react-router';
import { Box, Typography, Button } from '@mui/material';

export const ErrorPage = () => {
  const error: any = useRouteError();

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
        <Typography variant="h2" sx={{ fontWeight: 'extrabold', color: 'error.main' }}>
          Oops!
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error?.statusText || error?.message || "An unexpected error occurred."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/'}
          sx={{ mt: 3, alignSelf: 'center' }}
        >
          Return to Home
        </Button>
      </Box>
    </Box>
  );
};
export default ErrorPage;
