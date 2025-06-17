import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Dashboard.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 3; // Customize how many cards per page

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/projects-me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <>
          {currentProjects.map((project, index) => (
            <Card
              key={project.ID || index}
              title={project.title}
              projectID={project.ID}
              description={project.description}
              components={project.components || []}
              team={project?.team?.teamID || 'N/A'}
              guideID={project?.projectGuide?.userID || 'N/A'}
              guideName={
                project?.projectGuide?.firstName && project?.projectGuide?.lastName
                  ? `${project.projectGuide.firstName} ${project.projectGuide.lastName}`
                  : 'Unknown'
              }
              createdAt={project.createdAt}
              status={project.status ?? 0}
            />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={handlePrev} disabled={currentPage === 1}>{'<'}</button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>{'>'}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
