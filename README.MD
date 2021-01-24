# Screenshots

<div align="center">
    <img src="https://github.com/julienlechat/reseau-social-entreprise/blob/main/screenshot/login.PNG?raw=true" height="150px"</img>
    <img height="0" width="8px">
    <img src="https://github.com/julienlechat/reseau-social-entreprise/blob/main/screenshot/actuality-2.PNG?raw=true" height="150px"</img>
    <img height="0" width="8px">
    <img src="https://github.com/julienlechat/reseau-social-entreprise/blob/main/screenshot/settings.PNG?raw=true" height="150px"</img>
</div><br />
<div align="center">
    <img src="https://github.com/julienlechat/reseau-social-entreprise/blob/main/screenshot/actuality-1.PNG?raw=true" height="320px"</img>
    <img height="0" width="8px">
    <img src="https://github.com/julienlechat/reseau-social-entreprise/blob/main/screenshot/profile.PNG?raw=true" height="320px"</img>
</div>


# Require

- [Node.js](https://nodejs.org/fr/download/releases/) v.14.15.1

- [MySQL Server](https://www.mysql.com/fr/downloads/) v.8.0


# Install

Execute

`mkdir <FOLDER_NAME>
cd <FOLDER_NAME>
git clone https://github.com/julienlechat/reseau-social-entreprise.git
cd BACK
npm install`


# Import database

To import a database, create the database using the MySQL Command Line :

`CREATE DATABASE groupomania;`

Once it's done open another shell and execute : 

`mysql -u [username] -p groupomania < <FOLDER_NAME>/db.sql`

Put your SQL data information in this file :

`<FOLDER_NAME>/BACK/mysql.js`


# Run

to run back-end server, execute :

`cd <FOLDER_NAME>/BACK
node server.js`

now you will start front-end server

Open another shell and execute :

`cd <FOLDER_NAME>/FRONT
ng serve`

Go to `http://localhost:4200/`.

The app will automatically reload if you change any of the source files.
