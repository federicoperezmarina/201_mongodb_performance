# 201_mongodb_performance
This is a repository to learn about mongodb performance

## Table of Contents
* [Start Mongodb and data creation](#start-mongodb-and-data-creation)
* [Mongodb Optimizing Queries](#mongodb-optimizing-queries)
* [Mongodb Optimizing Aggregation Framework](#mongodb-optimizing-aggregation-framework)
* [Mongodb Atlas](#mongodb-atlas)
* [Mongodb Logs](#mongodb-logs)
* [Mongodb Keyhole](#mongodb-keyhole)
* [Mongodb Maobi](#mongodb-maobi)

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
node create_database_collections.js

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
* [Batch processing](#batch-processing)
* [Bulk insert](#bulk-insert)
* [Optimizing sort operations](#optimizing-sort-operations)
* [Query selectivity / Filter strategies](#query-selectivity--filter-strategies)
* [Optimizing collections scans](#optimizing-collections-scans)

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


### Batch processing
### Bulk insert
### Optimizing sort operations
### Query selectivity / Filter strategies
Not equals conditions
Range queries
$OR or $IN operations
Array Queries
Regular Expressions
$exists Queries
### Optimizing collections scans

## Mongodb Optimizing Aggregation Framework
## Mongodb Atlas
## Mongodb Logs
## Mongodb Keyhole
## Mongodb Maobi