import React from 'react';
import PropTypes from 'prop-types';
import { FaBars } from 'react-icons/fa';

const SidebarToggle = ({ isSidebarOpen, toggleSidebar }) => {
  if (isSidebarOpen) return null;

  return (
    <button 
      className="sidebar-toggle"
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar menu"
      aria-hidden={isSidebarOpen ? 'true' : 'false'}
    >
      <FaBars /> <span>Menu</span>
    </button>
  );
};

SidebarToggle.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default SidebarToggle;
