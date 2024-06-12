import React, { useState } from 'react';
import axios from 'axios';
import '../CommonStyles.css';
import Snackbar from '@mui/material/Snackbar';

const UpdateAccount = () => {
  const [email, setEmail] = useState('');
  const [oldaccname, setOldAccName] = useState('')
  const [newaccname, setNewAccName] = useState('')
  const [acctype, setAccType] = useState('')
  const [balance, setBalance] = useState('')
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://127.0.0.1:5000/updateAccount', {
        email,
        oldaccname,
        newaccname,
        acctype,
        balance
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
      setOldAccName('')
      setNewAccName('')
      setAccType('')
      setBalance('')
    } catch (err) {
      console.error(err)
      setError('An error occurred while updating the account.');
    }
  };

  return (
    <div className="container">
      <h2>Update Account</h2>
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
          <label htmlFor="oldaccname">Old Account Name:</label>
          <input
            id="oldaccountname"
            type="text"
            value={oldaccname}
            onChange={(e) => setOldAccName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newaccname">New Account Name:</label>
          <input
            id="newaccountname"
            type="text"
            value={newaccname}
            onChange={(e) => setNewAccName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="acctype">Account Type:</label>
          <input
            id="acctype"
            type="text"
            value={acctype}
            onChange={(e) => setAccType(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="balance">Balance:</label>
          <input
            id="balance"
            type="text"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {open && (<Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      message="Account updated successfully"
      onClose={handleClose}
      autoHideDuration={3000}
      />)}
    </div>
  );
};

export default UpdateAccount;
