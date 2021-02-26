/**
 * Server configuration module.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import hbs from 'express-hbs'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'

import http from 'http'
import { Server } from 'socket.io'

/**
 * Function represents an Express web server configuration.
 */
const startApplication = async () => {
  const application = express()
  const fullDirName = dirname(fileURLToPath(import.meta.url))

  const baseURL = process.env.BASE_URL || '/'

  application.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ['self', 'secure.gravatar.com'] // Allows user avatar
      }
    }
  })) // Security http headers

  application.use(logger('dev'))

  application.engine('hbs', hbs.express4({
    defaultLayout: join(fullDirName, 'views', 'layouts', 'default'),
    partialsDir: join(fullDirName, 'views', 'partials')
  }))
  application.set('view engine', 'hbs')
  application.set('views', join(fullDirName, 'views'))
  application.use(express.urlencoded({ extended: false }))
  application.use(express.json()) // Body parsing for webhook
  application.use(express.static(join(fullDirName, '..', 'public')))

  // Websocket
  const server = http.createServer(application)
  const io = new Server(server)

  // Called before route
  application.use((req, res, next) => {
    // base url for views
    res.locals.baseURL = baseURL // fixa!

    // add socket io to response object.
    res.io = io

    next()
  })

  application.use('/', router)

  application.use((err, req, res, next) => {
    if (err.status === 403) {
      return res.status(403).sendFile(join(fullDirName, 'views', 'errors', '403.html'))
    }

    if (err.status === 404) {
      return res.status(404).sendFile(join(fullDirName, 'views', 'errors', '404.html'))
    }

    if (err.status === 500) {
      return res.status(500).sendFile(join(fullDirName, 'views', 'errors', '500.html'))
    }
  })

  server.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })
}

startApplication()
