import * as dotenv from 'dotenv'
dotenv.config();

export default () => ({
  server: {
    port: process.env.PORT
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB
  }
})
