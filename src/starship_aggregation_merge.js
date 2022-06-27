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
  console.log('Aggregation Merge');
  await starshipAggregationMerge(dbConnection);

  return 'Creation finished';
}

async function starshipAggregationMerge(dbConnection){
  var startTime = performance.now();
  var collection = dbConnection.collection('starshipBatchInsert');
  await collection.aggregate([{'$merge':{into:'starshipAggregationMerge', on: "_id", whenMatched: "replace", whenNotMatched: "insert"}}]);
  var endTime = performance.now()
  console.log(`Call to starshipAggregationMerge took ${endTime - startTime} milliseconds`)
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());