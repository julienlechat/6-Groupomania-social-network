const mysql = require('mysql')
const db = require('../mysql')
const fs = require('fs')
var moment = require('moment');

// Charger la page d'actualité
exports.getActus = async (req,res) => {
    const Actus = []
    const { userId, role } = req.token

    const sql = `SELECT post.date, post.img, post.text, users.lastname, users.firstname, users.img_profil, post.user, users.role, post.id,
                COUNT(CASE WHEN post_like.statut = 1 THEN 1 END) AS numberLike,
                COUNT(CASE WHEN post_like.statut = -1 THEN 1 END) AS numberDislike,
                (CASE 
                    WHEN COUNT(distinct case WHEN post_like.user = ? AND post_like.statut = '-1' THEN 1 ELSE null END) > 0 THEN '-1'
                    WHEN COUNT(distinct case WHEN post_like.user = ? AND post_like.statut = '1' THEN 1 ELSE null END) > 0 THEN '1'
                ELSE '0' END) AS likedByUser
                FROM post
                join users on post.user = users.id
                LEFT JOIN post_like ON post.id = post_like.id_post
                GROUP BY 1 ORDER BY post.id DESC LIMIT 10`
    const sqlREQ =  mysql.format(sql, [userId, userId])

    try { // Essaye d'envoyer la requete SQL
        const post = await db.query(sqlREQ)
        if(!post) throw 'error with actus request'

        // Boucle pour chaque post récupéré
        for (i=0; i<post[0].length; i++) {
            const date = moment(post[0][i].date).locale("fr").format('Do MMMM YYYY à HH:mm')
            const editable = () => {
                if (post[0][i].user === userId || role === 1) return true
                return false
            }
            // On récupére les commentaires
            const comment = []
            const commentSQL = `SELECT users.lastname, users.firstname, users.img_profil, users.role, post_comment.id, post_comment.date, post_comment.msg, post_comment.user
                                FROM post_comment
                                join users on post_comment.user = users.id
                                WHERE id_post = ?
                                ORDER BY post_comment.id LIMIT 10`
            const commentREQ = mysql.format(commentSQL, [post[0][i].id])
            const postComment = await db.query(commentREQ)

            for (j=0; j < postComment[0].length; j++) {
                const date = moment(postComment[0][j].date).locale("fr").calendar();
                comment.push({
                    id: j,
                    comId: postComment[0][j].id,
                    userId: postComment[0][j].user,
                    lastname: postComment[0][j].lastname,
                    firstname: postComment[0][j].firstname,
                    img_profil: postComment[0][j].img_profil ? 'http://localhost:3000/images/profile/' + postComment[0][j].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                    role: postComment[0][j].role,
                    date: date,
                    msg: postComment[0][j].msg
                })
            }

            // On prepare le json retourné avec les réponses
            Actus.push({
                id: i,
                userid: post[0][i].user,
                postId: post[0][i].id,
                lastname: post[0][i].lastname,
                firstname: post[0][i].firstname,
                img_profil: post[0][i].img_profil ? 'http://localhost:3000/images/profile/' + post[0] [i].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                role: post[0][i].role,
                date: date,
                img: post[0][i].img ? 'http://localhost:3000/images/post/' + post[0][i].img : null,
                text: post[0][i].text,
                editable: editable(),
                like: post[0][i].numberLike,
                dislike: post[0][i].numberDislike,
                liked: post[0][i].likedByUser,
                comments: comment
            })
        }

        res.status(200).json(Actus)
        
    } catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json(err)
    }
}

// Ajouter un post
exports.post = async (req, res) => {
    const { post } = req.body
    const { userId } = req.token
    const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    // Préparation de la requete suivant les cas reçus
    const sql = () => {
        if (!post && req.file) return mysql.format(`INSERT INTO post (user, date, img) VALUES (?, ?, ?)`, [userId, date, req.file.filename])
        if (post && !req.file) return mysql.format(`INSERT INTO post (user, date, text) VALUES (?, ?, ?)`, [userId, date, post])
        return mysql.format(`INSERT INTO post (user, date, img, text) VALUES (?, ?, ?, ?)`, [userId, date, req.file.filename, post])
    }

    try { // Essaye d'envoyer la requete SQL
        const insert = await db.query(sql())
        if (!insert) throw 'post insertion error'
        return res.status(201).json({message: 'ok'})
    } catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json(err)
    }
}

// Delete un post
exports.deletePost = async (req, res, next) => {
    const { id } = req.params
    const { userId, role } = req.token
    const reqSQL = mysql.format(`SELECT id, user, img FROM post WHERE id = ?`, [id])
    const delSQL = mysql.format(`DELETE FROM post WHERE id = ?`, [id])

    try { // Essaye d'envoyer la requete SQL
        const postExist = await db.query(reqSQL)
        if (!postExist) throw 'post not found'
        if (postExist[0][0].user === userId || role === 1) await db.query(delSQL)
        if (postExist[0][0].img) fs.unlink('images/post/' + postExist[0][0].img, (err) => {
            if (err) res.status(500).json({err: 'error while deleting image'})
        })
        
        return res.status(200).json({message: 'ok'})
    } catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json(err)
    }
}

