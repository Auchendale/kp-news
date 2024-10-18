const { selectUsers, selectUserByUsername } = require("../models/users.models")

exports.getUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({ users })
    })
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    selectUsers()
        .then((users) => {
            const validUsers = []
            for (const userObj of users){
                validUsers.push(userObj.username)
            }
            return validUsers
        })
        .then((validUsers) => {
            return selectUserByUsername(username, validUsers)
        })
        .then((user) => {
            res.status(200).send({ user })
        })
        .catch(next)
}