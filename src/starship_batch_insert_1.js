const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');
// or as an es module:
// import { MongoClient } from 'mongodb'

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
  console.log('Batch insert 1');
  await starshipBatchInsert(dbConnection);

  return 'Creation finished';
}

async function starshipBatchInsert(dbConnection){
  var startTime = performance.now()
  const collection = dbConnection.collection('starshipBatchInsert');

  for (let i = 0; i < 10000; i++) {
    const insertResult = await collection.insertOne({
        "name":"X-Wing - "+i.toString(),
        "type":"X-Wing",
        "side":"rebel",
        "power":Math.floor(Math.random() * (500 + 1))
    });
    //console.log('Inserted documents =>', insertResult);    
  }
  var endTime = performance.now()
  console.log(`Call to starshipBatchInsert took ${endTime - startTime} milliseconds`)
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());