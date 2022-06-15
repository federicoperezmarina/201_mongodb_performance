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
  console.log('Batch insert block 3');
  var startTime = performance.now();
  await starshipBatchInsertBlock(dbConnection);
  var endTime = performance.now()
  console.log(`Call to starshipBatchInsertBlock took ${endTime - startTime} milliseconds`)

  return 'Creation finished';
}

async function starshipBatchInsertBlock(dbConnection){
  var bulk = dbConnection.collection('starshipBatchInsertBlock').initializeUnorderedBulkOp();
  var i=0;
  myDocuments = await dbConnection.collection('starshipBatchInsert').find({}).toArray();
  myDocuments.forEach((document)=>{
    bulk.insert(document);
  });

  return bulk.execute();
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());