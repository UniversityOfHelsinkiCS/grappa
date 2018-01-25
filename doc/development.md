# Development

Front and back end are in separate repositories, and are run separately. In development use, front end will listen localhost:3000 and back end will listen localhost:3100. If you want to use whole application, you need to have both front and back end running simultaneously. In development use, back end will use sqlite database.

To start development (for both repositories separately):
1. Clone code from repositories.
2. Run _npm install_ to install dependencies.
3. Run _npm test_ to run tests.
4. Run _npm start_ to run application. If you want to use front end, you will also need to run back end.

Front end has also alternative start script, which will enable react dev tools:
- _npm run start:dev_

Also, for windows users:
- _npm run start:win_

Back end has some useful convenience scripts:
- _npm run db:migrate_ will run database migrations.
- _npm run db:seed_ will seed database with initial data.
- _npm run db:reset_ will remove existing sqlite database, and then recreate and seed it.

Both front end and back end will produce html test report from preceding test run results to coverage directory:
- _npm run report_
