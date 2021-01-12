const mysql = require('mysql')
const db = require('../mysql')
const fn = require('../middleware/function')
var moment = require('moment');
const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');


// Ajouter un post
exports.post = (req, res, next) => {
    //Réception des informations
    const {post} = req.body
    const token = req.headers.authorization.split(' ')[1]
    const userId = fn.userId(token)

    //Si check() ne retourne pas de chiffre, le token n'est pas valide
    if (isNaN(userId)) return res.status(400).json({message: "Erreur: votre token n'est pas valide"})

    // Préparation de la requete suivant les cas reçus
    const sql = () => {
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

// Charger la page d'actualité
exports.getActus = (req,res,next) => {
    const Actus = []
    const token = req.headers.authorization.split(' ')[1]
    const userId = fn.userId(token)
    const role = fn.userRole(token)

    console.log(role, typeof(role))

    const sql = `SELECT date, post.img, post.text, users.lastname, users.firstname, users.img_profil, post.user, users.role, post.id
                FROM post
                join users on post.user = users.id
                ORDER BY post.id DESC LIMIT 10`

    db.query(sql, (error, post) => {
        if (error) res.status(400).json({error})

        for (i=0; i<post.length; i++) {
            
            const date = moment(post[i].date).locale("fr").format('Do MMMM YYYY à HH:mm')
            const editable = () => {
                if (post[i].user === userId || role === 1) return true
                return false
            }
            
            Actus.push({
                id: i,
                postId: post[i].id,
                lastname: post[i].lastname,
                firstname: post[i].firstname,
                img_profil: post[i].img_profil ? 'http://localhost:3000/images/profile/' + post [i].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                date: date,
                img: post[i].img ? 'http://localhost:3000/images/post/' + post[i].img : null,
                text: post[i].text,
                editable: editable()
            })
        }

        req.userid = userId;
        req.actus = Actus;
        next()
        })
}

// Récupére les likes et les ajoutes dans le tableau réponse
exports.getActusLike = (req, res, next) => {
    const Actus = req.actus
    var count = 0

    for (i = 0; i<Actus.length; i++) {
        const sql = `SELECT (SELECT COUNT(*) FROM post_like WHERE (id_post = ? AND statut = 1)) AS numberLike,
                    (SELECT COUNT(*) FROM post_like WHERE (id_post = ? AND statut = -1)) AS numberDislike,
                    (SELECT statut FROM post_like WHERE (id_post = ? AND user = ?)) AS likedByUser`

        const reqsql = mysql.format(sql, [Actus[i].postId, Actus[i].postId, Actus[i].postId, req.userid])

        db.query(reqsql, (error, post) => {
            if (error) res.status(400).json({error})
            // Ajoute les likes dans le tableau
            Actus[count] = {...Actus[count],...{like: post[0].numberLike, dislike: post[0].numberDislike, liked: post[0].likedByUser}}

            count += 1
            if (count === Actus.length) {
                req.actus = Actus;
                next();
            }
        })
    }
}

// Récupére les commentaires et les ajoutes dans le tableau réponse
exports.getActusComment = (req, res, next) => {
    const Actus = req.actus
    var count = 0

    for (i = 0; i<Actus.length; i++) {
        const sql = `SELECT users.lastname, users.firstname, users.img_profil, post_comment.date, post_comment.msg, post_comment.user
                    FROM post_comment
                    join users on post_comment.user = users.id
                    WHERE id_post = ?
                    ORDER BY post_comment.id`
        const reqsql = mysql.format(sql, [Actus[i].postId])

        db.query(reqsql, (error, post) => {
            const comment = []

            if (error) res.status(400).json({error})

            for (i=0; i < post.length; i++) {
                const date = moment(post[i].date).locale("fr").calendar(); 

                comment.push({
                    userId: post[i].user,
                    lastname: post[i].lastname,
                    firstname: post[i].firstname,
                    img_profil: post[i].img_profil ? 'http://localhost:3000/images/profile/' + post[i].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                    date: date,
                    msg: post[i].msg
                })
            
                if (i === post.length-1) Actus[count] = {...Actus[count],...{comments: comment}}
            }


            count += 1
            if (count === Actus.length) res.status(200).json(Actus)
        })
    }

    
}

// Ajoute un like sur un post
exports.likePost = (req,res,next) => {
    //Réception des informations
    const {idPost} = req.body
    const token = req.headers.authorization.split(' ')[1]
    const userId = fn.userId(token);

    if (isNaN(userId)) res.status(400).json({message: "Erreur: votre token n'est pas valide"})

    const string = "SELECT * FROM post_like WHERE id_post = ? AND user = ?"
    const sql = mysql.format(string, [idPost, userId])

    db.query(sql, (error, post_like) => {
        if(error) res.status(400).json({message: 'Erreur: erreur dans le post'})

        //s'il n'y a pas de like
        if (post_like.length === 0) {
            const string2 = "INSERT INTO post_like (user, statut, date, id_post) VALUES (?, ?, ?, ?)"
            const sql2 = mysql.format(string2, [userId, 1, date, idPost])

            db.query(sql2, (error) => {
                if (error) res.status(400).json({error})
                res.status(201).json({ statut: 1})
            })

        } else if (post_like.length > 0 && post_like[0].statut === 1) {
            const reqdel = "DELETE FROM post_like WHERE id_post = ? AND user = ?"
            const sqldel = mysql.format(reqdel, [idPost, userId])

            db.query(sqldel, (error) => {
                if (error) res.status(400).json({error})
                res.status(201).json({ statut: 0})
            })
        } else if (post_like.length > 0 && post_like[0].statut === -1) {
            const reqedit = "UPDATE post_like SET statut=1 WHERE id_post = ? AND user = ?"
            const sqldel = mysql.format(reqedit, [idPost, userId])

            db.query(sqldel, (error) => {
                if (error) res.status(400).json({error})
                res.status(201).json({ statut: -1})
            })
        }
    })
}

// Ajoute un dislike sur un post
exports.dislikePost = (req,res,next) => {
    //Réception des informations
    const {idPost} = req.body
    const token = req.headers.authorization.split(' ')[1]
    const userId = fn.userId(token);

    if (isNaN(userId)) res.status(400).json({message: "Erreur: votre token n'est pas valide"})

    const string = "SELECT * FROM post_like WHERE id_post = ? AND user = ?"
    const sql = mysql.format(string, [idPost, userId])

    db.query(sql, (error, post_like) => {
        if(error) res.status(400).json({message: 'Erreur: erreur dans le post'})

        //s'il n'y a pas de like
        if (post_like.length === 0) {
            const string2 = "INSERT INTO post_like (user, statut, date, id_post) VALUES (?, ?, ?, ?)"
            const sql2 = mysql.format(string2, [userId, -1, date, idPost])

            db.query(sql2, (error) => {
                if (error) res.status(400).json({error})
                res.status(201).json({ statut: -1})
            })

        } else if (post_like.length > 0 && post_like[0].statut === -1) {
            const reqdel = "DELETE FROM post_like WHERE id_post = ? AND user = ?"
            const sqldel = mysql.format(reqdel, [idPost, userId])

            db.query(sqldel, (error) => {
                if (error) res.status(400).json({error})
                res.status(201).json({ statut: 0})
            })
        } else if (post_like.length > 0 && post_like[0].statut === 1) {
            const reqedit = "UPDATE post_like SET statut=-1 WHERE id_post = ? AND user = ?"
            const sqldel = mysql.format(reqedit, [idPost, userId])

            db.query(sqldel, (error) => {
                if (error) res.status(400).json({error})
                res.status(201).json({ statut: 1})
            })
        }
    })
}

// Vérifie si le post existe
exports.checkPost = (req, res, next) => {
    const idPost = req.body.idPost

    const reqString = `SELECT COUNT(*) FROM post WHERE id = ?`
    const reqSql = mysql.format(reqString, [idPost])

    db.query(reqSql, (error, post) => {
        if (error) res.status(400).json({error})
        if (post.length !== 1) res.status(401).json({error})
        next();
    })
    
}

// Ajoute un commentaire
exports.addComment = (req, res, next) => {
    const { idPost, msg } = req.body;
    const token = req.headers.authorization.split(' ')[1]
    const userId = fn.userId(token);

    if (isNaN(userId)) res.status(400).json({message: "Erreur: votre token n'est pas valide"})

    const reqString = "INSERT INTO post_comment (`user`, `msg`, `date`, `id_post`) VALUES (?, ?, ?, ?)";
    const sqlReq = mysql.format(reqString, [userId, msg, date, idPost])

    db.query(sqlReq, (error) => {
        if (error) res.status(400).json({error})

        const resString = `SELECT users.lastname, users.firstname, users.img_profil, post_comment.date, post_comment.msg, post_comment.user
                            FROM post_comment
                            join users on post_comment.user = users.id
                            WHERE id_post = ?
                            ORDER BY post_comment.id`
        const resReq = mysql.format(resString, [idPost])

        db.query(resReq, (error, comment) => {
            if (error) res.status(400).json({error})

            const comments = []

            for (i=0; i<comment.length; i++) {
                const date = moment(comment[i].date).locale("fr").calendar(); 

                comments.push({
                    userId: comment[i].user,
                    lastname: comment[i].lastname,
                    firstname: comment[i].firstname,
                    img_profil: comment[i].img_profil ? 'http://localhost:3000/images/profile/' + comment[i].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                    date: date,
                    msg: comment[i].msg
                })
            }

            res.status(201).json({comments: comments})
        })
    })
}