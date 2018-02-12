import React from 'react';
import test from 'ava';
import { mountWithStore, mockStore } from '../../util/testUtils';
import ThesisStatisticsPage from './ThesisStatisticsPage';

test('thesis statistics page renders', (t) => {
    const stats = { 2018: { 1: { 1: { newGrades: { 1: 0, 2: 2 }, oldGrades: { Laudatur: 1 } } } } };
    const store = {
        programmes: [{ programmeId: 1, name: '' }],
        statistics: stats,
        studyfields: [{ studyfieldId: 1, programmeId: 1, name: '' }]
    };

    const component = mountWithStore(<ThesisStatisticsPage />, mockStore(store));

    t.is(component.find('table').length, 2);
});
