import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const SidebarToggle = ({ isSidebarOpen, toggleSidebar, toggleSidebarText }) => {
  if (isSidebarOpen) return null;
  if (window.innerWidth > 768) { return null; }

  return (
    <Button 
      //className="sidebar-toggle"
      variant="contained" 
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar menu"
      aria-hidden={isSidebarOpen ? 'true' : 'false'}
      sx={{
        backgroundColor: '#4d4d4d',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#444',
        },
        //fontSize: '14px',
      }}    
    >
      <DashboardIcon />
      {toggleSidebarText && <span>{toggleSidebarText}</span>} 
    </Button>
  );
};

SidebarToggle.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleSidebarText: PropTypes.string,
};

export default SidebarToggle;
