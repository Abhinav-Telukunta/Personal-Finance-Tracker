import React, { useState } from 'react';
import QuerySelector from './QuerySelector';
import './ViewStyles.css';
import ViewUsersByAccount from './ViewUsersByAccount';
import ViewAllAccounts from './ViewAllAccounts';
import ViewAccountsByUser from './ViewAccountsByUser';
import ViewTransactionsByAccount from './ViewTransactionsByAccount';
import ViewExpensesByMonth from './ViewExpensesByMonth';
import ViewExpensesByCategory from './ViewExpensesByCategory';
import ViewAllUsers from './ViewAllUsers';

const Views = () => {
  const [selectedQuery, setSelectedQuery] = useState('');

  const renderQueryComponent = (query) => {
    switch (query) {
      case 'viewUsersByAccount':
        return <ViewUsersByAccount />;
      case 'viewAllAccounts':
        return <ViewAllAccounts />;
      case 'viewAllUsers':
        return <ViewAllUsers />;
      case 'viewAccountsByUser':
        return <ViewAccountsByUser />;
      case 'viewTransactionsByAccount':
        return <ViewTransactionsByAccount />;
      case 'viewExpensesByMonth':
        return <ViewExpensesByMonth />;
      case 'viewExpensesByCategory':
        return <ViewExpensesByCategory />;
      default:
        return <div>Please select a query</div>;
    }
  };

  const handleSelectQuery = (query) => {
    setSelectedQuery(query);
  };

  return (
        <div className='view'>
          <QuerySelector onSelectQuery={handleSelectQuery} />
          {renderQueryComponent(selectedQuery)}
        </div>

  );
};

export default Views;
