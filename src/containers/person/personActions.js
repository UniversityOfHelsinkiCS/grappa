import { callController } from '../../util/apiConnection';

export const getPersons = () => {
    const route = '/persons';
    const prefix = "PERSON_GET_ALL_";
    return callController(route, prefix);
}