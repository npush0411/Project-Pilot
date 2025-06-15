import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './CartSummary.css';

const CartSummary = ({ cart, onClose, onConfirm }) => {
  const summaryRef = useRef();
  const hasDownloadedPDF = useRef(false);

  const handleDownloadPDF = async () => {
    const input = summaryRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`Cart_${cart.ID}_Summary.pdf`);
    hasDownloadedPDF.current = true;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={summaryRef}>
        <h2>Cart Summary: {cart.ID}</h2>
        <p><strong>Vendor:</strong> {cart.vendor || 'N/A'}</p>
        <p><strong>Creation Date:</strong> {new Date(cart.crationDate).toLocaleDateString()}</p>

        <table className="details-table">
          <thead>
            <tr>
              <th>Component ID</th>
              <th>Name</th>
              <th>Ordered Quantity</th>
            </tr>
          </thead>
          <tbody>
            {cart.details.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.Name}</td>
                <td>{item.orderedQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-actions">
          <button onClick={handleDownloadPDF}>Get PDF</button>
          <button
            onClick={() => hasDownloadedPDF.current && onConfirm()}
            disabled={!hasDownloadedPDF.current}
          >
            Confirm Order
          </button>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
