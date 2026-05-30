
import { Box, CircularProgress } from '@mui/material';

export const LoadingSpinner = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 8, height: '100%', width: '100%' }}>
      <CircularProgress />
    </Box>
  );
};
export default LoadingSpinner;
