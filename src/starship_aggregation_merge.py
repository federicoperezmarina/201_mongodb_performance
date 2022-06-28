import pymongo
import time

myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient.starwars
mySelectCollection = myDb.starshipBatchInsert

start_time = time.time()
mySelectCollection.aggregate([{'$merge':{"into":'starshipAggregationMerge'}}])
print("--- %s seconds ---" % (time.time() - start_time))