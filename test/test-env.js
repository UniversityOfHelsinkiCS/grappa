import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const { window } = (new JSDOM('<!doctype html><html><body></body></html>'));
global.document = window.document;
global.window = window;
global.navigator = {
    userAgent: 'node.js'
};

Enzyme.configure({ adapter: new Adapter() });
