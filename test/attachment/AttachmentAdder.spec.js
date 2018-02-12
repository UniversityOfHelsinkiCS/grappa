import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Dropzone from 'react-dropzone';

import AttachmentAdder from '../../src/component/Attachment/components/AttachmentAdder';

const defaultAttachmentAdder = (<AttachmentAdder
    attachments={[]}
    removeAttachment={() => {}}
    addAttachment={() => {}}
    changeList={sinon.spy()}
/>);

const getFileList = () => [{ name: 'MattiLuukkainenFullStack.sql' }];

test('has Dropzone element', (t) => {
    const wrapper = shallow(defaultAttachmentAdder);
    t.is(wrapper.find(Dropzone).length, 1);
});

test('header informs no files uploaded when started', (t) => {
    const wrapper = shallow(defaultAttachmentAdder);
    const noElementsHeader = 'No attachments to be uploaded';
    t.truthy(wrapper.contains(noElementsHeader));
})

test('headers changes when attachment is added', (t) => {
    const files = getFileList();
    const adder = (<AttachmentAdder
        attachments={files}
        removeAttachment={(file) => { files.splice(file, 1) }}
        addAttachment={(file) => { files.push(file) }}
        changeList={sinon.spy()}
    />);
    const wrapper = shallow(adder);
    const oneElementAddedHeader = 'One attachment to be uploaded:';
    t.truthy(wrapper.contains(oneElementAddedHeader));
})

test('added attachment has button so u can remove it', (t) => {
    const files = getFileList();
    const adder = (<AttachmentAdder
        attachments={files}
        removeAttachment={(file) => { files.splice(file, 1) }}
        addAttachment={(file) => { files.push(file) }}
        changeList={sinon.spy()}
    />);
    const wrapper = shallow(adder);
    t.truthy(wrapper.find('button').length, 1);
})

test('when button is clicked, it removes file from the list', (t) => {
    let files = getFileList();
    const adder = (<AttachmentAdder
        attachments={files}
        removeAttachment={(file) => { files.splice(files.indexOf(file), 1) }}
        addAttachment={(file) => { files.push(file) }}
        changeList={attachments => files = attachments}
    />)
    const wrapper = shallow(adder);
    wrapper.find('button').simulate('click');
    wrapper.update();

    // const noElementsHeader = <h2>No attachments uploaded</h2>;
    t.truthy(files.length === 0);
    // t.truthy(wrapper.contains(noElementsHeader));
})

test('when limit is set to 1 and attachment added, dropzone is not there', (t) => {
    const files = getFileList();
    const adder = (<AttachmentAdder
        attachments={files}
        removeAttachment={(file) => { files.splice(files.indexOf(file), 1) }}
        addAttachment={(file) => { files.push(file) }}
        limit={1}
        changeList={sinon.spy()}
    />)
    const wrapper = shallow(adder);
    wrapper.setState({ attachments: files });
    t.is(wrapper.find(Dropzone).length, 0);
})
