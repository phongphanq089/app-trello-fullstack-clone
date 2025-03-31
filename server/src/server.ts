import express from 'express'
import { ENV_SETTING, isProduction } from './config/envSetting'
import { createServer } from 'http'
import exitHook from 'async-exit-hook'
import { applySecurityMiddlewares } from './config/security'
import databaseService from './config/mongoDb'
import { API_V1 } from './routes/v1'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

const httpServer = createServer(app)

app.use(express.json()) // Middleware để parse body JSON
app.use(express.urlencoded({ extended: true })) // Middleware để parse body từ form

applySecurityMiddlewares({ app, isProduction, ENV_SETTING })

const startDatabase = async () => {
  app.use('/v1', API_V1)
  app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))
  app.use(errorHandler)

  httpServer
    .listen(ENV_SETTING.PORT, () => {
      console.log(`Hello ${ENV_SETTING.DB_USENAME}, I am running at ${ENV_SETTING.PORT}`)
    })
    .on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${ENV_SETTING.PORT} is already in use. Please use another port.`)
      } else {
        console.error(`Error occurred: ${err.message}`)
      }
    })

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
