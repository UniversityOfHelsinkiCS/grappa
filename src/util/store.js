import { createStore, applyMiddleware, compose } from "redux";

//malli myöhempää käyttöä varten grappa1.0:sta: https://github.com/UniversityOfHelsinkiCS/grappa-frontend/blob/master/src/store.js
const combinedReducers = combineReducers({/*tänne sitten tuodaan reducerit*/});

const store = createPersistentStore(combinedReducers);

export default store;