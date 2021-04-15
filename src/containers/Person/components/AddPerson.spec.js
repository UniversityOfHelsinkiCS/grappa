import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import { Message } from 'semantic-ui-react'
import { AddPerson } from './AddPerson'

const programmes = [{ programmeId: 1, name: 'programme 1' }, { programmeId: 2, name: 'programme 2' }]
const roles = ['grader', 'manager', 'print_person']

test('Outsider submission is sent when all parameters in state', (t) => {
    const handleSubmit = sinon.spy()
    const addNewPerson = sinon.spy()
    const component = shallow(<AddPerson
        programmes={programmes}
        roles={roles}
        addNewPerson={addNewPerson}
        handleSubmit={handleSubmit}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    component.setState({ firstname: 'Ding', lastname: 'Dong', email: 'dd@gg.bet', programmes: [1, 2], role: 'grader' })
    component.instance().handleSubmit(event)

    t.truthy(addNewPerson.calledOnce)
    t.truthy(component.state('formSubmitted'))
})

test('Outsider submission is not sent when all parameters not provided', (t) => {
    const addNewPerson = sinon.spy()
    const component = shallow(<AddPerson
        roles={roles}
        programmes={programmes}
        addNewPerson={addNewPerson}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    component.setState({ firstname: '', lastname: 'Dong', email: 'dd@gg.bet', programmes: [1, 2], role: 'grader' })
    component.instance().handleSubmit(event)
    t.truthy(addNewPerson.notCalled)
    t.falsy(component.state('formSubmitted'))

    component.setState({ firstname: 'Ding', lastname: '', email: 'dd@gg.bet', programmes: [1, 2] })
    component.instance().handleSubmit(event)
    t.truthy(addNewPerson.notCalled)

    component.setState({ firstname: 'Ding', lastname: 'Dong', email: '', programmes: [1, 2] })
    component.instance().handleSubmit(event)
    t.truthy(addNewPerson.notCalled)

    component.setState({ firstname: 'Ding', lastname: 'Dong', email: 'dd@gg.bet', programmes: [] })
    component.instance().handleSubmit(event)
    t.truthy(addNewPerson.notCalled)
})

test('Outsider submission is not sent when units is not an array', (t) => {
    const addNewPerson = sinon.spy()
    const component = shallow(<AddPerson
        roles={roles}
        programmes={programmes}
        addNewPerson={addNewPerson}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    component.setState({ firstname: '', lastname: 'Dong', email: 'dd@gg.bet', programmes: 1 })
    component.instance().handleSubmit(event)
    t.truthy(addNewPerson.notCalled)
    t.falsy(component.state('formSubmitted'))
})

test('Submission message is presented if the submission has been attempted', (t) => {
    const message = sinon.spy()
    const component = shallow(<AddPerson
        roles={roles}
        programmes={programmes}
        submissionMessage={message}
        addNewPerson={() => {}}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    t.is(component.state('formSubmitted'), undefined)
    t.is(component.find(Message).length, 0)

    component.setState({ formSubmitted: true })
    component.update()
    t.is(component.find(Message).length, 1)
    t.truthy(component.find(Message).props().positive)

    component.setState({ formSubmitted: false })
    component.update()
    t.is(component.find(Message).length, 1)
    t.truthy(component.find(Message).props().negative)
})
