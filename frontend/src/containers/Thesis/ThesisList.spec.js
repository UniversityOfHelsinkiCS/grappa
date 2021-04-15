import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'

import { ThesisList } from './ThesisList'


const theses = [
    {
        authorFirstname: 'Teppo',
        authorLastname: 'Testaaja',
        thesisTitle: 'Gradu yksi',
        grade: '5',
        thesisId: 1,
        printDone: false
    },
    {
        authorFirstname: 'Keijo',
        authorLastname: 'Kokeilija',
        thesisTitle: 'Gradu kaksi',
        grade: '5',
        thesisId: 2,
        printDone: false
    }
]

test('theses can be filtered', (t) => {
    const component = shallow(
        <ThesisList
            theses={theses}
            downloadSelected={() => ({})}
            markPrinted={() => ({})}
            agreements={[]}
            attachments={[]}
            showButtons
        />)

    component.find('.prompt').simulate('change', { target: { value: 'kaksi' } })
    t.is(component.state().filteredTheses.length, 1)
    t.is(component.state().filteredTheses[0].thesisId, 2)
    component.find('.prompt').simulate('change', { target: { value: '' } })
    t.is(component.state().filteredTheses.length, 2)
})
