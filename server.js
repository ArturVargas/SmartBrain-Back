
const pgUrl = "elmer.db.elephantsql.com";
const PORT = process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Conexion a BD
const DB = knex({
    client: 'pg',
    connection: {
      host : pgUrl,
      user : 'ymgcslbg',
      password : 'fMRihGBaEaE1Eh3khHcFma6KnE_qsUj0',
      database : 'ymgcslbg'
    }
});
//Query hacia la BD para comprobar la conexion
//Si la tabla users esta vacia debe regresar un []
// DB.select('*').from('users').then( data => {
//     console.log(data);
// })


const app = express();
 app.use(bodyParser.json());
 app.use(cors())

app.get('/', (req, res) => { res.send(database.users) });

app.post('/signin', (req, res) => { signin.handleSignin(req, res, DB, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, DB, bcrypt)})
app.get('/profile/:id', (req ,res) => { profile.handleProfile(req, res, DB)})
app.put('/image', (req, res) => { image.handleImg(req, res, DB)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen( PORT || 3001, () => {
    console.log(`Correindo en puerto ${PORT}`);
});