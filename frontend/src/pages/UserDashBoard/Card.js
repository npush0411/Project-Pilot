import React from 'react';
import './Card.css';

const Card = ({ title, projectID, description, components, team, guideID, guideName, createdAt }) => {
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
              href="components"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Component Table
            </a>
          </>
        ) : (
          'None'
        )}
      </p>

      <p>
        <span className="label">Team:</span>{' '}
        {team && team.length > 0 ? (
          <>
            {team.length} member(s) —{' '}
            <a
              className="link-text"
              href="members"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Members
            </a>
          </>
        ) : (
          'None'
        )}
      </p>

      <p>
        <span className="label">Project Guide:</span>{' '}
        {guideID} - {guideName}
      </p>

      <div className="fter">
        Created: {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default Card;
