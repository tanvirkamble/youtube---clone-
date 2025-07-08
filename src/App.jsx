import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import {
  ChannelDetail,
  Navbar,
  Feed,
  VideoDetail,
  SearchFeed,
  ShortsPage,
} from './components/index';

const App = () => {
  return (
    <BrowserRouter>
      <Box>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/channel/:id" element={<ChannelDetail />} />
          <Route path="/search/:searchedTerm" element={<SearchFeed />} />
          <Route path="/shorts" element={<ShortsPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;
