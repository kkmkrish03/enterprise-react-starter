import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.handleReset);
        }
        return this.props.fallback;
      }

      return (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            my: 4,
            mx: 'auto',
            maxWidth: 576,
            borderColor: 'error.main',
            bgcolor: 'rgba(211, 47, 47, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
            <WarningAmberIcon />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Component Error
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            An error occurred while loading this section of the screen.
          </Typography>
          <Box
            component="pre"
            sx={{
              p: 2,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              bgcolor: 'rgba(211, 47, 47, 0.08)',
              color: 'error.main',
              borderRadius: 1.5,
              overflowX: 'auto'
            }}
          >
            {this.state.error.message}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button
              variant="contained"
              color="error"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
