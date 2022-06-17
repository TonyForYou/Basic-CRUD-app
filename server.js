const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'movie-club'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('movies').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addMovie', (request, response) => {
    db.collection('movies').insertOne({movieName: request.body.movieNameS,
    foodName: request.body.foodNameS.capitalize(), hostName: request.body.hostNameS.capitalize(),date: request.body.date})
    .then(result => {
        console.log('Movie added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


app.delete('/deleteMovie', (request, response) => {
    db.collection('movies').deleteOne({movieName: request.body.movieNameS})
    .then(result => {
        console.log('Movie Deleted')
        response.json('Movie Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})