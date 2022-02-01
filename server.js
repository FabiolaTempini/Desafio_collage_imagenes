const express = require('express')
const app = express()
const expressFileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const fs = require('fs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressFileUpload({
    limits: { FileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo supera el límite permitido'
})
)

app.get('/', (_, res) => {
    res.sendFile(__dirname + '/public/formulario.html')
})

app.post('/imagen', (req, res) => {
    const { target_file } = req.files
    const { posicion } = req.body

    target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (_) => {
        res.redirect('/collage')
    })
})

app.get('/collage', (_, res) => {
    res.sendFile(__dirname + '/public/collage.html')
})

app.get('/deleteImg/:nombre', (req, res) => {
    const { nombre } = req.params
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        if (err) throw err
        //res.send(`Imagen ${nombre} fue eliminada con éxito`)
        res.redirect('/collage')
    })

})

app.listen(3000, () => console.log(`SERVER ON`))

