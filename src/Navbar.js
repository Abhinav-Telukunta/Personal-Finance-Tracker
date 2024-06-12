import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="home-link">
          <h1>Personal Finance Tracker</h1>
        </Link>
      </div>
      <div className="navbar-right">
        <ul>
          <li className="dropdown">
            <span className="dropbtn">Users</span>
            <div className="dropdown-content">
              <Link to="/add-user">Add User</Link>
              <Link to="/remove-user">Remove User</Link>
              <Link to="/update-user">Update User</Link>
            </div>
          </li>
          <li className="dropdown">
            <span className="dropbtn">Accounts</span>
            <div className="dropdown-content">
              <Link to="/add-account">Add Account</Link>
              <Link to="/remove-account">Remove Account</Link>
              <Link to="/update-account">Update Account</Link>
            </div>
          </li>
          <li className="dropdown">
            <span className="dropbtn">Transactions</span>
            <div className="dropdown-content">
              <Link to="/add-transactions">Add Transactions</Link>
            </div>
          </li>
          <li>
            <Link to="/views">Views</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
