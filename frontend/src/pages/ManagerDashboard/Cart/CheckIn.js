import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CheckIn.css';
import { useLocation, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CheckIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || {};
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (cart?.details) {
      const updatedDetails = cart.details.map(item => ({
        ...item,
        receivedQuantity: item.receivedQuantity || 0,
        damageCount: item.damageCount || 0,
        checkIn: false,
        deflict: {
          number: 0,
          remark: ''
        },
        finally: Math.max((item.receivedQuantity || 0) - (item.damageCount || 0), 0)
      }));
      setDetails(updatedDetails);
    }
  }, [cart]);

  const handleInputChange = (index, field, value) => {
    const updated = [...details];
    const item = updated[index];

    if (field === 'receivedQuantity') {
      item.receivedQuantity = parseInt(value) || 0;
    } else if (field === 'damageCount') {
      item.damageCount = parseInt(value) || 0;
    } else if (field === 'remark') {
      item.deflict.remark = value;
    } else if (field === 'checkIn') {
      item.checkIn = value;
    }

    // Recalculate deficit
    if (item.orderedQuantity > item.receivedQuantity) {
      item.deflict.number = item.orderedQuantity - item.receivedQuantity;
    } else {
      item.deflict.number = 0;
      item.deflict.remark = '';
    }

    // Recalculate finally in real time
    item.finally = Math.max(item.receivedQuantity - item.damageCount, 0);

    setDetails(updated);
  };

  const handleSubmit = async () => {
    try {
     await axios.put(
  `${BASE_URL}/cart/checkin/${cart.ID}`,
  {
    checkInDate: new Date(),
    details
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
);

      alert('Cart checked in successfully');
      navigate('/viewcarts');
    } catch (err) {
      console.error(err);
      alert('Failed to check in cart');
    }
  };
  
  return (
    <div className="checkin-container">
      <h2>Check In - Cart ID: {cart?.ID}</h2>
      <table className="checkin-table">
        <thead>
          <tr>
            <th>Component ID</th>
            <th>Name</th>
            <th>Ordered Qty</th>
            <th>Received Qty</th>
            <th>Damage Count</th>
            <th>Deficit</th>
            <th>Remark</th>
            <th>Final Qty</th>
            <th>Check In?</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, idx) => (
            <tr key={idx}>
              <td>{item.ID}</td>
              <td>{item.Name}</td>
              <td>{item.orderedQuantity}</td>
              <td>
                <input
                  type="number"
                  value={item.receivedQuantity}
                  onChange={e => handleInputChange(idx, 'receivedQuantity', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.damageCount}
                  onChange={e => handleInputChange(idx, 'damageCount', e.target.value)}
                />
              </td>
              <td>{item.deflict.number || 0}</td>
              <td>
                <input
                  type="text"
                  value={item.deflict.remark}
                  onChange={e => handleInputChange(idx, 'remark', e.target.value)}
                  disabled={item.deflict.number === 0}
                />
              </td>
              <td>{item.finally}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.checkIn}
                  onChange={e => handleInputChange(idx, 'checkIn', e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="checkin-submit-btn" onClick={handleSubmit}>
        Submit Check In
      </button>
    </div>
  );
};

export default CheckIn;
