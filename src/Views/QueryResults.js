import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewStyles.css';
import ViewUsersByAccount from './ViewUsersByAccount';

const QueryResults = ({ selectedQuery }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedQuery) {
      fetchData(selectedQuery);
    }
  }, [selectedQuery]);

  const fetchData = async (query) => {
    try {
      switch (query) {
        case 'viewAllUsersGivenAccount':
          <ViewUsersByAccount />
          break;
        case 'usersWithExpensesAboveThreshold':
          await axios.get('/api/users/expenses/above-threshold'); // adjust with actual endpoint
          break;
        case 'viewAllAccounts':
          await axios.get('/api/accounts');
          break;
        case 'accountsByUser':
          await axios.get('/api/accounts/by-user'); // adjust with actual endpoint
          break;
        case 'viewAllTransactions':
          await axios.get('/api/transactions');
          break;
        case 'transactionsByCategory':
          await axios.get('/api/transactions/by-category'); // adjust with actual endpoint
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Following error occurred ',err);
    }
  };

  if (!selectedQuery) {
    return <div>Please select a query</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
};

export default QueryResults;
