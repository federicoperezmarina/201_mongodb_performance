class Characters {

  private characters : any;

  constructor() {}

  function createBattleDroid(dbConnection){
    const collection = dbConnection.collection('characters');

    for (let i = 0; i < 1000; i++) {
      const insertResult = collection.insertOne({
          "name":"B1-"+i.toString(),
          "type":"battle droid",
          "side":"empire",
          "strength":Math.floor(Math.random() * (50 + 1))
      });
      //console.log('Inserted documents =>', insertResult);    
    }
  }

}