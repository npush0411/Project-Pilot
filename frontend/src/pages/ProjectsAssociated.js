// import React from 'react';
// import './css/projects.css';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// // import { JsonWebToken } from 'jsonwebtoken';

// function verifyAndDecodeTokenFromLocalStorage() {
//   // Get token from localStorage
//   // const jwt = require('jsonwebtoken');
//   const token = localStorage.getItem('jwtToken');
//   if (!token) {
//     console.error('No token found in localStorage');
//     return null;
//   }

//   // Your secret key (must match the key used to sign the JWT)
//   const secretKey = 'your-256-bit-secret';

//   try {
//     // Verify and decode token
//     const decoded = jwt.verify(token, secretKey);
//     console.log('Token is valid:', decoded);
//     return decoded;
//   } catch (err) {
//     console.error('Token verification failed:', err.message);
//     return null;
//   }
// }

// const ProjectsAssociated = () => {
//   const token = localStorage.getItem('token');

//   const data = {
//     _id: "67fbe51fd3a77a317f1fb9c0",
//     title: "Arduino UNO R3",
//     cID: "COM1234",
//     description: "Microcontroller",
//     price: "600 Rs",
//     available: true,
//     createdAt: "2025-04-13T16:22:51.785Z",
//     __v: 0,
//     qnty: 5,
//     loc: "A1"
//   };

//   const {
//     title,
//     cID,
//     description,
//     price,
//     qnty,
//     loc,
//     available,
//     createdAt
//   } = data;

//   const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric'
//   });

//   return (
//     <div className="projects-associated-container">
//       <Header title='Projects Associated'/>
//       <div>
//       </div>
//       {/* <div className="card">
//         <h1>{title}</h1>
//         <p><strong>ID:</strong> {cID}</p>
//         <p><strong>Description:</strong> {description}</p>
//         <p><strong>Price:</strong> {price}</p>

//         <div className="info-grid">
//           <div className="info-box">
//             <h4>Quantity</h4>
//             <p>{qnty}</p>
//           </div>
//           <div className="info-box">
//             <h4>Location</h4>
//             <p>{loc}</p>
//           </div>
//         </div>

//         <div className="footer-row">
//           <div className="badge">{available ? 'Available' : 'Unavailable'}</div>
//           <div className="created-on">Created on: {formattedDate}</div>
//         </div>

//         <a href="#" className="button">View Details</a>
//       </div> */}

//       <Footer/>
//     </div>
//   );
// };

// export default ProjectsAssociated;
