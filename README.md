# Grappa 2.0 backend

Ohjelmistotuotantoprojekti (Software lab), autumn 2017
University of Helsinki

[front end](https://github.com/UniversityOfHelsinkiCS/front-grappa2)

[Documentation](https://drive.google.com/drive/folders/0B5AboURQNTdya2xJcC0zVmVDM1E)

Grappa 2.0 (GRAdut Pikaisesti PAkettiin 2.0) will be a tool for both students and staff to manage master theses, to simplify and to speed up the whole thesis process. Made for the Helsinki University's department of Computer Science and licensed under MIT.

[![Build Status](https://travis-ci.org/UniversityOfHelsinkiCS/back-grappa2.svg?branch=master)](https://travis-ci.org/UniversityOfHelsinkiCS/back-grappa2)
[![codebeat badge](https://codebeat.co/badges/92abe60c-5b7d-4bf4-9465-f78099108342)](https://codebeat.co/projects/github-com-universityofhelsinkics-back-grappa2-master)
[![Coverage Status](https://coveralls.io/repos/github/UniversityOfHelsinkiCS/back-grappa2/badge.svg?branch=master)](https://coveralls.io/github/UniversityOfHelsinkiCS/back-grappa2?branch=master)

Dependencies: [![Known Vulnerabilities](https://snyk.io/test/github/UniversityOfHelsinkiCS/back-grappa2/badge.svg)](https://snyk.io/test/github/UniversityOfHelsinkiCS/back-grappa2)

## Dev database setup

```
$ docker run --name grappa-postgres-container -d -e POSTGRES_PASSWORD=password -it -p 5433:5432 postgres:9.6.3
$ docker exec -it postgres-container createdb -U postgres grappa
$ docker exec -it grappa-postgres-container createdb -U postgres grappa
$ docker exec -it grappa-postgres-container psql -c 'create schema grappa_test;' -U postgres grappa
```

Create .env file to project root and add database connection string
```
DATABASE_URL=postgres://postgres:password@localhost:5433/grappa
```

Test are run using grappa_test schema. Development app is run with public schema.
