import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewStyles.css';
import Pagination from '../Pagination';

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/viewAllUsers');
      if(response.data.length===0) setError('No users present in system');
      else setError('');
      setUsers(response.data.content);
      setColumns(response.data.columns);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users');
    }
  };

  return (
          <div>
            {error && <p style={{color:'red'}}>{error}</p>}
            {users.length > 0 ? (
              <Pagination data={users} columns={columns}/>
            ): ''}
          </div>
  )
};

export default ViewAllUsers;
