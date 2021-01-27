# Groupomania social network

This repository is a simple prototype of social network made in Angular

## Screenshots

<div align="center">
    <img src="https://github.com/julienlechat/groupomania-social-network/blob/main/screenshot/login.PNG?raw=true" height="150px"</img>
    <img height="0" width="8px">
    <img src="https://github.com/julienlechat/groupomania-social-network/blob/main/screenshot/actuality-2.PNG?raw=true" height="150px"</img>
    <img height="0" width="8px">
    <img src="https://github.com/julienlechat/groupomania-social-network/blob/main/screenshot/settings.PNG?raw=true" height="150px"</img>
</div><br />
<div align="center">
    <img src="https://github.com/julienlechat/groupomania-social-network/blob/main/screenshot/actuality-1.PNG?raw=true" height="320px"</img>
    <img height="0" width="8px">
    <img src="https://github.com/julienlechat/groupomania-social-network/blob/main/screenshot/profile.PNG?raw=true" height="320px"</img>
</div>


## Requirements

- [Node.js](https://nodejs.org/fr/download/releases/) v.14.15.1

- [MySQL Server](https://www.mysql.com/fr/downloads/) v.8.0


## Install

Execute

```Shell
mkdir <FOLDER_NAME>
cd <FOLDER_NAME>/groupomania-social-network
git clone https://github.com/julienlechat/groupomania-social-network.git
cd BACK
npm install
```


### Import database

To import a database, create a new database using the MySQL Command Line :

```Shell
CREATE DATABASE groupomania;
```

Once it's done open another shell and execute : 

```Shell
mysql -u [username] -p groupomania < <FOLDER_NAME>/db.sql
```

Change SQL data information in this file :

```Shell
reseau-social-entreprise/BACK/mysql.js
```


## Run

to run back-end server, execute :

```Shell
cd groupomania-social-network/BACK
node server.js
```

now you will start front-end server

Open another shell and execute :

```Shell
cd groupomania-social-network/FRONT
ng serve
```

Go to `http://localhost:4200/`.

The app will automatically reload if you change any of the source files.