// Delete un post
exports.deleteCom = async (req, res) => {
    const { id } = req.params
    const { userId, role } = req.token
    const reqSQL = mysql.format(`SELECT id, user FROM post_comment WHERE id = ?`, [id])
    const delSQL = mysql.format(`DELETE FROM post_comment WHERE id = ?`, [id])

    try { // Essaye d'envoyer la requete SQL
        const commentExist = await db.query(reqSQL)
        if (!commentExist) throw 'comment not found'
        if (commentExist[0][0].user === userId || role === 1) await db.query(delSQL)
        return res.status(200).json({message: 'ok'})
    } catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json(err)
    }
}

// Ajoute un like sur un post
exports.likePost = async (req, res) => {
    //Réception des informations
    const { idPost } = req.body
    const { userId } = req.token
    const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    const reqSQL = mysql.format(`SELECT * FROM post_like WHERE id_post = ? AND user = ?`, [idPost, userId])
    const insertSQL = mysql.format(`INSERT INTO post_like (user, statut, date, id_post) VALUES (?, ?, ?, ?)`, [userId, 1, date, idPost])
    const delSQL = mysql.format(`DELETE FROM post_like WHERE id_post = ? AND user = ?`, [idPost, userId])
    const updateSQL = mysql.format(`UPDATE post_like SET statut=1 WHERE id_post = ? AND user = ?`, [idPost, userId])

    try { // Essaye d'envoyer la requete SQL
        const postLike = await db.query(reqSQL)
        if (!postLike) throw 'error with like request'

        if (postLike[0].length === 0) {
            const update = await db.query(insertSQL)
            if (!update) throw 'insertion like error'
            return res.status(201).json({statut: 1})
        } else if (postLike[0][0].statut === 1) {
            const update = await db.query(delSQL)
            if (!update) throw 'insertion like error'
            return res.status(200).json({statut: 0})
        } else if (postLike[0][0].statut === -1) {
            const update = await db.query(updateSQL)
            if (!update) throw 'insertion like error'
            return res.status(200).json({statut: -1})
        } else {
            throw 'error set like'
        }
    } catch(err) { // Récupére une erreur et l'envoie au client
    return res.status(500).json(err)
    }
}

// Ajoute un dislike sur un post
exports.dislikePost = async (req, res) => {
    //Réception des informations
    const { idPost } = req.body
    const { userId } = req.token
    const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    const reqSQL = mysql.format(`SELECT * FROM post_like WHERE id_post = ? AND user = ?`, [idPost, userId])
    const insertSQL = mysql.format(`INSERT INTO post_like (user, statut, date, id_post) VALUES (?, ?, ?, ?)`, [userId, -1, date, idPost])
    const delSQL = mysql.format(`DELETE FROM post_like WHERE id_post = ? AND user = ?`, [idPost, userId])
    const updateSQL = mysql.format(`UPDATE post_like SET statut=-1 WHERE id_post = ? AND user = ?`, [idPost, userId])

    try { // Essaye d'envoyer la requete SQL
        const postLike = await db.query(reqSQL)
        if (!postLike) throw 'error with like request'

        if (postLike[0].length === 0) {
            const update = await db.query(insertSQL)
            if (!update) throw 'insertion like error'
            return res.status(201).json({statut: -1})
        } else if (postLike[0][0].statut === -1) {
            const update = await db.query(delSQL)
            if (!update) throw 'insertion like error'
            return res.status(200).json({statut: 0})
        } else if (postLike[0][0].statut === 1) {
            const update = await db.query(updateSQL)
            if (!update) throw 'insertion like error'
            return res.status(200).json({statut: 1})
        } else {
            throw 'error set like'
        }
    } catch(err) { // Récupére une erreur et l'envoie au client
    return res.status(500).json(err)
    }
}

// Vérifie si le post existe
exports.checkPost = async (req, res, next) => {
    const { idPost } = req.body
    const reqSQL = mysql.format(`SELECT COUNT(*) FROM post WHERE id = ?`, [idPost])

    try { // Essaye d'envoyer la requete SQL
        const check = await db.query(reqSQL)
        if (!check) throw 'error checking'
        next();

    } catch(err) { // Récupére une erreur et l'envoie au client
    return res.status(500).json(err)
    }
}

// Ajoute un commentaire
exports.addComment = async (req, res) => {
    const { idPost, msg } = req.body;
    const { userId } = req.token
    const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    const insertREQ = mysql.format(`INSERT INTO post_comment (user, msg, date, id_post) VALUES (?, ?, ?, ?)`, [userId, msg, date, idPost])
    const selectSQL = `SELECT users.lastname, users.firstname, users.img_profil, users.role, post_comment.id, post_comment.date, post_comment.msg, post_comment.user
                            FROM post_comment
                            join users on post_comment.user = users.id
                            WHERE id_post = ?
                            ORDER BY post_comment.id`
    const selectREQ = mysql.format(selectSQL, [idPost])

    try { // Essaye d'envoyer la requete SQL
        const insert = await db.query(insertREQ)
        if (!insert) throw 'error to insert your comment'

        const comments = []
        const comment = await db.query(selectREQ)
        if (!comment) throw 'error post not exist'

        for (i=0; i<comment[0].length; i++) {
            const date = moment(comment[0][i].date).locale("fr").calendar(); 
            comments.push({
                id: i,
                comId: comment[0][i].id,
                userId: comment[0][i].user,
                lastname: comment[0][i].lastname,
                firstname: comment[0][i].firstname,
                img_profil: comment[0][i].img_profil ? 'http://localhost:3000/images/profile/' + comment[0][i].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                role: comment[0][i].role,
                date: date,
                msg: comment[0][i].msg
            })
        }
        res.status(201).json({comments: comments})
    } catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json(err)
    }
}