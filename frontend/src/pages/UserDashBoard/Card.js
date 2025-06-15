import React, { useState } from 'react';
import './Card.css';

const Card = ({
  title,
  projectID,
  description,
  components,
  team,
  guideID,
  guideName,
  createdAt,
}) => {
  const [showComponentTable, setShowComponentTable] = useState(false);

  const toggleComponentTable = (e) => {
    e.preventDefault();
    setShowComponentTable(!showComponentTable);
  };

  return (
    <div className="card">
      <h2>{title}</h2>

      <p><span className="label">Project ID:</span> {projectID}</p>

      <p><span className="label">Description:</span> {description}</p>

      <p>
        <span className="label">Components:</span>{' '}
        {components && components.length > 0 ? (
          <>
            {components.length} component(s) —{' '}
            <a
              className="link-text"
              href="#"
              onClick={toggleComponentTable}
            >
              {showComponentTable ? 'Hide Component Table' : 'View Component Table'}
            </a>
          </>
        ) : (
          'None'
        )}
      </p>

      {showComponentTable && (
        <table className="component-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Purpose</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {components.map((comp) => (
              <tr key={comp.id}>
                <td>{comp.id}</td>
                <td>{comp.name}</td>
                <td>{comp.purpose}</td>
                <td>{comp.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        <span className="label">Team:</span>{' '}
        {team ? team : 'None'}
      </p>

      <p>
        <span className="label">Project Guide:</span>{' '}
        {guideID} - {guideName}
      </p>

      <div className="fter">
        Created: {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  );
};

export default Card;
