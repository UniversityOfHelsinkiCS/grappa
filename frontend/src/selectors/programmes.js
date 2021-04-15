import { createSelector } from 'reselect'

const getProgrammes = state => state.programmes

export const makeAndGetProgrammesForDropdown = () =>
    createSelector(
        getProgrammes,
        programmes => programmes.map(p => ({
            key: p.programmeId, value: p.programmeId, text: p.name
        })
        )
    )
