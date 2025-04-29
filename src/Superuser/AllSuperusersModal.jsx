import React from 'react';
import './AllSuperusersModal.css';

const AllSuperusersModal = ({ isOpen, onClose, superUser }) => {
  if (!isOpen || !superUser) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>SuperUser Details</h4>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Company Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{superUser.id}</td>
              <td>{superUser.firstName}</td>
              <td>{superUser.lastName}</td>
              <td>{superUser.companyName}</td>
              <td>{superUser.status}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={onClose} className="btn btn-primary mt-3">Close</button>
      </div>
    </div>
  );
};

export default AllSuperusersModal;
