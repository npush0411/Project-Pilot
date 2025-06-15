import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import './InstructorDashboard.css';
import Card from './Card';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const InstructorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to update approval status on backend
  const updateProjectStatus = async (projectID, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/${projectID}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ approved :isApproved }),
      });

      if (!response.ok) {
        
        throw new Error('Failed to update approval status');
      }

      // Update the project list in state
      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.ID === projectID ? { ...proj, isApproved } : proj
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const onApprove = (project) => {
    updateProjectStatus(project.ID, true);
  };

  const onDeny = (project) => {
    updateProjectStatus(project.ID, false);
  };

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

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Instructor Dashboard" />
        <div className="dashboard-body">
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            projects
            .filter((project) => project.isApproved !== true)
            .map((project, index) => (
              <Card
                key={project.ID || index}
                title={project.title}
                projectID={project.ID}
                description={project.description}
                components={project.components}
                team={project.team.teamID}
                guideID={project.projectGuide?.userID || 'N/A'}
                guideName={project.projectGuide?.firstName +' ' + project.projectGuide.lastName || 'Unknown'}
                createdAt={project.createdAt}
                onApprove={() => onApprove(project)}
                onDeny={() => onDeny(project)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
