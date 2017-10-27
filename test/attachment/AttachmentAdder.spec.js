import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Dropzone from "react-dropzone";

import AttachmentAdder from "../../src/components/attachment/AttachmentAdder";

require('ignore-styles')

const defaultAttachmentAdder = <AttachmentAdder sendChange = {(file) => {}} />

test('has Dropzone element', t=> {
    const wrapper = shallow(defaultAttachmentAdder);
    t.is(wrapper.find(Dropzone).length, 1);
});

test('header informs no fiels uploaded when started', t=> {
    const wrapper = shallow(defaultAttachmentAdder);
    const noElementsHeader = <h2>No attachments uploaded</h2>;
    t.truthy(wrapper.contains(noElementsHeader));
})

test('headers changes when attachment is added', t=> {

    const wrapper = shallow(defaultAttachmentAdder);
    const files = getFileList();
    wrapper.setState({attachments: files});
    const oneElementAddedHeader = <h2>One attachment uploaded:</h2>;
    t.truthy(wrapper.contains(oneElementAddedHeader));
})

test('added attachment has button so u can remove it', t => {
    const wrapper = shallow(defaultAttachmentAdder);
    const files = getFileList();
    wrapper.setState({attachments: files});
    t.truthy(wrapper.find('button').length, 1);
})

test('when button is clicked, it tells u no attachments uploaded', t => {
    const wrapper = shallow(defaultAttachmentAdder);
    const files = getFileList();
    wrapper.setState({attachments: files});
    wrapper.find('button').simulate('click');

    const noElementsHeader = <h2>No attachments uploaded</h2>;
    t.truthy(wrapper.contains(noElementsHeader));
})


const getFileList = () => {
    const file = {name: "MattiLuukkainenFullStack.sql"};
    const fileArray = [file];
    return fileArray;
}