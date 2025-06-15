import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Dashboard.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log(data);
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
    <div className="dashboard">
      {/* <h2>Live Projects</h2> */}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project, index) => (
<Card
  key={project.ID || index}
  title={project.title}
  projectID={project.ID}
  description={project.description}
  components={project.components}
  team={project.team.teamID || 'N/A'}
  guideID={project.projectGuide.userID || 'N/A'}
  guideName={
    project.projectGuide.userID
      ? `${project.projectGuide.firstName} ${project.projectGuide.lastName}`
      : 'Unknown'
  }
  createdAt={project.createdAt}
/>

        ))
      )}
    </div>
  );
}

export default Dashboard;
