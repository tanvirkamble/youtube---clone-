import React from 'react';
import { Stack } from '@mui/material';
import { categories } from '../utils/constants';
import useSidebarStore from '../store/sidebarStore';
import { useLocation, useNavigate } from 'react-router-dom';

const SideBar = () => {
  const selectedCategory = useSidebarStore((state) => state.selectedCategory);
  const setSelectedCategory = useSidebarStore(
    (state) => state.setSelectedCategory
  );

  const location = useLocation();
  const navigate = useNavigate();

  const isOnFeedPage = location.pathname === '/';

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (!isOnFeedPage) {
      navigate('/');
    }
  };

  return (
    <Stack sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' } }}>
      {categories.map((category) => {
        const isActive = isOnFeedPage && selectedCategory === category.name;

        return (
          <button
            key={category.name}
            className="category-btn"
            onClick={() => handleCategoryClick(category.name)}
            style={{
              color: '#fff',
              background: isActive ? '#FC1503' : 'transparent',
            }}>
            <span
              style={{
                color: isActive ? '#fff' : 'red',
                marginRight: '15px',
              }}>
              {category.icon}
            </span>
            <span
              style={{
                opacity: isActive ? 1 : 0.7,
              }}>
              {category.name}
            </span>
          </button>
        );
      })}
    </Stack>
  );
};

export default SideBar;
