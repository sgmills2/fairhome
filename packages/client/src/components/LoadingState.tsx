import { CircularProgress, Typography, Box } from '@mui/joy';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
        p: 2
      }}
    >
      <CircularProgress size="lg" />
      <Typography level="body-sm">{message}</Typography>
    </Box>
  );
} 