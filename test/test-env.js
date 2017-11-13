import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const { document } = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;

Enzyme.configure({ adapter: new Adapter() });