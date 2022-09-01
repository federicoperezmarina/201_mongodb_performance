# 201_mongodb_performance
This is a repository to learn about mongodb performance

## Table of Contents
* [Start Mongodb and data creation](#start-mongodb-and-data-creation)
* [Mongodb Optimizing Queries](#mongodb-optimizing-queries)
* [Mongodb Optimizing Aggregation Framework](#mongodb-optimizing-aggregation-framework)

## Start Mongodb and data creation
First of all we have to install a mongodb database. We are going to create with docker. With the next command we will create a container with a mongodb database.
```sh
docker container run --name mongo-starwars --publish 27017:27017 -d mongo
```

In order to connect to the database we can use this docker command:
```sh
#to connect to the container
docker container exec -it mongo-starwars bash;

#to enter to the database
mongo
```

After the creation of the database, we need to create collections and documents in order to learn how to improve the performance in mongodb.
```sh
#install the dependency of mongodb in node
npm install mongodb

# to execute the creation of collection and documents
node src/create_database_collections.js

#output
Connected successfully to server
Creating troops
Creating starships
Creation finished
```

## Mongodb Optimizing Queries
* [Explain command](#explain-command)
* [Adding indexes / Covered Query](#adding-indexes--covered-query)
* [Projections and Limit](#projections-and-limit)
* [Batch processing / Bulk insert](#batch-processing--bulk-insert)
* [Cloning data](#cloning-data)
* [Update data](#update-data)
* [Delete data](#delete-data)
* [Optimizing sort operations](#optimizing-sort-operations)
* [Query selectivity / Filter strategies](#query-selectivity--filter-strategies)

### Explain command
The explain command get the information about how is executed a query.

How to use the command explain():
```sh
use starwars;
db.characters.explain().find();

#output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.characters',
     indexFilterSet: false,
     parsedQuery: {},
     queryHash: '8B3D4AB8',
     planCacheKey: 'D542626C',
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: { stage: 'COLLSCAN', direction: 'forward' },
     rejectedPlans: [] },
  command: { find: 'characters', filter: {}, '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }
```

Here we can see the information given by the command explain()
- explainVersion, the output format version (for example, "1");
- command, which details the command being explained;
- queryPlanner, which details the plan selected by the query optimizer and lists the rejected plans;
- executionStats, which details the execution of the winning plan and the rejected plans;
- serverInfo, which provides information on the MongoDB instance; and
- serverParameters, which details internal parameters.

We can add verbosity mode to the explain command with this three options: queryPlanner, executionStats and allPlansExecution.
```sh
db.characters.explain('executionStats').find({strength:24});

#output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.characters',
     indexFilterSet: false,
     parsedQuery: { strength: { '$eq': 24 } },
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: 
      { stage: 'COLLSCAN',
        filter: { strength: { '$eq': 24 } },
        direction: 'forward' },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 79068,
     executionTimeMillis: 1832,
     totalKeysExamined: 0,
     totalDocsExamined: 4000000,
     executionStages: 
      { stage: 'COLLSCAN',
        filter: { strength: { '$eq': 24 } },
        nReturned: 79068,
        executionTimeMillisEstimate: 136,
        works: 4000002,
        advanced: 79068,
        needTime: 3920933,
        needYield: 0,
        saveState: 4002,
        restoreState: 4002,
        isEOF: 1,
        direction: 'forward',
        docsExamined: 4000000 } },
  command: 
   { find: 'characters',
     filter: { strength: 24 },
     '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }
```

Now we are able to take one step and start introducing optimizations in our querys using the explain command

### Adding indexes / Covered Query
To create indexes we can use this command

```sh
# create single index
db.characters.createIndex({"strength":1});

# output
'strength_1'

# now we are going to see the explain of a find
db.characters.explain('executionStats').find({strength:24});

# output 
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.characters',
     indexFilterSet: false,
     parsedQuery: { strength: { '$eq': 24 } },
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: 
      { stage: 'FETCH',
        inputStage: 
         { stage: 'IXSCAN',
           keyPattern: { strength: 1 },
           indexName: 'strength_1',
           isMultiKey: false,
           multiKeyPaths: { strength: [] },
           isUnique: false,
           isSparse: false,
           isPartial: false,
           indexVersion: 2,
           direction: 'forward',
           indexBounds: { strength: [ '[24, 24]' ] } } },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 79068,
     executionTimeMillis: 312,
     totalKeysExamined: 79068,
     totalDocsExamined: 79068,
     executionStages: 
      { stage: 'FETCH',
        nReturned: 79068,
        executionTimeMillisEstimate: 84,
        works: 79069,
        advanced: 79068,
        needTime: 0,
        needYield: 0,
        saveState: 79,
        restoreState: 79,
        isEOF: 1,
        docsExamined: 79068,
        alreadyHasObj: 0,
        inputStage: 
         { stage: 'IXSCAN',
           nReturned: 79068,
           executionTimeMillisEstimate: 16,
           works: 79069,
           advanced: 79068,
           needTime: 0,
           needYield: 0,
           saveState: 79,
           restoreState: 79,
           isEOF: 1,
           keyPattern: { strength: 1 },
           indexName: 'strength_1',
           isMultiKey: false,
           multiKeyPaths: { strength: [] },
           isUnique: false,
           isSparse: false,
           isPartial: false,
           indexVersion: 2,
           direction: 'forward',
           indexBounds: { strength: [ '[24, 24]' ] },
           keysExamined: 79068,
           seeks: 1,
           dupsTested: 0,
           dupsDropped: 0 } } },
  command: 
   { find: 'characters',
     filter: { strength: 24 },
     '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }
```

We can see the difference between launching the query without the index and with it. The executionTimeMillis without index is 1832 and 312 with the index. So we can see the difference between using the index or not.

A covered query is a query that can be satisfied entirely using an index and does not have to examine any documents.

```sh
# this will be a covered query with the index
db.characters.explain('executionStats').find({strength:24},{strength:1,_id:0});

# output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.characters',
     indexFilterSet: false,
     parsedQuery: { strength: { '$eq': 24 } },
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: 
      { stage: 'PROJECTION_COVERED',
        transformBy: { strength: 1, _id: 0 },
        inputStage: 
         { stage: 'IXSCAN',
           keyPattern: { strength: 1 },
           indexName: 'strength_1',
           isMultiKey: false,
           multiKeyPaths: { strength: [] },
           isUnique: false,
           isSparse: false,
           isPartial: false,
           indexVersion: 2,
           direction: 'forward',
           indexBounds: { strength: [ '[24, 24]' ] } } },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 79068,
     executionTimeMillis: 46,
     totalKeysExamined: 79068,
     totalDocsExamined: 0,
     executionStages: 
      { stage: 'PROJECTION_COVERED',
        nReturned: 79068,
        executionTimeMillisEstimate: 1,
        works: 79069,
        advanced: 79068,
        needTime: 0,
        needYield: 0,
        saveState: 79,
        restoreState: 79,
        isEOF: 1,
        transformBy: { strength: 1, _id: 0 },
        inputStage: 
         { stage: 'IXSCAN',
           nReturned: 79068,
           executionTimeMillisEstimate: 1,
           works: 79069,
           advanced: 79068,
           needTime: 0,
           needYield: 0,
           saveState: 79,
           restoreState: 79,
           isEOF: 1,
           keyPattern: { strength: 1 },
           indexName: 'strength_1',
           isMultiKey: false,
           multiKeyPaths: { strength: [] },
           isUnique: false,
           isSparse: false,
           isPartial: false,
           indexVersion: 2,
           direction: 'forward',
           indexBounds: { strength: [ '[24, 24]' ] },
           keysExamined: 79068,
           seeks: 1,
           dupsTested: 0,
           dupsDropped: 0 } } },
  command: 
   { find: 'characters',
     filter: { strength: 24 },
     projection: { strength: 1, _id: 0 },
     '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }
```

Now we can see that using a covered query perform better with the index created. The performance increase goes from 312ms to 46ms.

### Projections and Limit
With the projections and limit we want to reduce the subset of data of the document and limiting all the documents that we want to recieve. So that improves the performance.

```sh
# initial query
db.starships.explain('executionStats').find({power:25});

# output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.starships',
     indexFilterSet: false,
     parsedQuery: { power: { '$eq': 25 } },
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: 
      { stage: 'COLLSCAN',
        filter: { power: { '$eq': 25 } },
        direction: 'forward' },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 4030,
     executionTimeMillis: 936,
     totalKeysExamined: 0,
     totalDocsExamined: 2000000,
     executionStages: 
      { stage: 'COLLSCAN',
        filter: { power: { '$eq': 25 } },
        nReturned: 4030,
        executionTimeMillisEstimate: 47,
        works: 2000002,
        advanced: 4030,
        needTime: 1995971,
        needYield: 0,
        saveState: 2000,
        restoreState: 2000,
        isEOF: 1,
        direction: 'forward',
        docsExamined: 2000000 } },
  command: { find: 'starships', filter: { power: 25 }, '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }

#query with a projection  
db.starships.explain('executionStats').find({power:25},{power:1,_id:0});

#output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.starships',
     indexFilterSet: false,
     parsedQuery: { power: { '$eq': 25 } },
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: 
      { stage: 'PROJECTION_SIMPLE',
        transformBy: { power: 1, _id: 0 },
        inputStage: 
         { stage: 'COLLSCAN',
           filter: { power: { '$eq': 25 } },
           direction: 'forward' } },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 4030,
     executionTimeMillis: 836,
     totalKeysExamined: 0,
     totalDocsExamined: 2000000,
     executionStages: 
      { stage: 'PROJECTION_SIMPLE',
        nReturned: 4030,
        executionTimeMillisEstimate: 26,
        works: 2000002,
        advanced: 4030,
        needTime: 1995971,
        needYield: 0,
        saveState: 2000,
        restoreState: 2000,
        isEOF: 1,
        transformBy: { power: 1, _id: 0 },
        inputStage: 
         { stage: 'COLLSCAN',
           filter: { power: { '$eq': 25 } },
           nReturned: 4030,
           executionTimeMillisEstimate: 26,
           works: 2000002,
           advanced: 4030,
           needTime: 1995971,
           needYield: 0,
           saveState: 2000,
           restoreState: 2000,
           isEOF: 1,
           direction: 'forward',
           docsExamined: 2000000 } } },
  command: 
   { find: 'starships',
     filter: { power: 25 },
     projection: { power: 1, _id: 0 },
     '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }

# query with the projection and limit
db.starships.explain('executionStats').find({power:25},{power:1,_id:0}).limit(10);

# output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.starships',
     indexFilterSet: false,
     parsedQuery: { power: { '$eq': 25 } },
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: 
      { stage: 'LIMIT',
        limitAmount: 10,
        inputStage: 
         { stage: 'PROJECTION_SIMPLE',
           transformBy: { power: 1, _id: 0 },
           inputStage: 
            { stage: 'COLLSCAN',
              filter: { power: { '$eq': 25 } },
              direction: 'forward' } } },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 10,
     executionTimeMillis: 3,
     totalKeysExamined: 0,
     totalDocsExamined: 6133,
     executionStages: 
      { stage: 'LIMIT',
        nReturned: 10,
        executionTimeMillisEstimate: 0,
        works: 6135,
        advanced: 10,
        needTime: 6124,
        needYield: 0,
        saveState: 6,
        restoreState: 6,
        isEOF: 1,
        limitAmount: 10,
        inputStage: 
         { stage: 'PROJECTION_SIMPLE',
           nReturned: 10,
           executionTimeMillisEstimate: 0,
           works: 6134,
           advanced: 10,
           needTime: 6124,
           needYield: 0,
           saveState: 6,
           restoreState: 6,
           isEOF: 0,
           transformBy: { power: 1, _id: 0 },
           inputStage: 
            { stage: 'COLLSCAN',
              filter: { power: { '$eq': 25 } },
              nReturned: 10,
              executionTimeMillisEstimate: 0,
              works: 6134,
              advanced: 10,
              needTime: 6124,
              needYield: 0,
              saveState: 6,
              restoreState: 6,
              isEOF: 0,
              direction: 'forward',
              docsExamined: 6133 } } } },
  command: 
   { find: 'starships',
     filter: { power: 25 },
     projection: { power: 1, _id: 0 },
     limit: 10,
     '$db': 'starwars' },
  serverInfo: 
   { host: '24060c02ba73',
     port: 27017,
     version: '5.0.6',
     gitVersion: '212a8dbb47f07427dae194a9c75baec1d81d9259' },
  serverParameters: 
   { internalQueryFacetBufferSizeBytes: 104857600,
     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
     internalQueryProhibitBlockingMergeOnMongoS: 0,
     internalQueryMaxAddToSetBytes: 104857600,
     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600 },
  ok: 1 }
```

We see that making the query without the projection and limit performs worst. The difference between using or not the projection and limit is from 936ms to 836ms to 3ms.


### Batch processing / Bulk insert
In the next part, we want to show how to make an insert with multiple elements in order to improve the performance.

First of all we are going to execute 'starship_batch_insert_1.js'. In this example we are going to insert 10000 documents one by one.
```sh
node src/starship_batch_insert_1.js

#output
Connected successfully to server
Batch insert 1
Call to starshipBatchInsert took 18333.24850189686 milliseconds
Creation finished
```

We can see that the insertion of all documents takes 18 seconds when we insert them one by one.

Secondly we are going to insert all of them with the command 'insertMany' of mongodb.
```sh
node src/starship_batch_insert_2.js

#output
Connected successfully to server
Batch insert many 2
Call to starshipBatchInsertMany took 438.1987429857254 milliseconds
Creation finished
```

In this step we can se that the creation takes 0.4 seconds in order to insert all together.

Now we are going to do it in a batch execution in order to perform a little bit better.
```sh
node src/starship_batch_insert_3.js 

#output
Connected successfully to server
Batch insert block 3
Call to starshipBatchInsertBlock took 309.9983730316162 milliseconds
Creation finished
```
We can see that executing in batch mode take 0.3s a little bit better than insertMany.

<p><img src="https://github.com/federicoperezmarina/201_mongodb_performance/blob/main/img/insertions.png"/></p>

### Cloning data
If we need to clone data we can use insertMany or Merge in order to increase the performance of the writes.

Here some examples:
```sh
python3 src/starship_multiple_fetch_insert.py
```

```python
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
```

```sh
python3 src/starship_fetch_insert.py
```

```python
import pymongo
import time

myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient.starwars
myInsertCollection = myDb.starshipFetchInsertMany
mySelectCollection = myDb.starshipBatchInsert

start_time = time.time()
myInsertCollection.insert_many(mySelectCollection.find({}))
print("--- %s seconds ---" % (time.time() - start_time))
```

```sh
python3 src/starship_aggregation_merge.py
```

```python
import pymongo
import time

myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient.starwars
mySelectCollection = myDb.starshipBatchInsert

start_time = time.time()
mySelectCollection.aggregate([{'$merge':{"into":'starshipAggregationMerge'}}])
print("--- %s seconds ---" % (time.time() - start_time))
```

### Update data
If we need to update data, the best way is to use aggregation, update (update many documents at the same time), use upsert and avoid using loops to update the database.

### Delete data
If we have to do a massive delete, the best way is to do it as a logical delete (update a delete flag) and after removing the documents with another process.

### Optimizing sort operations
If a query includes a sort directive and there is no index on the sorted attributes, MongoDB must fetch all of the data and then sort the resulting data in memory. So it's important to have indexes when you are sorting.

### Query selectivity / Filter strategies
We should be careful with some query selectivity operators like, $ne, $exists, $or, $in, Array queries, regular expressions. The reason is simple if the amount of data is high the query will take some time to give the result.

## Mongodb Optimizing Aggregation Framework

The easiest way to optimize these pipelines is to reduce the amount of data as early as possible; this will reduce the amount of work done by each successive step. It logically follows that the stages in your aggregation that will perform the most work should operate on as little data as possible, with as much filtering as possible being performed in earlier stages.

### Optimizing Aggregation Framework:
* [Optimizing Aggregation Ordering](#optimizing-aggregation-ordering)
* [Automatic Pipeline Optimizations](#automatic-pipeline-optimizations)
* [Aggregation Joins](#aggregation-joins)
* [Aggregation Memory Utilization](#aggregation-memory-utilization)
* [Sorting in Aggregation Pipelines](#sorting-in-aggregation-pipelines)

### Optimizing Aggregation Ordering
When we are using the aggregation framework we have to sort and limit the earliest we can. We have to take care to sequence aggregation pipelines to eliminate documents earlier rather than later. The earlier data is eliminated from a pipeline, the less work will be required in later pipelines.

### Automatic Pipeline Optimizations
Use correctly the steps in the aggregation pipeline
```javascript
var explain = db.listingsAndReviews.explain("executionStats").
   aggregate([
    {$match: {"property_type" : "House"}},
    {$match: {"bedrooms" : 3}},
    {$limit: 100},
    {$limit: 5},
    {$skip: 3},
    {$skip: 2}
]);
```
In this case we can reduce the steps from 6 to 3
```javascript
var explain = db.listingsAndReviews.explain("executionStats").
   aggregate([
    {$match: {"property_type" : "House","bedrooms" : 3}},
    {$limit: 5},
    {$skip: 5}
]);
```

Use the limit when you are sorting
```javascript
var explain = db.users.explain("executionStats").
 aggregate([
  { $sort: {year: -1}},
  { $limit: 1}
 ]);
 ```

Reduce the information extracted in aggregation (such as $group, $project, $unset, $addFields, or $set)
```javascript
var exp = db.customers.
   explain('executionStats').
   aggregate([
     { $project: {Country:1, City:1}}
     { $match: { Country: 'Japan' } },
     { $group: { _id: { City: '$City' } } }
   ]);
```

### Aggregation Joins
We should take care with the order of the joins because depending on it can take more or less time.

To decide the join order, we should follow:

1. You should try to reduce the amount of data to be joined as much as possible before the join. So if one of the collections is to be filtered, that collection should come first in the join order.

2. If you only have an index to support one of the two join orders, then you should use the join order that has the supporting index.

3.  If the preceding two criteria are met for both join orders, then you should try to join from the smallest collection to the largest collection.

### Aggregation Memory Utilization
In MongoDB, the size limit for a single document is 16MB. This is true for aggregations as well. When performing aggregations, if any of the output documents can exceed this limit, then an error will be thrown. This may not be a problem when performing simple aggregations. However, when grouping, manipulating, unwinding, and joining documents across multiple collections, you will have to consider the growing size of the output documents. An important distinction here is that this limit only applies to documents in the result. For example, if a document exceeds this limit during the pipeline, but is reduced below the limit before the end, no error will be thrown. In addition, MongoDB combines some operations internally to avoid the limit. 

The second limit to keep in mind is the memory usage limit. At each stage in the aggregation pipeline, there is a memory limit by default of 100MB. If this limit is exceeded, MongoDB will produce an error.

MongoDB does provide a way for getting around this limit during aggregations. The allowDiskUse option can be used to remove this limit for almost all stages. As you may have guessed, when set to true, this allows MongoDB to create a temporary file on disk to hold some data while aggregating, bypassing the memory limit.

### Sorting in Aggregation Pipelines
Sorts in aggregation pipelines differ from sorts in a couple of significant ways:

1.  An aggregation can exceed the memory limit for a blocking sort by performing a “disk sort.” In a disk sort, excess data is written to and from disk during the sort operation.
 
2.  Aggregations might not be able to take advantage of indexed sorting options unless the sort is very early in the pipeline.