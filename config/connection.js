// const dbConnection = {
//     // databasename: 'postgres',
//     // username: 'postgres',
//     // password: 'cublick2018',
//     // host: '/cloudsql/sdss-payment:asia-east1:sdsspayment',

//     databasename: 'postgres',
//     username: 'postgres',
//     password: 'hoangdktd123',
//     host: 'localhost',
// }

// google cloud sql
const dbConnection = {
  host: '/cloudsql/lucasapi-234803:asia-southeast1:lucaspostgresql',
  databasename: 'postgres',
  password: 'lucaspostgresql',
  username: 'postgres',
}


const development = {
    database: dbConnection.databasename,
    username: dbConnection.username,
    password: dbConnection.password,
    host: dbConnection.host,
    dialect: 'postgres',
  };

  const testing = {
    database: dbConnection.databasename,
    username: dbConnection.username,
    password: dbConnection.password,
    host: dbConnection.host,
    dialect: 'postgres',
  };

  const production = {
    database: dbConnection.databasename,
    username: dbConnection.username,
    password: dbConnection.password,
    host: dbConnection.host,
    dialect: 'postgres',
  };
  
  module.exports = {
    development,
    testing,
    production,
  };
  