import { shallow, mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { handleRequest } from './apiConnection';

export const mockStore = configureStore([thunk, handleRequest]);

export const shallowWithStore = (component, store) => {
    const context = {
        store
    };
    return shallow(component, { context });
};

export const mountWithStore = (component, store) => {
    const context = {
        store
    };
    return mount(component, { context });
};
