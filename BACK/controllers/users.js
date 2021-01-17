const mysql = require('mysql')
const db = require('../mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pwdValidator = require('password-validator')
const fn = require('../middleware/function')

// Exigence du mot de passe
let pwd = new pwdValidator();
pwd
.is().min(8) // minimum 8 caractères
.is().max(25) // maximum 25 caractères
.has().uppercase() // une majuscule
.has().lowercase() // une minuscule
.has().not().spaces() // pas d'espaces
.has().digits() // un chiffre

let nameValid = new pwdValidator();
nameValid
    .is().min(3)
    .is().max(20)
    .has().not().digits()

exports.signup = async (req, res) => {
    //RECUPERATION DES VALEURS ENVOYER PAR L'UTILISATEUR
    const { email, password, firstname, lastname } = req.body
    const userSQL = mysql.format(`SELECT email FROM users WHERE email = ?`, [email])

    try {
        if (!email || !password || !firstname || !lastname) throw "Vous avez oublié des champs !"
        if (!pwd.validate(password)) throw 'Votre mot de passe est trop simple !'
        if (!nameValid.validate(lastname)) throw 'Votre nom doit comprendre entre 3 et 20 caractères !'
        if (!nameValid.validate(firstname)) throw 'Votre prénom doit comprendre entre 3 et 20 caractères !'

        const userExist = await db.query(userSQL)
        if (userExist[0].length > 0) throw 'user exist'
        
        bcrypt.hash(password, 10)
            .then(hash => {
                const sql = mysql.format(`INSERT INTO users (email, password, lastname, firstname) VALUES (?, ?, ?, ?)`, [email, hash, lastname, firstname]);
                db.query(sql)
                return res.status(201).json({ message: 'ok'})
            })
            .catch(error => res.status(500).json({error}))
    } catch (err) {
        res.status(500).json({err})
    }
}

exports.login = async (req, res) => {
    const { email, password, remember } = req.body
    const sql = mysql.format(`SELECT id, password, img_profil, role FROM users WHERE email = ?`, [email])

    try {
        if (!email || !password) throw 'Vous devez remplir les deux champs.'
        const user = await db.query(sql);
        if (user[0].length === 0) throw 'user not valid'

        bcrypt.compare(password, user[0][0].password)
            .then(valid => {
                if (!valid) throw 'invalid password'
                res.status(200).json({
                    userId: user[0][0].id,
                    img_profil: user[0][0].img_profil ? 'http://localhost:3000/images/profile/' + user[0][0].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                    role: user[0][0].role,
                    token: jwt.sign(
                        {userId: user[0][0].id,
                        role: user[0][0].role},
                        'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0',
                        {expiresIn: (remember === true ? '24h' : 30)}
                    )
                })
            })
            .catch(error => res.status(500).json({error}))
    } catch (err) {
        res.status(500).json({err})
    }
}


exports.isLogged = async (req, res, next) => {
    const { userId } = req.token
    const sql = mysql.format(`SELECT id, img_profil, role FROM users WHERE id = ?`, [userId])

    try {
        const user = await db.query(sql)
        if (user[0].length === 0) throw 'user not valid'

        return res.status(200).json({
            userId: user[0][0].id,
            img_profil: user[0][0].img_profil ? 'http://localhost:3000/images/profile/' + user[0][0].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
            role: user[0][0].role
        })
    } catch (err) {
        res.status(500).json({err})
    }
}