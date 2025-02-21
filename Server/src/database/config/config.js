import { env } from "../../../initialize.js"
const ENV_CONFIG = {
  "username": env.MYSQL_USERNAME,
  "password": env.MYSQL_PASSWORD,
  "database": env.MYSQL_DATABASE_NAME,
  "host": env.MYSQL_HOST,
  "port": env.MYSQL_PORT,
  "dialect": "mysql"
}
export default {
  "development": ENV_CONFIG,
  "test": ENV_CONFIG,
  "production": ENV_CONFIG
}
