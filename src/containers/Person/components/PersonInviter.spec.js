import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { mount } from 'enzyme'
import PersonInviter from './PersonInviter'

const roles = [{ roleId: 1, name: 'role1' }, { roleId: 2, name: 'role2' }]
const programmes = [{ programmeId: 1, name: 'programme 1' }, { programmeId: 2, name: 'programme 2' }]

test('person can be invited to Grappa', (t) => {
    const handler = sinon.spy()
    const component = mount(
        <PersonInviter
            handleSendInvite={handler}
            roles={roles}
            programmes={programmes}
        />)

    component.find('select').at(0).simulate('change', { target: { value: 1 } })
    component.find('select').at(1).simulate('change', { target: { value: 1 } })
    component.find('input').at(0).simulate('change', { target: { value: 'foo@bar.com' } })
    component.find('button.green').simulate('click')

    t.true(handler.called)
    t.deepEqual(handler.args[0], [1, 1, 'foo@bar.com'])
})
