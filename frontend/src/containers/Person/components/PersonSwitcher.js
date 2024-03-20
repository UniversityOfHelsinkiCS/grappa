import React from 'react'
import { arrayOf, func, string } from 'prop-types'
import { personType } from '../../../util/types'

const PersonSwitcher = ({ persons, onChange, value, onReset }) => (
    <div className="ui segment">
        <select id="roles" className="ui dropdown" onChange={onChange} value={value} style={{ margin: 10 }}>
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
        </select>
        <button className="ui black button" onClick={onReset}> Reset </button>
    </div>
)

PersonSwitcher.propTypes = {
    persons: arrayOf(personType).isRequired,
    onChange: func.isRequired,
    onReset: func.isRequired,
    value: string.isRequired
}

export default PersonSwitcher
