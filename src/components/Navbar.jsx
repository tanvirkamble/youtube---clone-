import React from 'react';
import { Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { logo } from '../utils/constants';
import { SearchBar } from './index';

const Navbar = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      p={2}
      sx={{
        position: 'sticky',
        background: '#000',
        top: 0,
        justifyContent: 'space-between',
        zIndex: 1000,
      }}>
      <Link to="/">
        <img src={logo} alt="logo" height={45} />
      </Link>

      <SearchBar />
    </Stack>
  );
};

export default Navbar;
