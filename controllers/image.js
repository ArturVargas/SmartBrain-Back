const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'af94d24d7b6e434e8e9490e74f616ccc'
});

const handleApiCall = (req, res) => {
    app.models.predict
    (Clarifai.FACE_DETECT_MODEL,req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('API no Disponible'))
}

const handleImg = (req, res, DB) => {
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
}

module.exports = {
    handleImg,
    handleApiCall
}