import express from 'express'
import envSetting, { isProduction } from './config/envSetting'
import { createServer } from 'http'
import exitHook from 'async-exit-hook'
import { applySecurityMiddlewares } from './config/security'
import databaseService from './config/mongoDb'
import { API_V1 } from './routes/v1'
import { defaultErrorHandle } from './middlewares/errors.middlewares'

const app = express()

const httpServer = createServer(app)

app.use(express.json()) // Middleware để parse body JSON
app.use(express.urlencoded({ extended: true })) // Middleware để parse body từ form

applySecurityMiddlewares({ app, isProduction, envSetting })

const startDatabase = async () => {
  if (isProduction) {
    httpServer.listen(process.env.PORT, () => {
      console.log(`Hello ${envSetting.dbUsername}, I am running at ${process.env.PORT}`)
    })
  } else {
    httpServer
      .listen(envSetting.port, () => {
        console.log(`Hello ${envSetting.dbUsername}, I am running at ${envSetting.port}`)
      })
      .on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${envSetting.port} is already in use. Please use another port.`)
        } else {
          console.error(`Error occurred: ${err.message}`)
        }
      })
  }

  app.use('/v1', API_V1)

  app.use(defaultErrorHandle)

  exitHook(() => {
    console.log('exiting 2')
    databaseService.closeDb()
  })
}

;(async () => {
  try {
    await databaseService.connect()
    console.log('connecting to mongodb database')
    await startDatabase()
    console.log('connected Successfully')
  } catch (error) {
    console.error('Failed to start database')
    process.exit(0)
  }
})()
