import React, { Component } from 'react'
import { array } from 'prop-types'

export class ProgrammeRoleList extends Component {
    sortRoles = (roleA, roleB) => {
        const order = ['manager', 'print_person', 'resp_professor', 'grader', 'supervisor']
        return order.indexOf(roleA) - order.indexOf(roleB)
    }

    filterPersonsInProgrammes = () => (
        this.props.userProgrammes.map((programmeRole) => {
            const programme = programmeRole
            const programmePersons = this.props.persons.filter(person => person.roles.find(role => role.programme === programme))
            return { programme, programmePersons }
        })
    )

    filterPersonsInRoles = (role, programme) => {
        const persons = programme.programmePersons.filter(person =>
            person.roles.find(personRole => personRole.role === role && personRole.programme === programme.programme))
        return persons.map(person => `${person.firstname} ${person.lastname}`)
    }

    render() {
        const programmes = this.filterPersonsInProgrammes()
        const order = ['manager', 'print_person', 'resp_professor', 'grader', 'supervisor']
        return (
            <div>
                {programmes.map(programme => (
                    <div key={programme.programme}>
                        <h2>{programme.programme}:</h2>
                        {order.map(role => (
                            <div key={role}>
                                <h3>In role {role}:</h3>
                                {this.filterPersonsInRoles(role, programme).join(', ')}
                            </div>
                        ))}
                        <br />
                    </div>
                ))}
            </div>
        )
    }
}
ProgrammeRoleList.propTypes = {
    userProgrammes: array.isRequired,
    persons: array.isRequired
}

export default ProgrammeRoleList
