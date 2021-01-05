const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const db = require('../mysql')

var moment = require('moment')

exports.post = (req, res, next) => {

    //Réception des informations
    const {post} = req.body
    const token = req.headers.authorization.split(' ')[1]

    //Check l'utilisateur et récupére son id
    const check = () => {
        if (token) {
            const { userId } = jwt.verify(token, 'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0', 
            (err, decoded) => decoded !== undefined ? decoded : err)
            
            return userId
        }
        throw 'error token with post'
    }
    //Si check() ne retourne pas de chiffre, le token n'est pas valide
    if (isNaN(check())) return res.status(400).json({message: "Erreur: votre token n'est pas valide"})

    // Préparation de la requete suivant les cas reçus
    const sql = () => {
        const userId = check();
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(date)

        if (!post && req.file) {
            const string = "INSERT INTO post (`user`, `date`, `img`) VALUES (?, ?, ?)";
            return mysql.format(string, [userId, date, req.file.filename])
        } else if (post && !req.file) {
            const string = "INSERT INTO post (`user`, `date`, `text`) VALUES (?, ?, ?)";
            return mysql.format(string, [userId, date, post])
        } else {
            const string = "INSERT INTO post (`user`, `date`, `img`, `text`) VALUES (?, ?, ?, ?)";
            return mysql.format(string, [userId, date, req.file.filename, post])
        }
    }

    // On envoie la requete SQL
    db.query(sql(), (error, resolve) => {
        if (!error) { res.status(201).json({ message: 'ok'})} 
        else { res.status(400).json({error}) }
    })
}

exports.getActus = (req,res,next) => {
    const Actus = [];

    const sql = `SELECT date, post.img, post.text, users.lastname, users.firstname, users.img_profil
                FROM post
                join users on post.user = users.id
                ORDER BY post.id DESC LIMIT 10`

    // On envoie la requete SQL
    db.query(sql, (error, post) => {
        if (!error) {
            for (i=0; i<post.length; i++) {
                const date = moment(post[i].date).locale("fr").format('Do MMMM YYYY à HH:mm')

                if (post[i].img === null && post[i].text !== null) {
                    Actus.push({
                        lastname: post[i].lastname,
                        firstname: post[i].firstname,
                        img_profil: 'http://localhost:4200/assets/images/test.jpg',
                        date: date,
                        img: null,
                        text: post[i].text
                    })
                } else if (post[i].img !== null && post[i].text === null) {
                    Actus.push({
                        lastname: post[i].lastname,
                        firstname: post[i].firstname,
                        img_profil: 'http://localhost:4200/assets/images/test.jpg',
                        date: date,
                        img: 'http://localhost:3000/images/post/' + post[i].img,
                        text: null
                    })
                }else {
                    Actus.push({
                        lastname: post[i].lastname,
                        firstname: post[i].firstname,
                        img_profil: 'http://localhost:4200/assets/images/test.jpg',
                        date: date,
                        img: 'http://localhost:3000/images/post/' + post[i].img,
                        text: post[i].text
                    })
                }
            }
            res.status(200).json(Actus)

        } 
        else { res.status(400).json({error}) }
    })

      //res.status(200).json(Actus)
}