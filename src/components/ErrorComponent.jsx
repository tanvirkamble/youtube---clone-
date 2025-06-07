import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorComponent = ({ errorCode, onRetry, msg }) => {
  console.log('ErrorComponent rendered with errorCode:', errorCode);

  // 🎨 Define visuals based on status code
  let imageUrl = 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png'; // Default error
  let title = 'Oops! Something Broke 💥';
  let explaination = 'Something unexpected happened. Please try again later.';

  if (errorCode === 429) {
    imageUrl = 'https://cdn-icons-png.flaticon.com/512/564/564619.png'; // Rate limit
    title = 'Whoa! Slow Down Cowboy 🐎';
    explaination =
      'You’ve hit the API rate limit. Take a breather and try again in a bit!';
  } else if (errorCode === 403) {
    imageUrl = 'https://cdn-icons-png.flaticon.com/512/753/753345.png'; // Quota exceeded
    title = 'API Quota Maxed Out 🚫';
    explaination =
      'Our daily API quota is outta juice. Come back in 24 hours or upgrade your API key.';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt: 8,
        px: 2,
        color: '#fff',
      }}>
      <img
        src={imageUrl}
        alt="Error"
        width={180}
        height={180}
        style={{ marginBottom: 20 }}
      />
      <Typography variant="h6" color="grey" gutterBottom>
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
