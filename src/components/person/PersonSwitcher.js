import React from 'react';
import { arrayOf, func } from 'prop-types';
import { personType } from '../../util/types';

const PersonSwitcher = ({ persons, user, onChange }) => (
    <div className="ui segment">
        <select id="roles" className="ui dropdown" onChange={onChange}>
            <option value="">Choose a role</option>
            {persons.map(person => (
                <option
                    key={person.personId}
                    value={person.shibbolethId}
                >
                    {person.firstname} {person.lastname}
                </option>
            ))}
        </select>
        <p>Your roles are: {user.roles ?
            user.roles.map(roleObject => `${roleObject.programme}: ${roleObject.role}`)
            : 'No user in redux'}
        </p>
    </div>
);

PersonSwitcher.propTypes = {
    persons: arrayOf(personType).isRequired,
    user: personType.isRequired,
    onChange: func.isRequired
};

export default PersonSwitcher;
