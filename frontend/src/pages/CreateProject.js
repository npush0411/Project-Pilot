import React, { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import './css/CreateProject.css';
import { useNavigate } from 'react-router-dom';

 
function CreateProject() {
  const navigate = useNavigate();

  const generateProjectID = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `PRJ${random}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    ID: generateProjectID(),
    description: '',
    components: [],
    team: [],
    projectGuide: ''
  });

  const [error, setError] = useState('');
  const [teamError, setTeamError] = useState('');
  const [componentInput, setComponentInput] = useState('');
  const [teamInput, setTeamInput] = useState('');
  const [showSideForm, setShowSideForm] = useState(false);
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentDescription, setNewComponentDescription] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleComponentChange = (e) => {
    setComponentInput(e.target.value);
  };

  const handleTeamChange = (e) => {
    setTeamInput(e.target.value);
  };

  const handleAddComponent = (e) => {
    if (e.key === 'Enter' && componentInput) {
      e.preventDefault();
      if (componentExists(componentInput)) {
        setFormData((prev) => ({
          ...prev,
          components: [...prev.components, componentInput]
        }));
        setComponentInput('');
      } else {
        setShowSideForm(true);
        setComponentInput('');
      }
    }
  };
  
  const handleAddTeam = (e) => {
    if (e.key === 'Enter' && teamInput) {
      e.preventDefault();
      if (userExists(teamInput)) {
        setFormData((prev) => ({
          ...prev,
          team: [...prev.team, teamInput]
        }));
        setTeamInput('');
        setTeamError('');
      } else {
        setTeamError('User ID not found. Ask user to sign up first.');
      }
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const projectData = {
      ...formData,
      components: formData.components,
      team: formData.team
    };

    const response = await fetch("http://localhost:4000/api/v1/create-project", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    const result = await response.json();

    if (response.ok) {
      navigate('/project-success');
    } else {
      // Pass error message to fail page
      navigate('/project-fail', { state: { message: result.message || 'Project creation failed.' } });
    }
  } catch (err) {
    setError('Something went wrong!');
    navigate('/project-fail', { state: { message: 'Something went wrong!' } });
  }
};

  const componentExists = async (componentCId) => {
  try {
    const res = await fetch("http://localhost:4000/api/v1/get-all-components", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json(); // Wait for parsed JSON
    const existingComponentCIDs = result.data.map(component => component.cID); // Extract cIDs
    console.log("Available Component cIDs:", existingComponentCIDs);

    return existingComponentCIDs.includes(componentCId);
  } catch (error) {
    console.error("Error fetching components:", error);
    return false;
  }
};

 const userExists = async (userId) => {
  try {
    const res = await fetch("http://localhost:4000/api/v1/get-all-users", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json(); // Wait for parsed response
    const registeredUserIDs = result.data.map(user => user.userID); // Extract userIDs
    console.log("Registered User IDs:", registeredUserIDs);

    return registeredUserIDs.includes(userId);
  } catch (error) {
    console.error("Error fetching users:", error);
    return false;
  }
};


  const handleCreateNewComponent = async () => {
    if (newComponentName && newComponentDescription) {
      const response = await fetch("http://localhost:4000/api/v1/components", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newComponentName,
          description: newComponentDescription
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          components: [...prev.components, newComponentName]
        }));
        setShowSideForm(false);
        setNewComponentName('');
        setNewComponentDescription('');
      } else {
        setError('Error creating component');
      }
    }
  };

  return (
    <div className='create-project-container'>
      <header className='create-project-header'>
        <img src={logo} alt='Logo' className='create-project-logo' />
        <h1>Walchand College of Engineering, Sangli</h1>
        <h2>Department Of Electronics Engineering</h2>
        <h3>Project Management Tool</h3>
      </header>

      <form className='create-project-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Project Title:</label>
          <input type='text' name='title' value={formData.title} onChange={handleChange} required />
        </div>

        <div className='form-group'>
          <label>Project ID:</label>
          <input type='text' name='ID' value={formData.ID} readOnly />
          <p className='id-warning'>Note: This project will be recognized by this ID in future.</p>
        </div>

        <div className='form-group full-width'>
          <label>Description:</label>
          <input type='text' name='description' value={formData.description} onChange={handleChange} required />
        </div>

        <div className='form-group full-width'>
          <label>Components (Press Enter after each ID):</label>
          <input
            type='text'
            value={componentInput}
            onChange={handleComponentChange}
            onKeyDown={handleAddComponent}
            placeholder='e.g. COM1...'
          />
          <ul>
            {formData.components.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        </div>

        <div className='form-group full-width'>
          <label>Team Members (Press Enter after each ID):</label>
          <input
            type='text'
            value={teamInput}
            onChange={handleTeamChange}
            onKeyDown={handleAddTeam}
            placeholder='e.g. usr001, usr002'
          />
          <ul>
            {formData.team.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
          {teamError && <p className='input-error'>{teamError}</p>}
        </div>

        <div className='form-group full-width'>
          <label>Project Guide ID:</label>
          <input type='text' name='projectGuide' value={formData.projectGuide} onChange={handleChange} required />
        </div>

        {error && <p className='error-text'>{error}</p>}
        <div className='button-group'>
          <input type='submit' value='Create Project' className='signup-button' />
          <button type='button' className='cancel-button' onClick={() => navigate('/user-dashboard')}>Cancel</button>
        </div>
      </form>
      
      

      {showSideForm && (
        <div className='side-form'>
          <h3>Create New Component</h3>
          <label>Component Name:</label>
          <input
            type='text'
            value={newComponentName}
            onChange={(e) => setNewComponentName(e.target.value)}
            placeholder='Enter component name'
          /><br />
          <label>Description:</label><br />
          <input
            type='text'
            value={newComponentDescription}
            onChange={(e) => setNewComponentDescription(e.target.value)}
            placeholder='Enter component description'
          />
          <button onClick={handleCreateNewComponent}>Create Component</button>
          <button onClick={() => setShowSideForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default CreateProject;
