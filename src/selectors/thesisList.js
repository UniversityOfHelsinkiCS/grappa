import { createSelector } from 'reselect'
import { formatTheses } from '../util/theses'

const getTheses = state => state.theses
const getAgreements = state => state.agreements
const getPersons = state => state.persons
const getRoles = state => state.roles
const getCouncilMeetings = state => state.councilmeetings

export const makeGetFormatTheses = () => {
    return createSelector(
        [getTheses, getAgreements, getPersons, getRoles, getCouncilMeetings],
        (theses, agreements, persons, roles, councilMeetings) =>
            formatTheses(theses, agreements, persons, roles, councilMeetings)
    )
}
