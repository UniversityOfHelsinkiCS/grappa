import test from 'ava';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { NavBar } from '../src/containers/NavBar';

test('NavBar has elements for admin', (t) => {
    const wrapper = shallow(
        <NavBar
            user={{ roles: [{ role: 'admin' }] }}
            login={() => { }}
            getPersons={() => {}}
            history={{ push: () => { } }}
            getAgreements={sinon.spy()}
            getCouncilmeetings={sinon.spy()}
            getEmailDrafts={sinon.spy()}
            getNotifications={sinon.spy()}
            getProgrammes={sinon.spy()}
            getStudyfields={sinon.spy()}
            getTheses={sinon.spy()}
        />);
    t.truthy(wrapper.find('NavLink').length > 0);
});
