import React from 'react'
import { Table, Button, ButtonGroup } from 'semantic-ui-react'

const RoleRequests = ({ roleRequests, handleGrantRole }) => {
    if (roleRequests.length > 0) {
        return (
            <div>
                <h3>Pending role requests</h3>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Unit</Table.HeaderCell>
                            <Table.HeaderCell>Role</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {roleRequests.map(req => (
                            <Table.Row key={req.roleRequestId}>
                                <Table.Cell>{req.person.firstname} {req.person.lastname}</Table.Cell>
                                <Table.Cell>{req.person.email}</Table.Cell>
                                <Table.Cell>{req.programme.name}</Table.Cell>
                                <Table.Cell>{req.role.name}</Table.Cell>
                                <Table.Cell>
                                    <ButtonGroup>
                                        <Button
                                            positive
                                            data={{
                                                roleRequestId: req.roleRequestId,
                                                granted: true
                                            }}
                                            onClick={handleGrantRole}
                                        >Yes
                                        </Button>
                                        <Button.Or />
                                        <Button
                                            negative
                                            data={{
                                                roleRequestId: req.roleRequestId,
                                                granted: false
                                            }}
                                            onClick={handleGrantRole}
                                        >No
                                        </Button>
                                    </ButtonGroup>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        )
    }
    return <h3>No pending role requests</h3>
}

export default RoleRequests
