import React from 'react'
import { arrayOf, func } from 'prop-types'
import { programmeType } from '../../../util/types'

export const ProgrammeList = ({ programmes, removeProgramme }) => {
    if (programmes.length === 0)
        return null

    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {programmes.sort((a, b) => a.name > b.name).map(programme => (
                    <tr key={programme.programmeId}>
                        <td>{programme.name}</td>
                        <td>
                            <i className="remove icon red" onClick={() => removeProgramme(programme.programmeId)} />
                        </td>
                    </tr>)
                )}
            </tbody>
        </table>
    )
}

ProgrammeList.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    removeProgramme: func.isRequired
}

export default ProgrammeList
