import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorComponent = ({ errorCode, onRetry, msg }) => {
  console.log('ErrorComponent rendered with errorCode:', errorCode);
  const isRateLimit = errorCode === 429;

  // 🔗 Web-safe image URLs
  const imageUrl = isRateLimit
    ? 'https://cdn-icons-png.flaticon.com/512/5948/5948531.png' // 429: Overload/Warning
    : 'https://cdn-icons-png.flaticon.com/512/5957/5957285.png'; // Generic error

  const title = isRateLimit
    ? 'Whoa! Slow Down Cowboy 🐎'
    : 'Oops! Something Broke 💥';

  const explaination = isRateLimit
    ? 'We’ve hit the API rate limit for now. Chill for a bit and try again soon!'
    : 'Looks like something went wrong. Check your connection or try again later.';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt: 8,
        px: 2,
        color: '#000',
      }}>
      <img
        src={imageUrl}
        alt="Error"
        width={180}
        height={180}
        style={{ marginBottom: 20 }}
      />
      <Typography variant="h6" gutterBottom>
        {msg || 'An Error Occurred'}
      </Typography>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 400 }}>
        {explaination}
      </Typography>

      {onRetry && (
        <Button
          color="error"
          variant="contained"
          onClick={onRetry}
          sx={{ mt: 4, textTransform: 'none', px: 4 }}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorComponent;
