import React, { useState } from 'react';
import axios from 'axios';
import '../CommonStyles.css';
import Snackbar from '@mui/material/Snackbar';

const UpdateUser = () => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://127.0.0.1:5000/updateUser', {
        firstname,
        lastname,
        email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setError('');
        setOpen(true);
      } else {
        setError(response.data.message);
      }
      setEmail('')
      setFirstName('')
      setLastName('')
    } catch (err) {
      console.error(err)
      setError('An error occurred while updating the user.');
    }
  };

  return (
    <div className="container">
      <h2>Update User</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {open && (<Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      message="User updated successfully"
      onClose={handleClose}
      autoHideDuration={3000}
      />)}
    </div>
  );
};

export default UpdateUser;
