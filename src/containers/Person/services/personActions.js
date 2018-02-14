import { callController } from '../../../util/apiConnection'

export const getPersons = () => callController('/persons', 'PERSON_GET_ALL_')

export const invitePerson = invite => callController('/persons/invite', 'PERSON_INVITE_ONE_', invite, 'post')
