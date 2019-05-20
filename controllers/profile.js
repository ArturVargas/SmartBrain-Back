const handleProfile = (req, res, DB) => {
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
}

module.exports = {
    handleProfile: handleProfile
}