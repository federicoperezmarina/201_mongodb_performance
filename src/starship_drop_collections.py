import requests
import json
import pymongo
import time

myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient.starwars
myCollections = ["starshipMultipleFetchInsertMany","starshipFetchInsertMany"]

start_time = time.time()
for collection in myCollections:
	myDb[collection].drop()
print("--- %s seconds ---" % (time.time() - start_time))