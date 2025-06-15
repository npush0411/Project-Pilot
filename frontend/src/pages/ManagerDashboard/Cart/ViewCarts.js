import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewCarts.css';
import TopBarWithLogo from '../TopBarWithLogo';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ViewCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCart, setSelectedCart] = useState(null);
  const [selectedForRemoval, setSelectedForRemoval] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/get-carts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCarts(res.data.data);
      } catch (err) {
        setError('Failed to load carts');
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const openDetailsModal = (cart) => {
    setSelectedCart(cart);
    setSelectedForRemoval([]);
  };

  const closeModal = () => {
    setSelectedCart(null);
    setSelectedForRemoval([]);
  };

  const goToOrderPage = (token) => {
    navigate(`/cart-order/${token}`);
  };

  const handleCheckboxToggle = (index) => {
    setSelectedForRemoval((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const removeSelectedComponents = () => {
    if (!selectedCart) return;
    const updatedDetails = selectedCart.details.filter(
      (item, index) => !selectedForRemoval.includes(index)
    );
    setSelectedCart({ ...selectedCart, details: updatedDetails });
    setSelectedForRemoval([]);
  };

const handleCheckIn = (cart) => {
  navigate(`/cart-check-in/${cart.ID}`, { state: { cart } });
};


  const handleUpdateCart = (cart) => {
  navigate('/get-order', {
      state: {
        cart,
        editMode: true,
     },
    });
  };


  if (loading) return <div className="view-carts-container">Loading...</div>;
  if (error) return <div className="view-carts-container error">{error}</div>;

  return (
    <div className="view-carts-container" style={{ marginTop: '10rem' }}>
      <TopBarWithLogo title="All Carts" />
      {carts.length === 0 ? (
        <p>No carts available.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Cart ID</th>
              <th>Vendor ID</th>
              <th>Vendor Name</th>
              <th>Creation Date</th>
              <th>Order Date</th>
              <th>Check-In Date</th>
              <th></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr key={cart._id}>
                <td>{cart.ID}</td>
                <td>{cart.vendorID || 'N/A'}</td>
                <td>{cart.vendorName || 'N/A'}</td>
                <td>{new Date(cart.crationDate).toLocaleDateString()}</td>
                <td>{cart.orderDate ? new Date(cart.orderDate).toLocaleDateString() : 'N/A'}</td>
                <td>{cart.checkInDate ? new Date(cart.checkInDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => openDetailsModal(cart)}>View Details</button>
                </td>
                <td>
                  {cart.ordered ? (
                    <button onClick={() => handleCheckIn(cart)} >Check In</button>
                  ) : (
                    <>
                      <button onClick={() => goToOrderPage(cart.ID)}>Order</button>
                      <button onClick={() => handleUpdateCart(cart)}>Update</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCart && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Details for Cart: {selectedCart.ID}</h3>
              <button className="close-btn" onClick={closeModal}>
                ✖
              </button>
            </div>
            <table className="details-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Component ID</th>
                  <th>Name</th>
                  <th>Ordered Quantity</th>
                  <th>Received Quantity</th>
                  <th>Deficit</th>
                  <th>Check-In</th>
                  <th>Damage Count</th>
                </tr>
              </thead>
              <tbody>
                {selectedCart.details.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedForRemoval.includes(i)}
                        onChange={() => handleCheckboxToggle(i)}
                      />
                    </td>
                    <td>{item.ID}</td>
                    <td>{item.Name}</td>
                    <td>{item.orderedQuantity}</td>
                    <td>{item.receivedQuantity ?? 'N/A'}</td>
                    <td>
                      {item.deflict?.number
                        ? `${item.deflict.number} - ${item.deflict.remark}`
                        : 'None'}
                    </td>
                    <td>{item.checkIn ? 'Yes' : 'No'}</td>
                    <td>{item.damageCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedForRemoval.length > 0 && (
              <button className="remove-selected-btn" onClick={removeSelectedComponents}>
                Remove Selected
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCarts;
