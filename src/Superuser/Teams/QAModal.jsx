import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import './TeamModals.css';

// Use the direct API URL or proxy based on your setup
const API_URL = 'http://192.168.1.14:9000/user/getUsersByRoleType';
// For Vite proxy, use: const API_URL = '/api/user/getUsersByRoleType';

const QAModal = ({ show, handleClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(API_URL, {
            params: { name: 'QA' }, // Changed to QA
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'en-US,en;q=0.9',
              // Removed unnecessary headers to avoid CORS issues
              'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Edg/136.0.0.0',
              // Add Authorization header if required
              // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: false, // Set to true if your API uses session-based auth
          });

          // Log for debugging
          console.log('API URL:', `${API_URL}?name=QA`);
          console.log('Response Status:', response.status);
          console.log('Response Data:', response.data);

          // Handle response data
          const data = Array.isArray(response.data) ? response.data : response.data.users || [];
          if (data.length === 0) {
            console.warn('No QA users returned from API');
          }
          setUsers(data);
          setError(null);
        } catch (err) {
          console.error('Axios Error:', err);
          let errorMessage = 'Failed to fetch QA users';
          if (err.response) {
            errorMessage = `HTTP ${err.response.status}: ${typeof err.response.data === 'string'
                ? err.response.data.slice(0, 100)
                : JSON.stringify(err.response.data).slice(0, 100)
              }...`;
            console.error('Response Headers:', err.response.headers);
          } else if (err.request) {
            errorMessage = 'No response from server. Check for CORS issues, network, or server availability.';
            console.error('Request Details:', {
              url: err.request.responseURL || API_URL,
              method: err.request.method,
              headers: err.request._headers,
            });
          } else {
            errorMessage = err.message;
          }
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Quality Assurance Team Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="team-modal-content">
          <div className="team-stats">
            <div className="stat-card">
              <h5>Total QA Engineers</h5>
              <p>{users.length}</p> {/* Dynamically show count */}
            </div>
            <div className="stat-card">
              <h5>Active Test Suites</h5>
              <p>12</p> {/* Static or replace with API data */}
            </div>
            <div className="stat-card">
              <h5>Test Coverage</h5>
              <p>85%</p> {/* Static or replace with API data */}
            </div>
          </div>

          <div className="team-table-section">
            <h5>Team Members</h5>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : users.length === 0 ? (
              <p>No QA users found.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th> {/* Adjusted to match DeveloperModal */}
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QAModal;