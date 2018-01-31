import React from 'react';
import { connect } from 'react-redux';
import { arrayOf } from 'prop-types';

import { personType } from '../../util/types';

const NotificationsPage = ({ notifications, persons }) => {

    const getPersonNameForId = (personId) => {
        const person = persons.find(person => person.personId === personId);
        return person ? `${person.firstname} ${person.lastname}` : 'UNKNOWN USER';
    };

    return (
        <div>
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Tapahtuma</th>
                        <th />
                        <th>Aika</th>
                        <th>Käyttäjä</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map(notification => (
                        <tr key={notification.notificationId}>
                            <td>{notification.type}</td>
                            <td>{notification.programmeId}</td>
                            <td>{notification.timestamp}</td>
                            <td>{getPersonNameForId(notification.userId)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const mapStateToProps = ({ notifications, persons }) => ({
    notifications,
    persons
});

NotificationsPage.propTypes = {
    persons: arrayOf(personType).isRequired
};

export default connect(mapStateToProps)(NotificationsPage);
