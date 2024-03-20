import { callController, callApi } from '../../../util/apiConnection'

export const getPersons = () => callController('/persons', 'PERSON_GET_ALL_')

export const searchPersons = () => callController('/persons', 'PERSON_SEARCH_')

export const getManagers = () => callController('/persons/managers', 'PERSON_GET_MANAGERS_')

export const invitePerson = invite => callController('/persons/invite', 'PERSON_INVITE_ONE_', invite, 'post')

export const requestGraderAction = data =>
    callApi('/persons/request_grader', 'post', data, 'PERSON_REQUEST_GRADER_')

export const getGradersAction = programmeId =>
    callApi(`/persons/graders/?programmeId=${programmeId}`, 'get', null, 'PERSON_GET_GRADERS_')
