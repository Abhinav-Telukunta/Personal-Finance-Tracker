import React, { useState } from 'react';
import axios from 'axios';
import '../CommonStyles.css';
import Snackbar from '@mui/material/Snackbar';

const RemoveAccount = () => {
  const [email, setEmail] = useState('');
  const [accname, setAccName] = useState('')
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/removeAccount', {
        email,
        accname
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
      setAccName('')
    } catch (err) {
      console.error(err);
      setError('An error occurred while removing the account');
    }
  };

  return (
    <div className="container">
      <h2>Remove Account</h2>
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
        <div className="form-group">
          <label htmlFor="accname">Account Name:</label>
          <input
            id="accname"
            type="text"
            value={accname}
            onChange={(e) => setAccName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {open && (<Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      message="Account removed successfully"
      onClose={handleClose}
      autoHideDuration={3000}
      />)}
    </div>
  );
};

export default RemoveAccount;
