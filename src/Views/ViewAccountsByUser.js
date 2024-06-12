import React, { useState } from 'react';
import './ViewStyles.css';
import axios from 'axios';

const ViewAccountsByUser = () =>{
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [accounts, setAccounts] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://127.0.0.1:5000/viewAccountsByUser', {
            email
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response && response.data) {
            if(response.data.length==0) setError('No accounts found for this user');
            else setError('');
            setEmail('');
            setAccounts(response.data);
          } else {
            setError('Error fetching accounts');
          }
        } catch (err) {
          console.error(err);
          setError('Error fetching accounts');
        }
    };

    return (
        <div>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                    id="email"
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    <button type="submit" className="search-button">Search</button>
                </div>
            </form>
            {accounts.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                        <th>Account Name</th>
                        <th>Account type</th>
                        <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => (
                        <tr key={account.id}>
                            <td>{account.name}</td>
                            <td>{account.type}</td>
                            <td>{account.balance}</td>
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

export default ViewAccountsByUser;