  import React, { useEffect, useState } from 'react';
  import './css/ManagerDashboard.css';
  import { useNavigate } from 'react-router-dom';
  import logo from '../images/logo.png';
  import { FiSearch } from 'react-icons/fi';
  import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
  import axios from 'axios';
import Footer from '../components/Footer';

  const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [components, setComponents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropClickFlag, setDropClickFlag] = useState(false);
    const [clickID, setClickID] = useState('');
    const [sideFlg, setSideFlg] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [loc, setLoc] = useState('');
    const [sideFormData, setSideFormData] = useState({
      quantity: '',
      location: '',
    });
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSideFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Submitted Data:', sideFormData);
    
      try {
        const response = await fetch(`http://localhost:4000/api/v1/make-available/${clickID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sideFormData)
        });
    
        const result = await response.json();
        console.log("Response from backend:", result);
        
        // Optionally reset
        // setSideFormData({ quantity: '', location: '' });
        setSideFlg(false);
       
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
      refetch();
    };
      
    // const [qnty, setQnty] = useState('');
    const features = [
      { name: 'Projects', path: '/all-projects' },
      { name: 'Create Component', path: '/create-component' },
      { name: 'Place Order', path: '/place-order' },
      { name: 'Controls', path:'/man-controls'}
    ];

    useEffect(() => {
      axios.get('http://localhost:4000/api/v1/get-all-components')
        .then(response => {
          const compArray = response.data?.data || [];
          setComponents(compArray);
          setFilteredComponents(compArray);
        })
        .catch(error => {
          console.error('Error fetching components:', error);
        });
        
    }, []);

    const refetch = () => {
      axios.get('http://localhost:4000/api/v1/get-all-components')
        .then(response => {
          const compArray = response.data?.data || [];
          setComponents(compArray);
          setFilteredComponents(compArray);
        })
        .catch(error => {
          console.error('Error fetching components:', error);
        });
        
    };
    
    const handleNavigation = (path) => {
      navigate(path);
    };

    const handleSearchChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
      if (term.trim() === '') {
        setFilteredComponents(components);
      } else {
        const filtered = components.filter(comp =>
          comp.title.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredComponents(filtered);
      }
    };

    const handleFocus = () => {
      setShowDropdown(true);
      setFilteredComponents(components);
    };

    const toggleDropdown = () => {
      setShowDropdown(prev => !prev);
    };

    const closeHandler = () => {
      setDropClickFlag(false);
      setSideFlg(false);
    }

    const makeHandler = () => {
      setSideFlg(true);
    }
    const FormCloseHandler = () => {
      setSideFlg(false);
    }
    const dropClickHandler = (ID) => {
      setDropClickFlag(true);
      setClickID(ID);
      const compo = components.find(c => c.cID === ID);
      setQuantity(compo.qnty);
      setLoc(compo.loc);
      setShowDropdown(false); // hide dropdown after selection
    };

    return (
      <div className="user-dashboard">
        {/* Navbar */}
        <div className="navbar">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <h3>Welcome to Project Pilot</h3>
          <div className="nav-buttons">
            {features.map((feature, index) => (
              <button
                key={index}
                className="nav-button"
                onClick={() => handleNavigation(feature.path)}
              >
                {feature.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar-wrapper">
            <div className="search-bar-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search components..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleFocus}
              />
              <button className="dropdown-toggle-btn" onClick={toggleDropdown}>
                {showDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>

            {/* Dropdown List */}
            {showDropdown && (
              <div className="search-dropdown">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((component, index) => (
                    <div key={index} className="dropdown-item" onClick={() => dropClickHandler(component.cID)}>
                      <div className='title'>{component.title}</div>
                      <div className='cID'>{component.cID}</div>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No components found</div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Component Card */}
        {dropClickFlag && (
          <div className="component-card">
            {components
              .filter((comp) => comp.cID === clickID)
              .map((comp, index) => (
                
                <div key={index} className="card-content">
                  <div className='title-div'>
                    <div>
                      <h2>{comp.title}</h2>
                      <p> {comp.description}</p>
                  </div>
                    <p className='cID1  '><strong>{comp.cID}</strong></p>
                  </div>
                  <p><strong>Price:</strong> {comp.price}</p>
                  <p>
                    {/* <strong>Availability:</strong>{' '} */}
                    <span style={{ color: comp.available ? 'black' : 'red' }}>
                      {comp.available ? <div>
                                          <div className='is'><p><strong>In Stock</strong></p></div>
                                          <p ><strong>Quantity :</strong> {quantity}</p>
                                          <p><strong>Location :</strong> {loc} </p>
                                        </div> : (  
                        <div>
                          <div className='oos'><p><strong>Out of Stock</strong></p></div><br></br>
                          <button className='make-available-btn' onClick={makeHandler}>
                            Make Available
                          </button>
                          <button className='close-btn' onClick={closeHandler}>
                            Close
                          </button>
                        </div>
                      )}
                    </span>
                  </p>
                  
                </div>
              ))}
          </div>
        )}


        {/* Side Form for Marking Available */}
        {sideFlg && (
        <div className="side-form-card">
        <form className="component-form" onSubmit={handleSubmit}>
          <h3 className="form-title">Make Component Available</h3>
            
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={sideFormData.quantity}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              name="location"
              value={sideFormData.location}
              onChange={handleInputChange}
              required
            />
          </label>

          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={FormCloseHandler}>Close</button>
          </div>
        </form>
      </div>
    )}

        
    {/* Footer */}
    <Footer/>
  </div>
  );
};

export default ManagerDashboard;
