import { Db, MongoClient } from 'mongodb'
import envSetting from './envSetting'

const uri = `mongodb+srv://${envSetting.dbUsername}:${envSetting.dbPassword}@phong-phan-trello.dqr6pri.mongodb.net/?retryWrites=true&w=majority&appName=phong-phan-trello`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envSetting.dbName)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log('Error', err)
      throw err
    }
  }
  async closeDb() {
    await this.client.close()
  }
}

const databaseService = new DatabaseService()

export default databaseService
