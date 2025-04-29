import {Box} from "@mui/material";
import React, { useState } from 'react';

function Body2() {
    const [searchQuery, setSearchQuery] = useState('');
    const tags = ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'];
  
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
  
    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Searching for:', searchQuery);
    
    };
    return (

                <div className="hero">
      <h1 className="hero-title">CAFE</h1>
      <p className="hero-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing</p>
      
      <form className="search-container" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <span className="search-icon">🔍</span>
        </button>
      </form>
      
      <div className="tags-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
    )
}

export default Body2