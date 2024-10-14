const app = require("./app")

const port = 1130

app.listen(port, (err) => {
    if (err){
        console.log(err, "Error!!!")
    }
    else{
        console.log(`Listening on ${port}`)
    }
})