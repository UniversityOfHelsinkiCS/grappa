import { createSelector } from 'reselect'

const getProgrammes = state => state.programmes
const getCouncilMeetings = state => state.councilmeetings

// TODO: Check why program is undefined in init
const findProgram = (programmes, id) => programmes.find(p => p.programmeId === id)

export const makeAndGetMeetingsWithProgramNames = () => createSelector(
    [getProgrammes, getCouncilMeetings],
    (programmes, councilMeetings) =>
        councilMeetings.map(meeting => ({
            ...meeting,
            programmes: meeting.programmes.map(id =>
                (findProgram(programmes, id))
            )
        }))
)
