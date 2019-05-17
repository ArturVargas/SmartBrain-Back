
const pgUrl = "elmer.db.elephantsql.com"

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('knex');

// Conexion a BD
const DB = knex({
    client: 'pg',
    connection: {
      host : pgUrl,
      user : 'you_user',
      password : 'you_pass',
      database : 'you_db'
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

app.get('/', (req, res) =>{
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    DB.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return DB.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('El usuario no existe'))
        } else {
            res.status(400).json('Email o Contraseña incorrectos')
        }
    })
    .catch(err => res.status(400).json('Email o Contraseña incorrectos'))
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
       DB.transaction(trx => {
           trx.insert({
               hash: hash,
               email: email
           })
           .into('login')
           .returning('email')
           .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }).then(user => {
                    res.json(user[0]);
                })
            }).then(trx.commit)
            .catch(trx.rollback)
        }).catch(err => res.status(400).json('Datos invalidos'));
        
});

app.get('/profile/:id', (req ,res) => {
    const { id } = req.params;
    DB.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user[0]);
        }else {
            res.status(404).json('Usuario no Encontrado');
        }
    })
    .catch(err => res.status(400).json('Error al Traer usuario')) 
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    DB('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => {
        res.status(400).json('Ranking no Encontrado');
    })
})

app.listen( 3001, () => {
    console.log('Correindo en puerto 3001');
});