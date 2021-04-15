import test from 'ava'
import React from 'react'
import { mountWithStore, mockStore } from '../../util/testUtils'

import ThesisListPage from './ListPage'

test('Empty thesis list renders without errors', () => {
    const store = mockStore({
        theses: [],
        persons: [],
        agreements: [],
        attachments: [],
        user: {
            roles: []
        }
    })

    mountWithStore(<ThesisListPage />, store)
})
