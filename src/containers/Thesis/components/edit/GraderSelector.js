import React from 'react'
import { arrayOf, func, object, bool, number } from 'prop-types'
import PersonSelector from '../../../Person/components/PersonSelector'
import { personType, roleType } from '../../../../util/types'

const GraderSelector = ({ graders, change, persons, roles, validationErrors, allowEdit, programmeId }) => {
    const programmeGraders = persons.filter(person =>
        roles.find(role =>
            role.name === 'grader'
            && role.personId === person.personId
            && role.programmeId === Number(programmeId)
        )
    )
    return (
        <div className="field">
            <label>
                Select graders
                <PersonSelector
                    persons={programmeGraders}
                    selected={graders}
                    changeList={change}
                    validationError={Object.keys(validationErrors).includes('graders')}
                    allowEdit={allowEdit}
                />
            </label>
        </div>
    )
}

GraderSelector.propTypes = {
    graders: arrayOf(personType).isRequired,
    validationErrors: object.isRequired,
    allowEdit: bool.isRequired,
    persons: arrayOf(personType).isRequired,
    programmeId: number.isRequired,
    roles: arrayOf(roleType).isRequired,
    change: func.isRequired
}

export default GraderSelector
