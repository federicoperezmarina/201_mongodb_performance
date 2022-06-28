import pymongo
import time

myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient.starwars
myInsertCollection = myDb.starshipFetchInsertMany
mySelectCollection = myDb.starshipBatchInsert

start_time = time.time()
myInsertCollection.insert_many(mySelectCollection.find({}))
print("--- %s seconds ---" % (time.time() - start_time))