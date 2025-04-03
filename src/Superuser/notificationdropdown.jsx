import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Notifications() {
  return (
    <div className='d-flex align-items-center'>
      <div className='dropdown'>
        <button
          className='position-relative dropdown-toggle btn btn-light text-black'
          type='button'
          id='notificationsDropdown'
          data-bs-toggle='dropdown'
          aria-expanded='false'
          style={{ fontSize: '14px' }}
        >
          Notifications
        </button>
        <span
          className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
          style={{ fontSize: '10px' }}
        >
          99+
        </span>
        <ul className='dropdown-menu dropdown-menu-end mt-3' aria-labelledby='notificationsDropdown'>
          <li>
            <button className='dropdown-item text-center'>MESSAGE 1</button>
          </li>
          <li>
            <button className='dropdown-item text-center'>MESSAGE 2</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Notifications;
