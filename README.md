# 201_mongodb_performance
This is a repository to learn about mongodb performance

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
```

## Table of Contents
* [Mongodb Optimizing Queries](#mongodb-optimizing-queries)
* [Mongodb Optimizing Aggregation Framework](#mongodb-optimizing-aggregation-framework)
* [Mongodb Atlas](#mongodb-atlas)
* [Mongodb Logs](#mongodb-logs)
* [Mongodb Keyhole](#mongodb-keyhole)
* [Mongodb Maobi](#mongodb-maobi)

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