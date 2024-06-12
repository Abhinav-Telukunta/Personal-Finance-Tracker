import React, { useState } from 'react';
import axios from 'axios';
import '../CommonStyles.css';
import Snackbar from '@mui/material/Snackbar';

const RemoveUser = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/removeUser', {
        email,
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
    } catch (err) {
      console.error(err);
      setError('An error occurred while removing the user');
    }
  };

  return (
    <div className="container">
      <h2>Remove User</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {open && (<Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      message="User removed successfully"
      onClose={handleClose}
      autoHideDuration={3000}
      />)}
    </div>
  );
};

export default RemoveUser;
