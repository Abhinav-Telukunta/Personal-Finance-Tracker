import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewStyles.css';
import Pagination from '../Pagination';

const ViewAllAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/viewAllAccounts');
      if(response.data.length===0) setError('No accounts present in system');
      else setError('');
      setAccounts(response.data.content);
      setColumns(response.data.columns);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Error fetching accounts');
    }
  };

  return (
          <div>
            {error && <p style={{color:'red'}}>{error}</p>}
            {accounts.length > 0 ? (
              <Pagination data={accounts} columns={columns}/>
            ): ''}
          </div>
  )
};

export default ViewAllAccounts;
