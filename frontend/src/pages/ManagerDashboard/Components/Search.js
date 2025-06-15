import React, { useEffect, useState, useRef } from 'react';
import './Search.css';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Topbar from '../Topbar';

const Search = () => {
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [clickID, setClickID] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loc, setLoc] = useState('');
  const [sideFormData, setSideFormData] = useState({ quantity: '', location: '' });
  const [showCard, setShowCard] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const dropdownRef = useRef();

  const refetch = () => {
    axios.get('http://localhost:4000/api/v1/get-all-components')
      .then((response) => {
        const compArray = response.data?.data || [];
        setComponents(compArray);
        setFilteredComponents(compArray);
      })
      .catch((error) => console.error('Error fetching components:', error));
  };

  useEffect(() => { refetch(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredComponents(
      term.trim()
        ? components.filter((c) => c.title.toLowerCase().includes(term.toLowerCase()))
        : components
    );
    setShowDropdown(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/v1/make-available/${clickID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          qnty: sideFormData.quantity,
          loc: sideFormData.location
        }),
      });
      const result = await res.json();
      console.log('Updated:', result);
      setShowForm(false);
      setShowCard(false);
      refetch();
    } catch (err) {
      console.error('Backend error:', err);
    }
  };

  const handleDropClick = (id) => {
    setClickID(id);
    const selected = components.find((c) => c.cID === id);
    setQuantity(selected.qnty);
    setLoc(selected.loc);
    setShowDropdown(false);
    setShowCard(true);
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSideFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="search-container">
      <Topbar title='Component Search Utility' />
      <div className="main-search-body">
        <div className="search-bar" ref={dropdownRef}>
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
          />
          <button className="drop-button" onClick={() => setShowDropdown(!showDropdown)}>
            {showDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
          {showDropdown && (
            <div className="dropdown">
              {filteredComponents.length > 0 ? (
                filteredComponents.map((comp, idx) => (
                  <div
                    key={idx}
                    className="dropdown-item"
                    onClick={() => handleDropClick(comp.cID)}
                  >
                    <strong>{comp.title}</strong>
                    <span>ID: {comp.cID}</span>
                  </div>
                ))
              ) : (
                <div className="dropdown-item">No components found</div>
              )}
            </div>
          )}
        </div>

        {showCard && (
          <div className="component-card">
            {components
              .filter((comp) => comp.cID === clickID)
              .map((comp, i) => (
                <div className="card" key={i}>
                  {comp.image && (
                    <img
                      src={comp.image}
                      alt={comp.title}
                      className="component-image"
                    />
                  )}

                  <div className="card-content">
                    <div className="card-header">
                      <h3>{comp.title}</h3>
                      <span className="cid">{comp.cID}</span>
                    </div>
                    <p className="description">{comp.description}</p>
                    <p><strong>Price:</strong> ₹{comp.price}</p>
                    {comp.available ? (
                      <>
                        <div className="stock-info">
                          <p className="in-stock">In Stock</p>
                          <p><strong>Quantity:</strong> {quantity}</p>
                          <p><strong>Location:</strong> {loc}</p>
                        </div>
                        <div className="button-group">
                          <button className="secondary" onClick={() => setShowCard(false)}>Close</button>
                        </div>
                      </>
                    ) : (
                      <div className="stock-info">
                        <p className="out-of-stock">Out of Stock</p>
                        <div className="button-group">
                          <button className="primary" onClick={() => setShowForm(true)}>Make Available</button>
                          <button className="secondary" onClick={() => setShowCard(false)}>Close</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {showForm && (
          <div className="side-form">
            <form onSubmit={handleSubmit}>
              <h3>Make Component Available</h3>
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={sideFormData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={sideFormData.location}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <div className="btn-group">
                <button type="submit" className="green">Submit</button>
                <button type="button" className="red" onClick={() => setShowForm(false)}>Close</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
