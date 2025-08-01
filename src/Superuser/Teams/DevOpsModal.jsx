import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import './TeamModals.css';

const DevOpsModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>DevOps Team Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="team-modal-content">
          <div className="team-stats">
            <div className="stat-card">
              <h5>Total DevOps Engineers</h5>
              <p>10</p>
            </div>
            <div className="stat-card">
              <h5>Active Pipelines</h5>
              <p>15</p>
            </div>
            <div className="stat-card">
              <h5>Deployment Success Rate</h5>
              <p>98%</p>
            </div>
          </div>
          
          <div className="team-table-section">
            <h5>Team Members</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Expertise</th>
                  <th>Projects</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mike Johnson</td>
                  <td>Senior DevOps Engineer</td>
                  <td>AWS, Kubernetes</td>
                  <td>Infrastructure, CI/CD</td>
                  <td>Active</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </Table>
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

export default DevOpsModal; 