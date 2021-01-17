const mysql = require('mysql')
const db = require('../mysql')
var moment = require('moment');

exports.getProfileById = async (req, res) => {
    const userTable = []
    const userPost = []
    const userSQL = mysql.format(`SELECT lastname, firstname, img_profil, description, role FROM users WHERE id = ?`, [req.params.id])
    const postSQL = mysql.format(`SELECT id, date, img, text FROM post WHERE user = ? ORDER BY id DESC LIMIT 10`, [req.params.id])
    const likeSQL = `SELECT (SELECT COUNT(*) FROM post_like WHERE (id_post = ? AND statut = 1)) AS numberLike,
                            (SELECT COUNT(*) FROM post_like WHERE (id_post = ? AND statut = -1)) AS numberDislike,
                            (SELECT statut FROM post_like WHERE (id_post = ? AND user = ?)) AS likedByUser`
    const commentSQL = `SELECT users.lastname, users.firstname, users.img_profil, post_comment.id, post_comment.date, post_comment.msg, post_comment.user
                        FROM post_comment
                        join users on post_comment.user = users.id
                        WHERE id_post = ?
                        ORDER BY post_comment.id`

    try {
        const user = await db.query(userSQL)
        if (user[0].length === 0) throw 'user not found'
        
        const post = await db.query(postSQL)


        for (i=0; i<post[0].length; i++) {
            const date = moment(post[0][i].date).locale("fr").calendar();
            const likeREQ = mysql.format(likeSQL, [post[0][i].id, post[0][i].id, post[0][i].id, req.token.userId])

            const postLike = await db.query(likeREQ)
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
                like: postLike[0][0].numberLike,
                dislike: postLike[0][0].numberDislike,
                liked: postLike[0][0].likedByUser,
                comments: comment
            })
        }
        userTable.push({
            lastname: user[0][0].lastname,
            firstname: user[0][0].firstname,
            img_profil: user[0][0].img_profil ? 'http://localhost:3000/images/profile/' + user[0][0].img_profil : 'http://localhost:3000/images/profile/noprofile.png',
            description: user[0][0].description,
            editable: false,
            post: userPost
        })

        res.status(200).json(userTable)

    }catch(err) { // Récupére une erreur et l'envoie au client
        return res.status(500).json({err})
    }
}