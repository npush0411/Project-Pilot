import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './css/Search.css';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
