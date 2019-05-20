const handleSignin = (req, res, DB, bcrypt) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json('Formulario invalido');
    }
    DB.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            return DB.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('El usuario no existe'))
        } else {
            res.status(400).json('Email o Contraseña incorrectos')
        }
    })
    .catch(err => res.status(400).json('Email o Contraseña incorrectos'))
}

module.exports = {
    handleSignin: handleSignin
}