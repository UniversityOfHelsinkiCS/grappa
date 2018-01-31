import test from 'ava';
import React from 'react';
import { mountWithStore, mockStore } from '../testUtils';

import ThesisListPage from '../../src/containers/thesis/ThesisListPage';

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
