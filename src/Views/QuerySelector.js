import React, { useState } from 'react';
import './ViewStyles.css';

const QuerySelector = ({ onSelectQuery }) => {
  const [selectedQuery, setSelectedQuery] = useState('');

  const handleChange = (event) => {
    const query = event.target.value;
    setSelectedQuery(query);
    onSelectQuery(query);
  };

  return (
    <div className='query-selector-container'>
      <h2>Select a Query</h2>
      <select className='query-selector' value={selectedQuery} onChange={handleChange}>
        <option value="">Select a query...</option>
        <optgroup label="Users">
          <option value="viewAllUsers">View All Users</option>
          <option value="viewUsersByAccount">View All Users of a particular account</option>
        </optgroup>
        <optgroup label="Accounts">
          <option value="viewAllAccounts">View All Accounts</option>
          <option value="viewAccountsByUser">View All Accounts of a particular user</option>
        </optgroup>
        <optgroup label="Transactions">
          <option value="viewTransactionsByAccount">View All Transactions of a particular user account</option>
          <option value="viewExpensesByMonth">View Expenses of user for a particular month</option>
          <option value="viewExpensesByCategory">View total expenses category wise</option>
        </optgroup>
      </select>
    </div>
  );
};

export default QuerySelector;
