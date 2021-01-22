# How to install

First, download and install [Node.js](https://nodejs.org/fr/download/releases/) v.14.15.1

Second, download and install [MySQL Server](https://www.mysql.com/fr/downloads/) v.8.0

now, clone this project on your computer

execute this command in your bash: `git clone  https://github.com/julienlechat/P7.git <your_folder_name>`

# Install & start server

navigate to `<your_folder_name>/BACK` in your bash and execute `npm install`

then to start server, execute `node server.js`

# Import database in MySQL

To import a database, create a new blank database in the MySQL shell to serve as a destination for your data.

`CREATE DATABASE groupomania;`

Then log out of the MySQL shell and type the following on new bash:

`mysql -u [username] -p groupomania < db.sql`

Now change SQL data information to connect your database

edit file `<your_folder_name>/BACK/mysql.js`.

# Start client

now you will start client.

in another terminal and navigate to `<your_folder_name>/FRONT`

execute `ng serve` to start


Navigate to `http://localhost:4200/`.

The app will automatically reload if you change any of the source files.