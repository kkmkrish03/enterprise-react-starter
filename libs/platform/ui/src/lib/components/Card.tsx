import React from 'react';
import { Card as MuiCard, CardHeader, CardContent, CardActions, Skeleton, Box } from '@mui/material';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  isLoading = false,
  elevation = 'sm',
  className = '',
  ...props
}) => {
  const muiElevations = {
    none: 0,
    sm: 1,
    md: 3,
    lg: 6,
  };

  const selectedElevation = muiElevations[elevation];

  return (
    <MuiCard
      elevation={selectedElevation}
      className={className}
      variant={elevation === 'none' ? 'outlined' : 'elevation'}
      {...(props as any)}
    >
      {(title || subtitle || headerActions) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={headerActions}
          titleTypographyProps={{ variant: 'h6', component: 'h3' }}
          subheaderTypographyProps={{ variant: 'caption' }}
        />
      )}
      <CardContent>
        {isLoading ? (
          <Box className="space-y-3">
            <Skeleton variant="text" width="66%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="83%" height={20} />
          </Box>
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <CardActions sx={{ borderTop: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
          {footer}
        </CardActions>
      )}
    </MuiCard>
  );
};
export default Card;
