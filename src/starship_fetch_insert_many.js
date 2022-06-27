const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'starwars';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const dbConnection = client.db(dbName);

  //starships
  console.log('Fetch Insert Many');
  await starshipFetchInsertMany(dbConnection);

  return 'Creation finished';
}

async function starshipFetchInsertMany(dbConnection){
  var startTime = performance.now();
  await dbConnection.collection('starshipFetchInsertMany').insertMany(await dbConnection.collection('starshipBatchInsert').find({}).toArray());
  var endTime = performance.now()
  console.log(`Call to starshipFetchInsertMany took ${endTime - startTime} milliseconds`)
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());