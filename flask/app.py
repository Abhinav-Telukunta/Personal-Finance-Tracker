from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Initialize the SQLite database
def init_db():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                userid INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT,
                lastname TEXT,
                email TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS accounts (
                accountid INTEGER PRIMARY KEY AUTOINCREMENT,
                userid INTEGER,
                accname TEXT,
                acctype TEXT,
                balance REAL,
                FOREIGN KEY (userid) REFERENCES users(userid)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                transactionid INTEGER PRIMARY KEY AUTOINCREMENT,
                accountid INTEGER,
                amount REAL,
                categoryname TEXT,
                transactiondatetime TEXT,
                FOREIGN KEY (accountid) REFERENCES accounts(accountid)
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS categories (
                categoryid INTEGER PRIMARY KEY AUTOINCREMENT,
                categoryname TEXT
            )
        ''')
        conn.commit()


# Call the function to initialize the database
init_db()

@app.route('/addUser', methods=['POST'])
def add_user():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        if user:
            return jsonify({'success': False, 'message': 'User already exists'})
        cursor.execute('INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)', (firstname, lastname, email))
        conn.commit()

    return jsonify({'success': True, 'message': 'User added successfully'})


@app.route('/viewUsers', methods=['GET'])
def view_users():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
        user_list = [{'id': user[0], 'firstname': user[1], 'lastname': user[2], 'email': user[3]} for user in users]
        conn.commit()
        return jsonify({'users': user_list})


@app.route('/removeUser', methods=['POST'])
def remove_user():
    data = request.get_json()
    email = data.get('email')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE email = ?", (email,))
        if cursor.rowcount == 0:
            return jsonify({'success': False, 'message': 'User not found'})

        conn.commit()
        return jsonify({'success': True})

@app.route('/updateUser', methods=['PUT'])
def update_user():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if user:
            cursor.execute("UPDATE users SET firstname = ?, lastname = ? WHERE email = ?", (firstname, lastname, email))
            conn.commit()
            return jsonify({'success': True, 'message': 'User updated successfully.'})
        else:
            conn.commit()
            return jsonify({'success': False, 'message': 'User not found.'})


@app.route('/addAccount', methods=['POST'])
def add_account():
    data = request.get_json()
    email = data.get('email')
    accname = data.get('accname')
    acctype = data.get('acctype')
    balance = data.get('balance')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if user:
            userid = user[0]
            cursor.execute("SELECT accname FROM accounts WHERE userid = ?", (userid,))
            record = cursor.fetchone()
            if record and record[0]==accname:
                return jsonify({'success': False, 'message': 'Account already exists'})
            else:
                cursor.execute('INSERT INTO accounts (userid, accname, acctype, balance) VALUES (?, ?, ?, ?)', (userid,accname,acctype,balance))
                conn.commit()
                return jsonify({'success': True, 'message': 'Account added successfully.'})
        else:
            conn.commit()
            return jsonify({'success': False, 'message': 'There is no user associated with this email. Please add user first.'})


@app.route('/removeAccount', methods=['POST'])
def remove_account():
    data = request.get_json()
    email = data.get('email')
    accname = data.get('accname')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        response=''
        if user:
            userid = user[0]
            cursor.execute("DELETE FROM accounts WHERE userid = ? AND accname = ?",(userid,accname))
            if cursor.rowcount==0:
                response = jsonify({'success': False, 'message': 'Account not found.'})
            else:
                response = jsonify({'success': True, 'message': 'Account removed successfully.'})
        else:
            response = jsonify({'success': False, 'message': 'User not found.'})

        conn.commit()
        return response


@app.route('/updateAccount', methods=['PUT'])
def update_account():
    data = request.get_json()
    email = data.get('email')
    oldaccname = data.get('oldaccname')
    newaccname = data.get('newaccname')
    acctype = data.get('acctype')
    balance = data.get('balance')
    response = ''
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if user:
            userid = user[0]
            cursor.execute("UPDATE accounts SET accname = ?, acctype = ?, balance = ? WHERE userid = ? AND accname = ?", (newaccname,acctype,balance,userid,oldaccname))
            if cursor.rowcount == 0:
                response = jsonify({'success': False, 'message': 'Account not found.'})
            else:
                response = jsonify({'success': True, 'message': 'Account updated successfully.'})
        else:
            response = jsonify({'success': False, 'message': 'User not found.'})

        conn.commit()
        return response



@app.route('/viewAccounts', methods=['GET'])
def view_accounts():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM accounts')
        accounts = cursor.fetchall()
        acc_list = [{'id': acc[0], 'userid': acc[1], 'name': acc[2], 'type': acc[3], 'balance': acc[4]} for acc in accounts]
        conn.commit()
        return jsonify({'accounts': acc_list})


@app.route('/importTransactions', methods=['POST'])
def import_transactions():
    if 'file' not in request.files:
        return jsonify({'success':False, 'message': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success':False, 'message': 'No selected file'})

    if file and (file.filename.endswith('.csv') or file.filename.endswith('.xlsx') or file.filename.endswith('.xls')):
        df=''
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        df['transaction_datetime'] = pd.to_datetime(df['transaction_datetime']).dt.strftime('%Y-%m-%d %H:%M:%S')

        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()

            for index, row in df.iterrows():
                email = row['email']
                account_name = row['accname']
                amount = row['amount']
                transaction_datetime = row['transaction_datetime']
                category = row['category_name']

                cursor.execute('''
                    SELECT a.accountid, a.balance
                    FROM accounts a
                    JOIN users u ON a.userid = u.userid
                    WHERE u.email = ? AND a.accname = ?
                ''', (email, account_name))
                account = cursor.fetchone()

                if account:
                    account_id = account[0]
                    balance = account[1]

                    if balance >= amount:
                        cursor.execute("SELECT * FROM transactions WHERE accountid = ? AND transactiondatetime = ?",(account_id,transaction_datetime))
                        existing_transaction = cursor.fetchone()

                        if not existing_transaction:

                            cursor.execute('''
                                INSERT INTO transactions (accountid, amount, categoryname, transactiondatetime)
                                VALUES (?, ?, ?, ?)
                            ''', (account_id, amount, category, transaction_datetime))

                            # Update the account balance
                            cursor.execute('''
                                UPDATE accounts
                                SET balance = balance - ?
                                WHERE accountid = ?
                            ''', (amount, account_id))

                            # add category
                            cursor.execute("SELECT * FROM categories WHERE categoryname = ?", (category,))

                            category_rec = cursor.fetchone()

                            if not category_rec:
                                cursor.execute("INSERT INTO categories (categoryname) VALUES (?)", (category,))


            conn.commit()
            return jsonify({'success':True, 'message': 'Transactions processed successfully!'})

    return jsonify({'success':False, 'message': 'Invalid file format'})


@app.route('/viewUsersByAccount', methods=['POST'])
def view_users_by_account():
    data = request.get_json()
    accname = data.get('accname')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        users = cursor.execute('''
         SELECT users.firstname, users.lastname, users.email 
         FROM users 
         JOIN accounts ON users.userid = accounts.userid 
         WHERE accounts.accname = ?''',
        (accname,)
        ).fetchall()
        conn.commit()
        return jsonify([{'firstname':row[0],'lastname':row[1],'email':row[2]} for row in users])


@app.route('/viewAllAccounts', methods=['GET'])
def view_all_accounts():

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        results = cursor.execute('''
         SELECT u.email, a.accname, a.acctype, a.balance
         FROM users u
         JOIN accounts a ON u.userid = a.userid ''').fetchall()
        conn.commit()
        content = [[row[i] for i in range(len(row))] for row in results]
        columns = ['Email','Account Name','Account Type','Balance']
        return jsonify({'content':content,'columns':columns})



@app.route('/viewAccountsByUser', methods=['POST'])
def view_accounts_by_user():
    data = request.get_json()
    email = data.get('email')
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        results = cursor.execute('''
         SELECT a.accountid, a.accname, a.acctype, a.balance
         FROM users u
         JOIN accounts a ON u.userid = a.userid
         WHERE u.email = ?
         ''',(email,)).fetchall()
        conn.commit()
        return jsonify([{'id':row[0],'name':row[1], 'type':row[2], 'balance':row[3]} for row in results])


@app.route('/viewTransactionsByAccount', methods=['POST'])
def view_transactions_by_account():
    data = request.get_json()
    accname = data.get('accname')
    email = data.get('email')

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        transactions = cursor.execute('''
         SELECT t.amount, t.categoryname, t.transactiondatetime
         FROM transactions t
         JOIN accounts a ON t.accountid = a.accountid
         JOIN users u ON a.userid = u.userid
         WHERE u.email = ? AND a.accname = ?''',
         (email,accname)
        ).fetchall()
        content = [[row[i] for i in range(len(row))] for row in transactions]
        columns = ['Amount','Category Name','Transaction Date and Time']
        cursor.execute('''
        SELECT t.categoryname, SUM(t.amount) as total_amount
        FROM transactions t
        JOIN accounts a ON t.accountid = a.accountid
        JOIN users u ON a.userid = u.userid
        WHERE u.email = ? AND a.accname = ?
        GROUP BY t.categoryname''', (email, accname))

        category_totals = cursor.fetchall()

        cursor.execute('''
        SELECT SUM(t.amount) as total_expenses
        FROM transactions t
        JOIN accounts a ON t.accountid = a.accountid
        JOIN users u ON a.userid = u.userid
        WHERE u.email = ? AND a.accname = ?''', (email, accname))
        
        total_expenses = cursor.fetchone()[0]

        category_contributions = []
        for category, total_amount in category_totals:
            percentage = (total_amount / total_expenses) * 100
            category_contributions.append({"category": category, "percentage": percentage})

        conn.commit()
        tData = {'content':content,'columns':columns}
        return jsonify({'chartData':category_contributions,'tableData': tData})


@app.route('/viewExpensesByMonth', methods=['POST'])
def view_expenses_by_month():
    data = request.get_json()
    email = data.get('email')
    month = data.get('month')

    year, month = month.split("-")

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        transactions = cursor.execute('''
        SELECT t.categoryname, SUM(t.amount) as total_amount
        FROM transactions t
        JOIN accounts a ON t.accountid = a.accountid
        JOIN users u ON a.userid = u.userid
        WHERE u.email = ? AND strftime('%Y', t.transactiondatetime) = ? AND strftime('%m', t.transactiondatetime) = ?
        GROUP BY t.categoryname''', (email,year,month)).fetchall()

        content = [[row[i] for i in range(len(row))] for row in transactions]
        columns = ['Category Name','Total Amount']

        category_totals = transactions

        cursor.execute('''
        SELECT SUM(t.amount) as total_expenses
        FROM transactions t
        JOIN accounts a ON t.accountid = a.accountid
        JOIN users u ON a.userid = u.userid
        WHERE u.email = ? AND strftime('%Y', t.transactiondatetime) = ? AND 
        strftime('%m', t.transactiondatetime) = ?''', (email, year, month))
        
        total_expenses = cursor.fetchone()[0]

        category_contributions = []
        for category, total_amount in category_totals:
            percentage = (total_amount / total_expenses) * 100
            category_contributions.append({"category": category, "percentage": percentage})

        conn.commit()
        tData = {'content':content,'columns':columns}
        return jsonify({'chartData':category_contributions,'tableData': tData})


@app.route('/viewExpensesByCategory', methods=['GET'])
def view_expenses_by_category():

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        results = cursor.execute('''
        SELECT t.categoryname, SUM(t.amount) as total_amount
        FROM transactions t
        GROUP BY t.categoryname
        ''').fetchall()
        conn.commit()
        content = [[row[i] for i in range(len(row))] for row in results]
        columns = ['Category Name', 'Total Amount']
        return jsonify({'content':content,'columns':columns})


@app.route('/viewAllUsers', methods=['GET'])
def view_all_users():

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        results = cursor.execute('''
         SELECT u.firstname, u.lastname, u.email
         FROM users u''').fetchall()
        conn.commit()
        content = [[row[i] for i in range(len(row))] for row in results]
        columns = ['First Name','Last Name','Email']
        return jsonify({'content':content,'columns':columns})


if __name__ == '__main__':
    app.run(debug=True)



