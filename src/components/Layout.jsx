// components/Layout.jsx
import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Navbar from './Navbar';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('New');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#000',
      }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Page Content */}
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ flex: 1 }}>
        {/* Sidebar Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '240px' },
            height: { xs: 'auto', md: '100vh' },
            overflowY: 'auto',
            borderRight: { md: '1px solid #3d3d3d' },
            px: { xs: 1, md: 2 },
            py: 2,
            bgcolor: '#000',
          }}>
          <SideBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: '#fff',
              display: { xs: 'none', md: 'block' },
            }}>
            © 2025 VristiTube
          </Typography>
        </Box>

        {/* Main Route Content */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          {/* Inject category props to children like Feed */}
          {React.cloneElement(children, {
            selectedCategory,
            setSelectedCategory,
          })}
        </Box>
      </Stack>
    </Box>
  );
};

export default Layout;
