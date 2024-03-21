import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { arrayOf, func, object, bool, number } from 'prop-types'
import { personType } from '../../../../util/types'

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

const GraderSelector = ({ change, programmeGraders, graders }) => {
    return (
        <div className="field">
            <label>
                Select 2 graders
                {programmeGraders.length ? renderGraderSelector(graders, programmeGraders, change) : <p>My name Jeff</p>}
            </label>
        </div>
    )
}

GraderSelector.propTypes = {
    graders: arrayOf(number).isRequired,
    programmeGraders: arrayOf(personType).isRequired,
    validationErrors: object.isRequired,
    allowEdit: bool.isRequired,
    change: func.isRequired
}

export default GraderSelector
