import React from 'react'
import { arrayOf, func } from 'prop-types'
import { personType } from '../../../util/types'

const PersonSwitcher = ({ persons, managers, onChange }) => (
    <div className="ui segment">
        <select id="roles" className="ui dropdown" onChange={onChange}>
            <option value="">Choose a role</option>
            {persons
                .sort((a, b) => `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`))
                .map(person => (
                    <option
                        key={person.personId}
                        value={person.shibbolethId}
                    >
                        {person.firstname} {person.lastname}
                    </option>
                ))}
            {managers.map(manager => (
                <option
                    key={manager.person.email + manager.programmeId}
                    value={manager.person.email}
                >
                    {manager.person.firstname} {manager.person.lastname}
                </option>
            ))}
        </select>
    </div>
)

PersonSwitcher.propTypes = {
    persons: arrayOf(personType).isRequired,
    onChange: func.isRequired
}

export default PersonSwitcher
