# 201_mongodb_performance
This is a repository to learn about mongodb performance

First of all we have to install a mongodb database. We are going to create with docker. With the next command we will create a container with a mongodb databaes.
```sh
docker run -d -p 27017:27017 --name example-mongo mongo:latest
```

In order to connect to the database we can use this docker command:
```sh
docker exec -it example-mongo mongo
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