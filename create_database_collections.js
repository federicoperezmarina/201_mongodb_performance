const { MongoClient } = require('mongodb');
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

  await createStormTroopers(dbConnection);
  await createClones(dbConnection);
  await createBattleDroid(dbConnection);

  return 'main done';
}

async function createStormTroopers(dbConnection){
  const collection = dbConnection.collection('characters');

  for (let i = 0; i < 1000; i++) {
    const insertResult = await collection.insertOne({
        "name":"DAX-"+i.toString(),
        "type":"stormtrooper",
        "side":"empire",
        "strength":Math.floor(Math.random() * (50 + 1))
    });
    //console.log('Inserted documents =>', insertResult);    
  }
}

async function createClones(dbConnection){
  const collection = dbConnection.collection('characters');

  for (let i = 0; i < 1000; i++) {
    const insertResult = await collection.insertOne({
        "name":"KYT-"+i.toString(),
        "type":"clone",
        "side":"empire",
        "strength":Math.floor(Math.random() * (50 + 1))
    });
    //console.log('Inserted documents =>', insertResult);    
  }
}

async function createBattleDroid(dbConnection){
  const collection = dbConnection.collection('characters');

  for (let i = 0; i < 2000; i++) {
    const insertResult = await collection.insertOne({
        "name":"B"+(Math.floor(Math.random() * (2))+1)+"-"+i.toString(),
        "type":"battle droid",
        "side":"empire",
        "strength":Math.floor(Math.random() * (50 + 1))
    });
    //console.log('Inserted documents =>', insertResult);    
  }  
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());