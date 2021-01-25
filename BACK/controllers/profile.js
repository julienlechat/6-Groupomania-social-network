const mysql = require('mysql')
const db = require('../mysql')
const fs = require('fs')
const bcrypt = require('bcrypt')
var moment = require('moment');
const pwdValidator = require('password-validator')

let pwd = new pwdValidator();
pwd
.is().min(8) // minimum 8 caractères
.is().max(25) // maximum 25 caractères
.has().uppercase() // une majuscule
.has().lowercase() // une minuscule
.has().not().spaces() // pas d'espaces
.has().digits() // un chiffre

exports.getProfileById = async (req, res) => {
    const userTable = []
    const userPost = []
    const userSQL = mysql.format(`SELECT lastname, firstname, img_profil, description, role FROM users WHERE id = ?`, [req.params.id])
    const postSQL = mysql.format(`SELECT post.id, post.date, post.img, post.text,
                                COUNT(CASE WHEN post_like.statut = 1 THEN 1 END) AS numberLike,
                                COUNT(CASE WHEN post_like.statut = -1 THEN 1 END) AS numberDislike,
                                (CASE 
                                    WHEN COUNT(distinct case WHEN post_like.user = ? AND post_like.statut = '-1' THEN 1 ELSE null END) > 0 THEN '-1'
                                    WHEN COUNT(distinct case WHEN post_like.user = ? AND post_like.statut = '1' THEN 1 ELSE null END) > 0 THEN '1'
                                ELSE '0' END) AS likedByUser
                                FROM post
                                LEFT JOIN post_like ON post.id = post_like.id_post
                                WHERE post.user = ?
                                GROUP BY 1 ORDER BY post.id DESC LIMIT 10`,
                                [req.token.userId, req.token.userId, req.params.id])

    const commentSQL = `SELECT users.lastname, users.firstname, users.img_profil, users.role, post_comment.id, post_comment.date, post_comment.msg, post_comment.user
                        FROM post_comment
                        join users on post_comment.user = users.id
                        WHERE id_post = ?
                        ORDER BY post_comment.id`

    try {
        const user = await db.query(userSQL)
        if (!user) throw 'user not found'
        
        const post = await db.query(postSQL)
        if (!post) throw 'error with post request'

        for (i=0; i<post[0].length; i++) {
            const date = moment(post[0][i].date).locale("fr").calendar();

            // On récupére les commentaires
            const comment = []
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
                    role: postComment[0][j].role,
                    img_profil: postComment[0][j].img_profil ? 'http://localhost:3000/images/profile/' + postComment[0][j].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
                    date: date,
                    msg: postComment[0][j].msg
                })
            }

            userPost.push({
                id: i,
                postId: post[0][i].id,
                date: date,
                img: post[0][i].img ? 'http://localhost:3000/images/post/' + post[0][i].img : null,
                text: post[0][i].text,
                like: post[0][i].numberLike,
                dislike: post[0][i].numberDislike,
                liked: post[0][i].likedByUser,
                comments: comment
            })
        }
        userTable.push({
            lastname: user[0][0].lastname,
            firstname: user[0][0].firstname,
            img_profil: user[0][0].img_profil ? 'http://localhost:3000/images/profile/' + user[0][0].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
            description: user[0][0].description,
            role: user[0][0].role,
            editable: false,
            post: userPost
        })

        res.status(200).json(userTable)

    }catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json(err)
    }
}

exports.editProfile = async (req, res) => {
    const { description, password } = req.body

    try {
        if (!description && !password && !req.file) throw "Vous devez remplir les champs !"
        if (description && description.length > 80) throw "Votre description est trop longue !"

        const SQL = () => {
            if (description && !req.file) return mysql.format(`UPDATE users SET description = ? WHERE id = ?`, [description, req.token.userId])
            if (!description && req.file) return mysql.format(`UPDATE users SET img_profil = ? WHERE id = ?`, [req.file.filename, req.token.userId])
            return mysql.format(`UPDATE users SET description = ?, img_profil = ? WHERE id = ?`, [description, req.file.filename, req.token.userId])
        }

        if (req.file) {
            const userSQL = mysql.format(`SELECT img_profil FROM users WHERE id = ?`, [req.token.userId])
            const user = await db.query(userSQL)
            if (user[0].length === 0) throw 'user not found'

            if (user[0][0].img_profil) fs.unlink('images/profile/' + user[0][0].img_profil, (err) => {
                if (err) res.status(500).json({err: 'error while deleting image'})
            })

        }

        if (description || req.file) {
            const update = await db.query(SQL())
            if (!update) throw 'update error'
        }

        if (!password) return res.status(201).json({message: 'ok'})
        if (!pwd.validate(password)) throw 'Votre mot de passe est trop simple !'

        bcrypt.hash(password, 10)
        .then(hash => {
            const sql = mysql.format(`UPDATE users SET password = ? WHERE id = ?`, [hash, req.token.userId]);
            db.query(sql)
            return res.status(201).json({ message: 'ok'})
        })
        .catch(err => res.status(500).json(err))
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const selectSQL = mysql.format(`SELECT img_profil FROM users WHERE id = ?`, [req.token.userId])
        const selectUser = await db.query(selectSQL)
        if (!selectUser) throw `profile didn't exist`

        const delSQL = mysql.format(`DELETE FROM users WHERE id = ?`, [req.token.userId])
        const del = await db.query(delSQL)
        if (!del) throw 'error to delete account'

        if (selectUser[0][0].img_profil) fs.unlink('images/profile/' + selectUser[0][0].img_profil, (err) => {
            if (err) res.status(500).json({err: 'error while deleting image'})
        })

        res.status(200).json({message: 'ok'})
    } catch (err) {
        return res.status(500).json(err)
    }
}