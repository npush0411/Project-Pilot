import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RequirementManager.css';
import { useNavigate, useLocation } from 'react-router-dom';
import TopBarWithLogo from './TopBarWithLogo';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RequirementManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, editMode } = location.state || {};
  const [midOrders, setMidOrders] = useState([]);
  const [initialMidOrders, setInitialMidOrders] = useState([]);
  const [masterComponents, setMasterComponents] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [newEntry, setNewEntry] = useState({ ID: '', name: '', quantity: '' });
  const [error, setError] = useState('');
  const [isNameLocked, setIsNameLocked] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchInitialData();
    console.log("Edit Mode:", editMode);
    console.log("Cart Object:", cart);
  }, []);

  useEffect(() => {
    if (editMode && cart?.details?.length) {
      setCartItems(cart.details.map(c => ({
        ID: c.ID,
        Name: c.Name,
        orderedQuantity: c.orderedQuantity,
      })));
    }
  }, [editMode, cart]);

  const fetchInitialData = async () => {
    try {
      const [reqRes, compRes] = await Promise.all([
        axios.get(`${BASE_URL}/mid-orders/fetch`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/get-all-components`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const filteredReqs = reqRes.data.data.filter(item => item.toOrder > 0);
      setMidOrders(filteredReqs);
      setInitialMidOrders(reqRes.data.data);
      setMasterComponents(compRes.data.data || []);
    } catch (err) {
      console.error('ERROR', err);
      alert('Auth error! Please log in again.');
    }
  };

  const handleIDChange = (value) => {
    const ID = value.trim().toUpperCase();
    const reqMatch = midOrders.find(item => item.ID === ID);
    const compMatch = masterComponents.find(c => c.cID === ID);

    let name = '';
    let lock = false;

    if (reqMatch) {
      name = reqMatch.name;
      lock = true;
    } else if (compMatch) {
      name = compMatch.title;
      lock = true;
    }

    setNewEntry(prev => ({ ...prev, ID, name }));
    setIsNameLocked(lock);
  };

  const handleAddEntry = () => {
    const { ID, name, quantity } = newEntry;
    if (!ID || !quantity) return setError('Please enter ID and quantity.');

    let updatedMidOrders = [...midOrders];
    const existing = updatedMidOrders.find(item => item.ID === ID);
    const masterMatch = masterComponents.find(c => c.cID === ID);
    const isNewComponent = !existing && !masterMatch;

    const resolvedName = existing?.name || masterMatch?.title || name;

    if (!resolvedName && isNewComponent) {
      return setError('Please enter name for new component.');
    }

    if (!isNewComponent && cartItems.some(c => c.ID === ID)) {
      return setError('Duplicate ID entry is not allowed.');
    }

    const enteredQty = parseInt(quantity);

    if (existing) {
      if (enteredQty >= existing.toOrder) {
        updatedMidOrders = updatedMidOrders.filter(item => item.ID !== ID);
      } else {
        updatedMidOrders = updatedMidOrders.map(item =>
          item.ID === ID ? { ...item, toOrder: item.toOrder - enteredQty } : item
        );
      }
    }

    if (isNewComponent) {
      alert('New component not found in system. Entry will be saved with ID "TCR".\nYou have to create component while checkIn');
    }

    setCartItems(prev => [
      ...prev,
      {
        ID: isNewComponent ? 'TCR' : ID,
        Name: resolvedName,
        orderedQuantity: enteredQty
      }
    ]);

    setMidOrders(updatedMidOrders);
    setNewEntry({ ID: '', name: '', quantity: '' });
    setIsNameLocked(false);
    setError('');
  };

  const handleRemoveEntry = (index) => {
    const itemToRemove = cartItems[index];
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);

    if (itemToRemove.ID !== 'TCR') {
      const original = initialMidOrders.find(item => item.ID === itemToRemove.ID);
      if (original) {
        const alreadyExists = midOrders.find(item => item.ID === original.ID);
        if (alreadyExists) {
          setMidOrders(midOrders.map(item =>
            item.ID === original.ID
              ? { ...item, toOrder: item.toOrder + itemToRemove.orderedQuantity }
              : item
          ));
        } else {
          setMidOrders([...midOrders, original]);
        }
      }
    }

    setCartItems(updatedCart);
  };

  const handleSaveCart = async () => {
    try {
      const res1 = await axios.put(`${BASE_URL}/mid-orders/update`, {
        updatedReqs: midOrders,
        creationDate: new Date()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let res2;

      if (editMode) {
        const updatedCart = {
          ID: cart.ID,
          vendorID: cart.vendorID || undefined,
          vendorName: cart.vendorName || undefined,
          ordered: cart.ordered ?? false,
          orderDate: cart.orderDate || undefined,
          checkInDate: cart.checkInDate || undefined,
          token: token,
          details: cartItems
        };

        res2 = await axios.put(`${BASE_URL}/update-cart`, updatedCart, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res2 = await axios.post(`${BASE_URL}/create-cart`, {
          details: cartItems,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (!res1 && !res2) {
        alert(`Unable to ${editMode ? 'Update' : 'Create'} Cart and Requirement Table`);
        return;
      } else if (!res1) {
        alert(`Cart ${editMode ? 'Updated' : 'Created'} but failed to update Requirement Table`);
        return;
      } else if (!res2) {
        alert(`Requirement Table updated but failed to ${editMode ? 'Update' : 'Create'} Cart`);
        return;
      }

      alert(`Cart ${editMode ? 'updated' : 'created'} and requirement table saved successfully!`);
      setCartItems([]);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editMode ? 'update' : 'save'} cart.`);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/create-cart`, {
        details: cartItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const createdCart = res.data?.data;
      if (!createdCart?.ID) {
        alert('Cart created, but response missing cart ID.');
        return;
      }

      alert('Cart created successfully! Redirecting to Order page...');
      navigate(`/cart-order/${createdCart.ID}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create and order cart.');
    }
  };

  return (
    <div className="req-container">
      <TopBarWithLogo title='Cart Master' />
      <div className='mstt'>
        {editMode && (
          <div className="edit-banner">
            <strong>Editing Cart:</strong> {cart?.ID || 'Cart ID not found'}
          </div>
        )}

        <div className="req-section">
          <h3>Requirement Table</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Required</th><th>Available</th><th>To Order</th>
              </tr>
            </thead>
            <tbody>
              {midOrders.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ID}</td>
                  <td>{item.name}</td>
                  <td>{item.reqty}</td>
                  <td>{item.available}</td>
                  <td>{item.toOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="req-entry">
          <h3>Add Entry</h3>
          <div className="entry-row">
            <input
              placeholder="ID"
              value={newEntry.ID}
              onChange={e => handleIDChange(e.target.value)}
            />
            <input
              placeholder="Name"
              value={newEntry.name}
              onChange={e => setNewEntry({ ...newEntry, name: e.target.value })}
              disabled={isNameLocked}
            />
            <input
              placeholder="Quantity"
              type="number"
              value={newEntry.quantity}
              onChange={e => setNewEntry({ ...newEntry, quantity: e.target.value })}
            />
          </div>
          <button onClick={handleAddEntry}>+ Add Entry</button>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="req-cart">
          <h3>Cart Preview</h3>
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Ordered Quantity</th><th></th></tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.ID}</td>
                  <td>{item.Name}</td>
                  <td>{item.orderedQuantity}</td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemoveEntry(i)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="req-actions">
          <button onClick={handleSaveCart}>{editMode ? 'Update Cart' : 'Save Cart'}</button>
          <button
            className="place-order"
            onClick={handlePlaceOrder}
            disabled={editMode}
            title={editMode ? "Can't place order while editing existing cart" : ""}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementManager;
