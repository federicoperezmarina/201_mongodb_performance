import requests
import json
import pymongo
import time

myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient.starwars
myInsertCollection = myDb.starshipMultipleFetchInsertMany
mySelectCollection = myDb.starshipBatchInsert

start_time = time.time()
items = []
for item in mySelectCollection.find({}):
	items.append(item)
myInsertCollection.insert_many(items)
print("--- %s seconds ---" % (time.time() - start_time))