import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import { Message } from 'semantic-ui-react'
import { AddOutsidePerson } from './AddOutsidePerson'

const programmes = [{ programmeId: 1, name: 'programme 1' }, { programmeId: 2, name: 'programme 2' }]

test('Outsider submission is sent when all parameters in state', (t) => {
    const handleSubmit = sinon.spy()
    const addOutsider = sinon.spy()
    const component = shallow(<AddOutsidePerson
        programmes={programmes}
        addOutsider={addOutsider}
        handleSubmit={handleSubmit}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    component.setState({ firstname: 'Ding', lastname: 'Dong', email: 'dd@gg.bet', units: [1, 2] })
    component.instance().handleSubmit(event)

    t.truthy(addOutsider.calledOnce)
    t.truthy(component.state('formSubmitted'))
})

test('Outsider submission is not sent when all parameters not provided', (t) => {
    const addOutsider = sinon.spy()
    const component = shallow(<AddOutsidePerson
        programmes={programmes}
        addOutsider={addOutsider}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    component.setState({ firstname: '', lastname: 'Dong', email: 'dd@gg.bet', units: [1, 2] })
    component.instance().handleSubmit(event)
    t.truthy(addOutsider.notCalled)
    t.falsy(component.state('formSubmitted'))

    component.setState({ firstname: 'Ding', lastname: '', email: 'dd@gg.bet', units: [1, 2] })
    component.instance().handleSubmit(event)
    t.truthy(addOutsider.notCalled)

    component.setState({ firstname: 'Ding', lastname: 'Dong', email: '', units: [1, 2] })
    component.instance().handleSubmit(event)
    t.truthy(addOutsider.notCalled)

    component.setState({ firstname: 'Ding', lastname: 'Dong', email: 'dd@gg.bet', units: [] })
    component.instance().handleSubmit(event)
    t.truthy(addOutsider.notCalled)
})

test('Outsider submission is not sent when units is not an array', (t) => {
    const addOutsider = sinon.spy()
    const component = shallow(<AddOutsidePerson
        programmes={programmes}
        addOutsider={addOutsider}
    />)
    const event = {}
    event.preventDefault = () => {
        // console.log('prevented')
    }
    component.setState({ firstname: '', lastname: 'Dong', email: 'dd@gg.bet', units: 1 })
    component.instance().handleSubmit(event)
    t.truthy(addOutsider.notCalled)
    t.falsy(component.state('formSubmitted'))
})

test('Submission message is presented if the submission has been attempted', (t) => {
    const message = sinon.spy()
    const component = shallow(<AddOutsidePerson
        programmes={programmes}
        submissionMessage={message}
        addOutsider={() => {}}
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
