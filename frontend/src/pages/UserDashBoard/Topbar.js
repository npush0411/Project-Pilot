import React, {useEffect, useState  } from 'react';
import './Topbar.css';

// Async function to get user data
async function getUserData() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:4000/api/v1/me", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('User data:', result);
    return result.data.name;

  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return "Unknown User";
  }
}

function Topbar({title}) {
  const [userName, setUserName] = useState('');
  
    // Fetch user data on component mount
    useEffect(() => {
      async function fetchData() {
        const name = await getUserData();
        setUserName(name);
      }
      fetchData();
    }, []);
  return (
    <div className="topbar">
      <div className="spacer">{title}</div>
      <div className="user-info">
        <p className='pnm'>{userName}</p>
        <div className="dropdown-icon">▼</div>
        <div className="topbar-menu">
          <button>Operation Btn 1</button>
          <hr />
          <button>Operation Btn 2</button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
