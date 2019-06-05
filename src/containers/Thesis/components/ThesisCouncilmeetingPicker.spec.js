import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import ThesisCouncilmeetingPicker from './ThesisCouncilmeetingPicker'

const meetings = [
    {
        date: '2025-11-29T22:00:00.000Z',
        instructorDeadline: '2025-11-20T22:00:00.000Z',
        studentDeadline: '2025-11-10T22:00:00.000Z',
        programmes: [1],
        councilmeetingId: 1
    },
    {
        date: '2025-11-29T22:00:00.000Z',
        instructorDeadline: '2025-11-20T22:00:00.000Z',
        studentDeadline: '2025-11-10T22:00:00.000Z',
        programmes: [2],
        councilmeetingId: 2
    },
    {
        date: '2025-11-29T22:00:00.000Z',
        instructorDeadline: '2025-11-20T22:00:00.000Z',
        studentDeadline: '2025-11-10T22:00:00.000Z',
        programmes: [3],
        councilmeetingId: 3
    }
]
