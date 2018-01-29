import React from 'react';
import { object } from 'prop-types';

export const RoleExplain = ({ user }) => {
    if (!user.roles) {
        return <div />
    }

    const roleInfo = (roleName) => {
        switch (roleName) {
            case 'admin':
                return 'do stuff you should be able to do.'
            case 'manager':
                return `are responsible for inviting new users and modifying roles for existing users
                on page "Role Management" and 
                creating council meetings for the units on page "Council meetings". 
                You can also view theses and their progress on pages "Next Council meeting" and "Thesis list"
                in addition you can add new Theses to the system on page "New Thesis".`
            case 'resp_professor':
                return `are responsible for reviewing the graders of a thesis on "Grader Accepting" page, 
                you can also view theses and their progress on "Thesis list" page.`
            case 'print_person':
                return `are responsible for printing theses to the correct council meeting 
                on the "Next Council meeting" page.`
            case 'grader':
                return `are responsible for adding new theses from the page "New Theses" 
                you can also view theses and their progress on "Thesis list" page.`
            case 'supervisor':
                return `are responsible for adding new theses from the page "New Theses"
                you can also view theses and their progress on "Thesis list" page.`
            default:
                return `Unknown role: ${roleName}, contact grp-toska@helsinki.fi`
        }
    }

    return (
        <div>
            {user.roles.length > 0 ?
                <h3>You have the following roles:</h3> :
                <h3>Welcome to Grappa, if you have theses you should find them on page Thesis List</h3>}
            {user.roles.map((role) => {
                return (
                    <div style={{ margin: '1%' }}>
                        <h3>
                            {role.role.charAt(0).toUpperCase() + role.role.slice(1)} in {role.programme}
                        </h3>
                        <p>
                            As {role.role} you {roleInfo(role.role)}
                        </p>
                    </div>
                )
            })}
        </div>
    );
}

RoleExplain.propTypes = {
    user: object.isRequired
};

export default RoleExplain;
