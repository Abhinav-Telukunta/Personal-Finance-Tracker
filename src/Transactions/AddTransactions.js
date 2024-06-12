import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';

const AddTransactions = () => {
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = () => setOpen(false);

  const handleFileSubmit = async (event) => {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);

    try{
      const response = await axios.post('http://127.0.0.1:5000/importTransactions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      if(response.data.success){
        setError('')
        setOpen(true);
        setMessage(response.data.message);
      }
      else{
        setError(response.data.message);
      }
    }

    catch(err){
      console.error(err);
      setError('An error occurred while adding transactions');
    }


  };

  return (
    <div style={styles.container}>
      {error && <p>{error}</p>}
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        accept=".csv, .xlsx, .xls"
        onChange={handleFileSubmit}
      />
      <button
        style={styles.button}
        onClick={() => document.getElementById('fileInput').click()}
      >
        Import Transaction Data
      </button>
      {open && (<Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      message={message}
      onClose={handleClose}
      autoHideDuration={3000}
      />)}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default AddTransactions;
