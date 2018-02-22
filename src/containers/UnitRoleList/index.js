import React, { Component } from 'react'
import { connect } from 'react-redux'
import { array } from 'prop-types'

import { makeGetRolesInUnits } from '../../selectors/unitRoleList'

export class UnitRoleList extends Component {
    sortRoles = (roleA, roleB) => {
        const order = ['manager', 'print_person', 'resp_professor', 'grader', 'supervisor']
        return order.indexOf(roleA) - order.indexOf(roleB)
    }

    render() {
        const { rolesInUnits } = this.props
        return (
            <div>
                {rolesInUnits.map(rolesInUnit => (
                    <div key={rolesInUnit.name}>
                        <h2>{rolesInUnit.name}:</h2>
                        {Object.keys(rolesInUnit).filter(key => key !== 'name').sort(this.sortRoles).map(key => (
                            <div key={key + rolesInUnit.name}>
                                <h3>In role {key}:</h3>
                                &nbsp;{rolesInUnit[key]
                                    .map(person => `${person.firstname} ${person.lastname}`).join(', ')}
                            </div>
                        )
                        )}
                        <br />
                    </div>
                )
                )}
            </div>
        )
    }
}
UnitRoleList.propTypes = {
    rolesInUnits: array.isRequired
}

const getRolesInUnits = makeGetRolesInUnits()

const mapStateToProps = (state, props) => ({
    rolesInUnits: getRolesInUnits(state, props)
})

export default connect(mapStateToProps)(UnitRoleList)
