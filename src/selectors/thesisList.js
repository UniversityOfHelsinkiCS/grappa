import { createSelector } from 'reselect'
import { formatTheses } from '../util/theses'

const getTheses = (state, props) => {
    if (props.councilMeetingId)
        return state.theses.filter(thesis => thesis.councilmeetingId === props.councilMeetingId)

    return state.theses
}

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
