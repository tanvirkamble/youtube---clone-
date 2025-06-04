import React from 'react';
import { Stack } from '@mui/material';
import { categories } from '../utils/constants';

const SideBar = ({ selectedCategory, setSelectedCategory }) => {
  // const selectedCategory = 'new';
  return (
    <Stack sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' } }}>
      {categories.map((category) => (
        <button
          className="category-btn"
          onClick={() => setSelectedCategory(category.name)}
          style={{
            color: '#fff',
            background: category.name === selectedCategory && '#FC1503',
          }}
          key={category.name}>
          <span
            style={{
              color: category.name !== selectedCategory && 'red',
              marginRight: '15px',
            }}>
            {category.icon}
          </span>
          <span
            style={{
              opacity: category.name !== selectedCategory && 0.7,
            }}>
            {category.name}
          </span>
        </button>
      ))}
    </Stack>
  );
};

export default SideBar;
