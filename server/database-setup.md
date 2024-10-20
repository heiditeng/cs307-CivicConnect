# getting connected to mongoDB 

Hear are some brief instructions on how to get mongoDB access and connect the db to your project.

## Prerequistes
1. Create a mongoDB account.
2. Send your mongoDB username/email to Aysu, as well as your IP address
3. run ```npm install mongodb``` and ```npm install mongoose``` in server folder

## Set-up
1. Once I (Aysu) recieve your username, I will add you as a user to the cluster and provide you with your credentials.
2. In the `.env` file within the server folder, you will update your mongoDB URI with your credentials. Currently, there should be a username and password placeholder for you to replace.
3. `db.js` contains the code to connect with the database and creates a function to do so, this is then called in `server.js`. When you run ```node server``` you will now be able to connect with the database.
