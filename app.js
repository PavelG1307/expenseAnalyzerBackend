require('dotenv').config()
const http = require("http")
const express = require("express")
const apiRouter = require('./routers/api')
const logger = require('morgan')
const errorHandler = require('node-error-handler')

const db = require('./db')
db.query('SELECT 1+1').then(() => { console.log('База данных подключена') }).catch('Ошибка базы данных')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)

app.use(logger('dev'))
app.use(errorHandler({ log: true, debug: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use('/exp', express.static('./static'))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('X-Robots-Tag', 'noindex')
  if (
    JSON.stringify(req.body).indexOf("'") !== -1 ||
    JSON.stringify(req.query).indexOf("'") !== -1) {
    res.json({
      success: false,
      message: 'Иди уроки делай, завтра в школу!'
    })
    return
  }
  next()
})

app.use('/exp/api', apiRouter)

app.use((error, req, res, next) => {
  console.log(error)
  console.log(error.message)
  res.status(400)
  res.json({
    success: false,
    message: req.app.get('env') === 'development' ? error.message : 'Неизвестная ошибка, обратитесь к администратору i@dxlebedev.ru'
  })
})






// emitter.eventBus.on('Updated guard',
//   async function (id, state) {
//     try {
//       const data = JSON.stringify({
//         type: "guard",
//         message: "Success",
//         state: state
//       })

//       WSClients[id].forEach((ws) => {
//         ws.send(data)
//       })
//     } catch (e) {
//       console.log(e)
//     }
//   })

// emitter.eventBus.on('Updated status',
//   async function (id) {
//     try {
//       if (WSClients[user.id]) {
//         const data = JSON.stringify(await deviceControllers.getStatus(id))
//         WSClients[id].forEach((ws) => {
//           ws.send(data)
//         })
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }
// )

server.listen(port, () => console.log(`Сервер запущен на ${port} порту`))
