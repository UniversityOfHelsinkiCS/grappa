import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { arrayOf, func, object, bool, number } from 'prop-types'
// import PersonSelector from '../../../Person/components/PersonSelector'
import { personType, roleType } from '../../../../util/types'

const renderGraderSelector = (graders, programmeGraders, change) => {
    const graderGroup = programmeGraders.map((grader) => {
        const { personId, firstname, lastname, email } = grader.person
        const obj = {
            key: personId,
            value: personId,
            text: `${firstname} ${lastname} ${email}`
        }
        if (grader.roleRequestId) {
            obj.label = { color: 'red', empty: true, circular: true }
            obj.text = `${obj.text}  -  NOT YET CONFIRMED GRADER`
        }
        return obj
    })
    return <Dropdown placeholder="Select graders" multiple search selection value={graders} options={graderGroup} onChange={change} />
}

const GraderSelector = ({ change, programmeGraders, value }) => {
    // const programmeGraders = getGradersAction(programmeId)// persons.filter(person =>
    //     roles.find(role =>
    //         role.name === 'grader'
    //         && role.personId === person.personId
    //         && role.programmeId === Number(programmeId)
    //     )
    // )
    return (
        <div className="field">
            <label>
                Select 2 graders
                {programmeGraders.length ? renderGraderSelector(value, programmeGraders, change) : <p>My name Jeff</p>}
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
