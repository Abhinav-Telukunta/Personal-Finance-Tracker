import React, { useState } from 'react';
import './ViewStyles.css';
import axios from 'axios';
import Pagination from '../Pagination';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#BB335A', '#CC334A'];

const ViewTransactionsByAccount = () =>{
    const [accname, setAccName] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [columns, setColumns] = useState([]);
    const [pieData,setPieData] = useState([]);
    const [viewType,setViewType] = useState('pie');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://127.0.0.1:5000/viewTransactionsByAccount', {
            email,
            accname
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response && response.data) {
            if(response.data.tableData.content.length===0) setError('No transactions found for this account');
            else setError('');
            setAccName('');
            setEmail('');
            setTransactions(response.data.tableData.content);
            setColumns(response.data.tableData.columns);
            setPieData(response.data.chartData);
          } else {
            setError('Error fetching transactions');
          }
        } catch (err) {
          console.error(err);
          setError('Error fetching transactions');
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
                  <input
                    id="accname"
                    type="text"
                    placeholder="Enter account name"
                    value={accname}
                    onChange={(e) => setAccName(e.target.value)}
                    required
                    />
                    <div>
                      <select id="viewType" value={viewType} onChange={(e) => setViewType(e.target.value)}>
                        <option value="pie">Pie Chart</option>
                        <option value="table">Table</option>
                      </select>
                    </div>
                  <button type="submit" className="search-button">Search</button>
                </div>
            </form>
            {transactions.length > 0 ? (
                    viewType=='table'?<Pagination data={transactions} columns={columns}/>
                    : (
                        <PieChart width={400} height={400}>
                          <Pie
                            data={pieData}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                            nameKey="category"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      )
                ) : (
                ''
            )}
        </div>
    );

};

export default ViewTransactionsByAccount;