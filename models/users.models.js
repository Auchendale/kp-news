const db = require("../db/connection")

exports.selectUsers = () => {
    return db
        .query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows
        })
}

exports.selectUserByUsername = (username, validUsers) => {
    if(!validUsers.includes(username)){
        return Promise.reject({ status: 404, msg: "User does not exist"})
    }
    return db
        .query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => {
            return rows[0]
        })
}