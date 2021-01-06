const mysql = require('mysql')
const db = require('../mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pwdValidator = require('password-validator')

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

exports.signup = (req, res, next) => {
    //RECUPERATION DES VALEURS ENVOYER PAR L'UTILISATEUR
    const { email, password, firstname, lastname } = req.body

    if (!pwd.validate(password)) {
        return res.status(400).json({error: "Votre mot de passe est trop simple !"})
    } else if (!nameValid.validate(lastname)) {
        return res.status(400).json({error: "Votre nom doit comprendre entre 3 et 20 caractères !"})
    } else if (!nameValid.validate(firstname)) {
        return res.status(400).json({error: "Votre prénom doit comprendre entre 3 et 20 caractères !"})
    }
     else if (email && pwd.validate(password) && nameValid.validate(firstname) && nameValid.validate(lastname)) {
        bcrypt.hash(password, 10)
            .then(hash => {
                const string = "INSERT INTO users (email, password, lastname, firstname) VALUES (?, ?, ?, ?)";
                const insert = [email, hash, lastname, firstname];
                const sql = mysql.format(string, insert);

                const userSignup = db.query(sql, (error, user) => {
                    if (!error) { res.status(201).json({ message: user})} 
                    else { res.status(400).json({error}) }
                })
            })
            .catch(error => res.status(500).json({error}))
    } else {
        return res.status(500).json({error})
    }
}

exports.login = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({error: "Vous devez remplir les deux champs."})

    const string = "SELECT * FROM users WHERE email = ?"
    const sql = mysql.format(string, [email])

    const userFind = db.query(sql, (error, user) => {

        if (user.length === 0) return res.status(400).json({error : "Identifiant non valide."})

        bcrypt.compare(password, user[0].password)
            .then(valid => {
                if (!valid) return res.status(500).json({error: "Mot de passe invalide !"})
                res.status(200).json({
                    userId: user[0].id,
                    token: jwt.sign(
                        {userId: user[0].id},
                        'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0',
                        {expiresIn: '24h'}
                    )
                })
            })
            .catch(error => res.status(501).json({error}))
    })
}

exports.isLogged = (req, res, next) => {
    const { token } = req.body

    //Check l'utilisateur et récupére son id
    const checkId = () => {
        if (token) {
            const { userId } = jwt.verify(token, 'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0', 
            (err, decoded) => decoded !== undefined ? decoded : err)
            
            return userId
        }
        throw 'error token with post'
    }
    const userId = checkId()

    if (isNaN(userId)) return res.status(400).json({message: "Erreur: votre token n'est pas valide"})

    const string = "SELECT id FROM users WHERE id = ?"
    const sql = mysql.format(string, [userId])

    db.query(sql, (error, user) => {
        if (user.length === 0) return res.status(400).json({error : "Identifiant non valide."})
        if (!error) return res.status(200).json({userId: user[0].id})
    })

}