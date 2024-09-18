const { DataSource } = require("typeorm")
// postgres://postgres:RQHg4zcCpx22@ecommerce-db.cy6fsvtblkt9.us-east-1.rds.amazonaws.com:5432/villaizan
const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "postgres",
  password: "RQHg4zcCpx22",
  database: "villaizan",
  host: "ecommerce-db.cy6fsvtblkt9.us-east-1.rds.amazonaws.com",

  entities: [
    "dist/models/*.js",
  ],
  migrations: [
    "dist/migrations/*.js",
  ],
})

module.exports = {
  datasource: AppDataSource,
}