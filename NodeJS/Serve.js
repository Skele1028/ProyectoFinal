var express = require('express')
var cors = require('cors')
var mongo = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"


var app = express()
app.use(cors())

app.get('/:salon/:tag', (req, res) => {
    console.log('--------------------REGISTRO NUEVO--------------------')

    var salon = req.params.salon
    var tag = req.params.tag

    console.log('Salon Consultado: ' + salon)
    console.log('Estudiante: ' + tag)

    mongo.connect(url, function (err, db) {
        if (err) {
            res.send(300)
            throw err
        }
        var dbo = db.db("dbuniversidad")
        var query = { carnet: tag }
        dbo.collection("estudiantes").find(query).toArray(function (err, result) {
            if (err) {
                res.send(300)
                throw err
            }

            console.log('Estudiante registrado: ' + result[0]._id)

            var date = new Date();
            var haveClass = false;

            var i = 0
            while (result[0].clases[i]) {
                console.log(result[0].clases[i].nombre);

                if (result[0].clases[i].salon == salon) {
                    haveClass = true;
                    break;
                }
                i++
            }

            var estado = "Salon Erroneo"

            if (haveClass) {
                var tiempo = (date.getHours() * 100) + date.getMinutes()

                console.log('Hora de clase: ' + result[0].clases[i].horainicio)
                console.log('Hora de registro: ' + tiempo)

                if (result[0].clases[i].horainicio < tiempo && tiempo < result[0].clases[i].horafinal) {
                    if ((result[0].clases[i].horainicio + 15) > tiempo) {
                        estado = 'Registro Listo'
                    } else {
                        estado = 'Llegas Tarde'
                    }
                } else {
                    estado = 'Fuera De Tiempo'
                }
            }

            console.log('Estado del estudiante: ' + estado)

            res.send(result[0].nombre + ' ' + result[0].apellido + '-' + estado)
            db.close()
        })
    })
})

app.get('/:algo', (req, res) => {
    console.log(req.params.algo)
    res.sendFile(__dirname + '/static/index.html')
})

app.get('/profesores/:profesor', (req, res) => {
    const objetourl = url.parse(pedido.url)
    let camino = 'static' + objetourl.pathname
    if (camino == 'static/')
        camino = 'static/index.html'
    fs.stat(camino, error => {
        if (!error) {
            fs.readFile(camino, (error, contenido) => {
                if (error) {
                    respuesta.writeHead(500, { 'Content-Type': 'text/plain' })
                    respuesta.write('Error interno')
                    respuesta.end()
                } else {
                    respuesta.writeHead(200, { 'Content-Type': 'text/html' })
                    respuesta.write(contenido)
                    respuesta.end()
                }
            })
        } else {
            respuesta.writeHead(404, { 'Content-Type': 'text/html' })
            respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>')
            respuesta.end()
        }
    })
})

app.listen(80, () => {
    console.log('Servidor web iniciado')
})