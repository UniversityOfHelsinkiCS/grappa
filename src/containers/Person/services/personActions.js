import { callController } from '../../../util/apiConnection'

export const getPersons = () => callController('/persons', 'PERSON_GET_ALL_')

export const getManagers = () => callController('/persons/managers', 'PERSON_GET_MANAGERS_')

export const invitePerson = invite => callController('/persons/invite', 'PERSON_INVITE_ONE_', invite, 'post')

export const requestGraderAction = data => callController('/persons/request_grader', 'PERSON_REQUEST_GRADER_', data, 'post')

export const getGradersAction = programmeId => callController(`/persons/graders/?programmeId=${programmeId}`, 'PERSON_GET_GRADERS_')
