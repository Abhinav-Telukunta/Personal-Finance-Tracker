import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import AddUser from './Users/AddUser'; 
import RemoveUser from './Users/RemoveUser';
import UpdateUser from './Users/UpdateUser';
import './App.css';
import AddAccount from './Accounts/AddAccount';
import RemoveAccount from './Accounts/RemoveAccount';
import UpdateAccount from './Accounts/UpdateAccount';
import AddTransactions from './Transactions/AddTransactions';
import Views from './Views/Views';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/remove-user" element={<RemoveUser />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/add-account" element={<AddAccount />} />
          <Route path="/remove-account" element={<RemoveAccount />} />
          <Route path="/update-account" element={<UpdateAccount />} />
          <Route path="/add-transactions" element={<AddTransactions />} />
          <Route path="/views" element={<Views />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

function MainContent() {
  return (
    <div>
      <h2>Welcome to the Personal Finance Tracker</h2>
      {/* Add main content for the root path here */}
    </div>
  );
}

export default App;
