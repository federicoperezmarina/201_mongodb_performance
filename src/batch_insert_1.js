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
  await batchInsert(dbConnection);

  return 'Creation finished';
}

async function batchInsert(dbConnection){
  var startTime = performance.now()
  const collection = dbConnection.collection('batchInsert');

  for (let i = 0; i < 10000; i++) {
    const insertResult = await collection.insertOne({
        "name":"batchInsert - "+i.toString(),
        "i":i
    });
    //console.log('Inserted documents =>', insertResult);    
  }
  var endTime = performance.now()
  console.log(`Call to batchInsert took ${endTime - startTime} milliseconds`)
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());