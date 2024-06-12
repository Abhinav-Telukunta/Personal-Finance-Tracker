import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewStyles.css';
import Pagination from '../Pagination';

const ViewExpensesByCategory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/viewExpensesByCategory');
      if(response.data.length===0) setError('No transactions present in system');
      else setError('');
      setTransactions(response.data.content);
      setColumns(response.data.columns);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error fetching transactions');
    }
  };

  return (
          <div>
            {error && <p style={{color:'red'}}>{error}</p>}
            {transactions.length > 0 ? (
              <Pagination data={transactions} columns={columns}/>
            ): ''}
          </div>
  )
};

export default ViewExpensesByCategory;
