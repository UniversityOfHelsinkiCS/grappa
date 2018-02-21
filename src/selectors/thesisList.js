import { createSelector } from 'reselect'
import { formatTheses } from '../util/theses'

const getTheses = state => state.theses
const getAgreements = state => state.agreements
const getPersons = state => state.persons
const getRoles = state => state.roles

export const makeGetFormatTheses = () => {
    return createSelector(
        [getTheses, getAgreements, getPersons, getRoles],
        (theses, agreements, persons, roles) => formatTheses(theses, agreements, persons, roles)
    )
}
