import React, { useState } from 'react';
import axios from 'axios';
import '../CommonStyles.css';
import Snackbar from '@mui/material/Snackbar';

const AddAccount = () => {
  const [email, setEmail] = useState('');
  const [accname, setAccName] = useState('');
  const [acctype, setAccType] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/addAccount', {
        email,
        accname,
        acctype,
        balance
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setError('')
        setOpen(true);
      } else {
        setError(response.data.message);
      }
      setEmail('')
      setAccName('')
      setAccType('')
      setBalance('')
    } catch (err) {
      console.error(err);
      setError('An error occurred while adding the account');
    }
  };

  return (
    <div className="container">
      <h2>Add Account</h2>
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
        <div className="form-group">
          <label htmlFor="acctype">Account Type:</label>
          <input
            id="acctype"
            type="text"
            value={acctype}
            onChange={(e) => setAccType(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="balance">Balance:</label>
          <input
            id="balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {open && (<Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      message="Account added successfully"
      onClose={handleClose}
      autoHideDuration={3000}
      />)}
    </div>
  );
};

export default AddAccount;
