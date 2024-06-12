import React, { useState } from 'react';
import './ViewStyles.css';
import axios from 'axios';

const ViewUsersByAccount = () =>{
    const [accname, setAccName] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://127.0.0.1:5000/viewUsersByAccount', {
            accname
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response && response.data) {
            if(response.data.length==0) setError('No users found for this account');
            else setError('');
            setAccName('');
            setUsers(response.data);
          } else {
            setError('Error fetching users');
          }
        } catch (err) {
          console.error(err);
          setError('Error fetching users');
        }
    };

    return (
        <div>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                    id="accname"
                    type="text"
                    placeholder="Enter account name"
                    value={accname}
                    onChange={(e) => setAccName(e.target.value)}
                    required
                    />
                    <button type="submit" className="search-button">Search</button>
                </div>
            </form>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                ''
            )}
        </div>
    );

};

export default ViewUsersByAccount;