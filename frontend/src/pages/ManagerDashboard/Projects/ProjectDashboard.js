import React, { useEffect, useState } from 'react';
import './ProjectDashboard.css';
import Topbar from '../Topbar';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [isRejecting, setIsRejecting] = useState(false);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/get-all-projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setProjects(data.data);
        } else {
          setError(data.message || 'Failed to fetch projects.');
        }
      } catch (err) {
        console.error(err);
        setError('Network or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setSelectedComponents([]);
    setIsRejecting(false);
    setRemark('');
  };

  const closeModal = () => {
    setSelectedProject(null);
    setSelectedComponents([]);
    setIsRejecting(false);
    setRemark('');
  };

  const handleSelectAll = () => {
    if (!selectedProject) return;
    const allIds = selectedProject.components.map(comp => comp.id || comp._id);
    setSelectedComponents(
      selectedComponents.length === allIds.length ? [] : allIds
    );
  };

  const handleCheckboxChange = (id) => {
    setSelectedComponents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkAccept = () => {
    if (selectedComponents.length === 0) return alert('Select components first.');
    handleBulkAcceptReject(true);
  };

  const handleRejectClick = () => {
    if (selectedComponents.length === 0) return alert('Select components first.');
    setIsRejecting(true);
  };

  const handleConfirmReject = () => {
    if (!remark.trim()) {
      alert('Please provide a remark before rejecting.');
      return;
    }
    handleBulkAcceptReject(false);
  };

  const handleBulkAcceptReject = async (status) => {
    const updatedComponents = selectedProject.components
      .filter(comp => selectedComponents.includes(comp.id || comp._id))
      .map(comp => ({
        id: comp.id || comp._id,
        accepted: status,
      }));

    const payload = {
      updatedComponents,
      remark: !status ? remark.trim() : null,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/update-project-components/${selectedProject.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          status
            ? `Accepted ${selectedComponents.length} component(s).`
            : `Rejected ${selectedComponents.length} component(s) with remark: "${remark}"`
        );

        const newComponents = selectedProject.components.map(comp =>
          selectedComponents.includes(comp.id || comp._id)
            ? { ...comp, accepted: status }
            : comp
        );

        const updatedProject = {
          ...selectedProject,
          components: newComponents,
        };

        setSelectedProject(updatedProject);
        setProjects(prev =>
          prev.map(p => (p.ID === selectedProject.ID ? updatedProject : p))
        );

        setSelectedComponents([]);
        setRemark('');
        setIsRejecting(false);
        closeModal(); // ✅ Close modal after action
      } else {
        alert(data.message || 'Failed to update project components.');
      }
    } catch (err) {
      console.error(err);
      alert('Network or server error.');
    }
  };

  const isProjectApproved = (components = []) =>
    components.length > 0 && components.every(comp => comp.accepted);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'approved', 'not_approved'

  return (
    <div className="project-dashboard">
      <Topbar title='All Projects'/>
      <div className='mst'>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by Project ID, Name, or Team ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="not_approved">Not Approved</option>
        </select>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Team ID</th>
              <th>Approved</th>
              <th>Guide Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {projects
  .filter((proj) => {
    // Filter based on search term
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      proj.ID.toLowerCase().includes(term) ||
      proj.title.toLowerCase().includes(term) ||
      (proj.teamID?.teamID?.toLowerCase() || '').includes(term);

    // Filter based on approval status
    const isApproved = isProjectApproved(proj.components);
    if (filterStatus === 'approved' && !isApproved) return false;
    if (filterStatus === 'not_approved' && isApproved) return false;

    return matchesSearch;
  })
  .map((proj, index) => (

    <tr key={index}>
      <td>{proj.ID}</td>
      <td>{proj.title}</td>
      <td>{proj.teamID?.teamID || 'N/A'}</td>
      <td style={{ fontWeight: 'bold', color: proj.approved ? 'green' : 'red' }}>
        {proj.approved ? 'Yes' : 'No'}
      </td>
      <td>
        {proj.guideID
          ? `${proj.guideID.firstName} ${proj.guideID.lastName}`
          : 'N/A'}
      </td>
      <td>
        <button className="view-btn" onClick={() => handleViewDetails(proj)}>
          View Details
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}

      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Component List - {selectedProject.title}</h3>
            <table className="component-table">
              <thead>
                <tr>
                  <th>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Select All</span>
                      <input
                        type="checkbox"
                        checked={
                          selectedComponents.length === selectedProject.components.length
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th>Component ID</th>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Quantity</th>
                  <th>Accepted</th>
                </tr>
              </thead>

              <tbody>
                {selectedProject.components.map((comp, idx) => {
                  const compId = comp.id || comp._id;
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedComponents.includes(compId)}
                          onChange={() => handleCheckboxChange(compId)}
                        />
                      </td>
                      <td>{comp.id || 'N/A'}</td>
                      <td>{comp.name}</td>
                      <td>{comp.purpose}</td>
                      <td>{comp.quantity}</td>
                      <td>
                        <span style={{ color: comp.accepted ? 'green' : 'red', fontWeight: 'bold' }}>
                          {comp.accepted ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="modal-actions">
              <button className="accept-btn" onClick={handleBulkAccept}>
                Accept Selected
              </button>
              <button className="reject-btn" onClick={handleRejectClick}>
                Reject Selected
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>

            {isRejecting && (
              <div className="remark-section">
                <textarea
                  placeholder="Enter rejection remark..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
                <button className="confirm-reject-btn" onClick={handleConfirmReject}>
                  Confirm Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
