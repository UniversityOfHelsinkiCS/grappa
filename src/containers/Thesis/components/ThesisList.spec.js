import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import ThesisList from './ThesisList'

const thesis = {
    authorFirstname: 'Teppo',
    authorLastname: 'Testaaja',
    thesisTitle: 'Gradu',
    grade: '5',
    thesisId: 1,
    printDone: false
}
const thesisList = [thesis]
const thesisApp = (<ThesisList
    theses={thesisList}
    downloadSelected={() => ({})}
    attachments={[]}
    agreements={[]}
    showButtons
    markPrinted={() => ({})}
/>)
const wrapper = shallow(thesisApp)

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

test('should have a table element', (t) => {
    t.is(wrapper.find('table').length, 1)
})

test('should have 2 tr elements', (t) => {
    t.is(wrapper.find('tr').length, 2)
})

test('theses can be filtered', (t) => {
    const component = mount(
        <MemoryRouter>
            <ThesisList
                theses={theses}
                downloadSelected={() => ({})}
                markPrinted={() => ({})}
                agreements={[]}
                attachments={[]}
                showButtons
            />
        </MemoryRouter>)

    component.find('.prompt').simulate('change', { target: { value: 'kaksi' } })
    t.is(component.find('a[href="/thesis/2"]').length, 1)
    t.is(component.find('a[href="/thesis/1"]').length, 0)
    component.find('.prompt').simulate('change', { target: { value: '' } })
    t.is(component.find('a[href="/thesis/1"]').length, 1)
})

test('theses can be selected to download', (t) => {
    const agreements = [
        {
            agreementId: 1,
            thesisId: 1
        }
    ]
    const attachments = [
        {
            attachmentId: 1,
            agreementId: 1,
            label: 'thesisFile'
        }
    ]

    const download = sinon.spy()
    const component = mount(
        <MemoryRouter>
            <ThesisList
                theses={theses}
                downloadSelected={download}
                markPrinted={() => ({})}
                agreements={agreements}
                attachments={attachments}
                showButtons
            />
        </MemoryRouter>)

    component.find('input[type="checkbox"]').at(2).simulate('change', { target: { checked: true } })
    component.find('.orange').simulate('click')

    t.true(download.called)
    t.is(download.args[0][0].length, 2)
})
