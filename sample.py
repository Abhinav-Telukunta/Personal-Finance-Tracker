import pandas as pd
import random
from datetime import datetime, timedelta

data = {
    'email': [],
    'accname': [],
    'amount': [],
    'category_name':[],
    'transaction_datetime':[]
}

email_list = ['abhi.telukunta@gmail.com','sushreddykotha@gmail.com','hari.parvatham@gmail.com','vaishnav.ramesh@gmail.com','rohit.antony@gmail.com','harshith.mundada@gmail.com']
accounts_list = ['Chase','Wells Fargo','Bank of America','Zolve']
category_list = ['Groceries','Travel','Food','Personal','Utilities']

number_of_rows = 500

start_date = datetime(2023,1,1)
end_date = datetime(2023,12,31)
delta = end_date - start_date

for i in range(number_of_rows):
    email = email_list[random.randint(0,len(email_list)-1)]
    accname = accounts_list[random.randint(0,len(accounts_list)-1)]
    amount = random.randint(1,200)
    category = category_list[random.randint(0,len(category_list)-1)]

    random_days = random.randint(0, delta.days)

    random_date = start_date + timedelta(days=random_days)

    random_seconds = random.randint(0, 86399)
    random_time = timedelta(seconds=random_seconds)
    random_datetime = random_date + random_time
    data['email'].append(email)
    data['accname'].append(accname)
    data['amount'].append(amount)
    data['category_name'].append(category)
    data['transaction_datetime'].append(random_datetime)

df = pd.DataFrame(data)

# Write the DataFrame to an Excel file
df.to_excel('output.xlsx', index=False)
