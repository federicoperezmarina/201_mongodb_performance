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

  //troops
  console.log('Creating troops');
  await createStormTroopers(dbConnection);
  await createClones(dbConnection);
  await createBattleDroid(dbConnection);

  //starships
  console.log('Creating starships');
  await createTieFigthers(dbConnection);
  await createXWings(dbConnection);

  return 'Creation finished';
}

async function createXWings(dbConnection){
  const collection = dbConnection.collection('starships');

  for (let i = 0; i < 10000; i++) {
    const insertResult = await collection.insertOne({
        "name":"X-Wing - "+i.toString(),
        "type":"X-Wing",
        "side":"rebel",
        "power":Math.floor(Math.random() * (500 + 1))
    });
    //console.log('Inserted documents =>', insertResult);    
  }
}

async function createTieFigthers(dbConnection){
  const collection = dbConnection.collection('starships');

  for (let i = 0; i < 10000; i++) {
    const insertResult = await collection.insertOne({
        "name":"Tie Fighter - "+i.toString(),
        "type":"Tie Fighter",
        "side":"empire",
        "power":Math.floor(Math.random() * (500 + 1))
    });
    //console.log('Inserted documents =>', insertResult);    
  }
}

async function createStormTroopers(dbConnection){
  const collection = dbConnection.collection('characters');

  for (let i = 0; i < 10000; i++) {
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

  for (let i = 0; i < 10000; i++) {
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

  for (let i = 0; i < 20000; i++) {
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