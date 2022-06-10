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
db.characters.explain('executionStats').find();

#output
{ explainVersion: '1',
  queryPlanner: 
   { namespace: 'starwars.characters',
     indexFilterSet: false,
     parsedQuery: {},
     maxIndexedOrSolutionsReached: false,
     maxIndexedAndSolutionsReached: false,
     maxScansToExplodeReached: false,
     winningPlan: { stage: 'COLLSCAN', direction: 'forward' },
     rejectedPlans: [] },
  executionStats: 
   { executionSuccess: true,
     nReturned: 4000000,
     executionTimeMillis: 1128,
     totalKeysExamined: 0,
     totalDocsExamined: 4000000,
     executionStages: 
      { stage: 'COLLSCAN',
        nReturned: 4000000,
        executionTimeMillisEstimate: 15,
        works: 4000002,
        advanced: 4000000,
        needTime: 1,
        needYield: 0,
        saveState: 4000,
        restoreState: 4000,
        isEOF: 1,
        direction: 'forward',
        docsExamined: 4000000 } },
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

### Adding indexes / Covered Query
### Projections and Limit
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