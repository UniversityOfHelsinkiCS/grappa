# Grappa 2.0 backend

Ohjelmistotuotantoprojekti (Software lab), autumn 2017
University of Helsinki

[front end](https://github.com/OhtuGrappa2/front-grappa2)

[Documentation](https://drive.google.com/drive/folders/0B5AboURQNTdya2xJcC0zVmVDM1E)

Grappa 2.0 (GRAdut Pikaisesti PAkettiin 2.0) will be a tool for both students and staff to manage master theses, to simplify and to speed up the whole thesis process. Made for the Helsinki University's department of Computer Science and licensed under MIT.

[![Build Status](https://travis-ci.org/OhtuGrappa2/back-grappa2.svg?branch=master)](https://travis-ci.org/OhtuGrappa2/back-grappa2)
[![codebeat badge](https://codebeat.co/badges/7317a671-8161-462b-9c02-6ff03b62780e)](https://codebeat.co/projects/github-com-ohtugrappa2-back-grappa2-master)
[![Coverage Status](https://coveralls.io/repos/github/OhtuGrappa2/back-grappa2/badge.svg?branch=master)](https://coveralls.io/github/OhtuGrappa2/back-grappa2?branch=master)

Dependencies: [![Known Vulnerabilities](https://snyk.io/test/github/ohtugrappa2/back-grappa2/badge.svg)](https://snyk.io/test/github/ohtugrappa2/back-grappa2)

## Dev database setup

```
$ docker run --name grappa-postgres-container -d -e POSTGRES_PASSWORD=password -it -p 5433:5432 postgres:9.6.3
$ docker exec -it postgres-container createdb -U postgres grappa
$ docker exec -it grappa-postgres-container createdb -U postgres grappa
$ docker exec -it grappa-postgres-container psql -c 'create schema grappa_test;' -U postgres
```

Run tests with DATABASE_URL env set:
`DATABASE_URL=postgres://postgres:password@localhost:5433/grappa npm run test`

Test are run using grappa_test schema. Development app is run with public schema.
