import { Db, MongoClient } from 'mongodb'
import { ENV_SETTING } from './envSetting'

const uri = `mongodb+srv://${ENV_SETTING.DB_USENAME}:${ENV_SETTING.DB_PASSWORD}@phong-phan-trello.dqr6pri.mongodb.net/?retryWrites=true&w=majority&appName=phong-phan-trello`

class DatabaseService {
  private client: MongoClient
  private db: Db
  private static instance: DatabaseService | null = null

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(ENV_SETTING.DB_NAME)
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
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
  public async closeDb(): Promise<void> {
    try {
      await this.client.close()
      console.log('MongoDB connection closed')
    } catch (error) {
      console.error('Error closing MongoDB connection:', error)
      throw error
    }
  }
  public getDb(): Db {
    return this.db
  }
}

const databaseService = new DatabaseService()

export default databaseService
