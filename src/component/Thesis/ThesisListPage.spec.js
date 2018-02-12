import test from 'ava';
import React from 'react';
import { mountWithStore, mockStore } from '../../util/testUtils';

import ThesisListPage from './ThesisListPage';

test('Empty thesis list renders without errors', (t) => {
    const store = mockStore({
        theses: [],
        persons: [],
        agreements: [],
        attachments: [],
        user: {
            roles: []
        }
    });

    mountWithStore(<ThesisListPage />, store);
});
