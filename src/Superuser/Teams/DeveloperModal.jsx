import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import './TeamModals.css';

const API_URL = 'http://192.168.1.14:9000/user/getUsersByRoleType';

const DeveloperModal = ({ show, handleClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(API_URL, {
            params: { name: 'DEVELOPER' },
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Edg/136.0.0.0',
            },
            withCredentials: false,
          });

          console.log('API URL:', `${API_URL}?name=DEVELOPER`);
          console.log('Response Status:', response.status);
          console.log('Response Data:', response.data);

          const data = Array.isArray(response.data) ? response.data : response.data.users || [];
          if (data.length === 0) {
            console.warn('No users returned from API');
          }
          setUsers(data);
          setError(null);
        } catch (err) {
          console.error('Axios Error:', err);
          let errorMessage = 'Failed to fetch users';
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
        <Modal.Title>Developer Team Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="team-modal-content">
          <div className="team-stats">
            <div className="stat-card">
              <h5>Total Developers</h5>
              <p>{users.length}</p>
            </div>
            <div className="stat-card">
              <h5>Active Projects</h5>
              <p>8</p>
            </div>
            <div className="stat-card">
              <h5>Technologies</h5>
              <p>12</p>
            </div>
          </div>

          <div className="team-table-section">
            <h5>Team Members</h5>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
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

export default DeveloperModal;