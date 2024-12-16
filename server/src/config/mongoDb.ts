import { Collection, Db, MongoClient } from 'mongodb'
import envSetting from './envSetting'
import { BoardType } from '~/types/Boards'

const uri = `mongodb+srv://${envSetting.DB_USERNAME}:${envSetting.DB_PASSWORD}@phong-phan-trello.dqr6pri.mongodb.net/?retryWrites=true&w=majority&appName=phong-phan-trello`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envSetting.DB_NAME)
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

  get board(): Collection<BoardType> {
    return this.db.collection(envSetting.DB_BOARD_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()

export default databaseService
