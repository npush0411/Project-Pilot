import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import logo from '../images/logo.png';
import axios from 'axios';

const ManControls = () => {
    const [controls, setControls] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:4000/api/v1/get-all-controls')
            .then(response => {
                const compArray = response.data?.data || [];
                setControls(compArray);
            })
            .catch(error => {
                console.error('Error fetching controls:', error);
            });
    };

    return (
        <div>
            {/* Navbar */}
            <div className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </div>
                <div className="navbar-center">
                    <h3 className="navbar-title">Access Controls</h3>
                </div>
                <div className="navbar-right"></div>
            </div>

            {/* Controls List */}
            <div className="controls-container">
                {controls.length > 0 ? (
                    <ul>
                        {controls.map((control, index) => (
                            <li key={index}>{control.name}</li> // Adjust field as per your API
                        ))}
                    </ul>
                ) : (
                    <p>No controls found.</p>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ManControls;
