import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Dropzone from "react-dropzone";

import AttachmentAdder from "../../src/components/attachment/AttachmentAdder";

const defaultAttachmentAdder = <AttachmentAdder attachments={[]} removeAttachment={() => {}} addAttachment={(file) => {}} />

const limitOfOne = <AttachmentAdder attachments={[]} removeAttachment={() => {}} addAttachment={(file) => {}}  limit = {1}/>

test('has Dropzone element', t=> {
    const wrapper = shallow(defaultAttachmentAdder);
    t.is(wrapper.find(Dropzone).length, 1);
});

test('if no maximum size, header tells it', t => {
    const wrapper = shallow(defaultAttachmentAdder);
    const header = <h1>Upload attachments as much as you want</h1>;
    t.truthy(wrapper.contains(header));
})

test('header informs no files uploaded when started', t=> {
    const wrapper = shallow(defaultAttachmentAdder);
    const noElementsHeader = <h2>No attachments uploaded</h2>;
    t.truthy(wrapper.contains(noElementsHeader));
})

test('headers changes when attachment is added', t=> {
    const files = getFileList();
    const adder = <AttachmentAdder attachments={files} removeAttachment={(file) => {files.splice(file , 1)}} addAttachment={(file) => {files.push(file)}} />
    const wrapper = shallow(adder);
    const oneElementAddedHeader = <h2>One attachment uploaded:</h2>;
    t.truthy(wrapper.contains(oneElementAddedHeader));
})

test('added attachment has button so u can remove it', t => {
    const files = getFileList();
    const adder = <AttachmentAdder attachments={files} removeAttachment={(file) => {files.splice(file , 1)}} addAttachment={(file) => {files.push(file)}} />
    const wrapper = shallow(adder);
    t.truthy(wrapper.find('button').length, 1);
})

test('when button is clicked, it removes file from the list', t => {
    const files = getFileList();
    const adder = <AttachmentAdder attachments={files} removeAttachment={(file) => {files.splice(files.indexOf(file) , 1)}} addAttachment={(file) => {files.push(file)}} />
    const wrapper = shallow(adder);
    wrapper.find('button').simulate('click');

    const noElementsHeader = <h2>No attachments uploaded</h2>;
    t.truthy(files.length === 0);
    //t.truthy(wrapper.contains(noElementsHeader));
})

const getFileList = () => {
    const file = {name: "MattiLuukkainenFullStack.sql"};
    const fileArray = [file];
    return fileArray;
}

test("when limit is given, it is told", t => {
    const files = getFileList();
    const adder = <AttachmentAdder attachments={files} removeAttachment={(file) => {files.splice(files.indexOf(file) , 1)}} addAttachment={(file) => {files.push(file)}} limit = {1} />
    const wrapper = shallow(adder);
    const header = <h1>Upload maximum 1 attachments</h1>;
    t.truthy(wrapper.contains(header));
})

test("when limit is set to 1 and attachment added, dropzone is not there", t => {
    const files = getFileList();
    const adder = <AttachmentAdder attachments={files} removeAttachment={(file) => {files.splice(files.indexOf(file) , 1)}} addAttachment={(file) => {files.push(file)}} limit = {1} />
    const wrapper = shallow(adder);
    wrapper.setState({attachments: files});
    t.is(wrapper.find(Dropzone).length, 0);
})