import React, { Component } from 'react';
import FormSection from './FormSection';

export default class FormCreator extends Component {
    getLastAction() {
        const forReturn = this.props.accessToStore[this.props.accessToStore.length - 1];

        return (forReturn === undefined ? {} : forReturn);
    }

    getButton(clickFunc) {
        // next line doesn't work, why? (TODO)
        // const lastAction = this.getLastAction();
        const lastAction = undefined;
        const workableButton = <button className="ui primary button" type="submit" onClick={clickFunc}>Save</button>;
        const disabledLoadingButton = <button className="ui primary disabled loading button" type="submit" onClick={clickFunc}>Save</button>;

        if (lastAction === undefined) return workableButton;

        return (lastAction.id === 'AGREEMENT_SAVE_ATTEMPT') ? disabledLoadingButton : workableButton;
    }

    createForm = () => {
        const formFieldProperties = this.props.formFieldInfo;

        const sectionList = formFieldProperties.sections.map(
            (sectionData, sectionKey) => (<FormSection
                sectionKey={sectionKey}
                header={sectionData.header}
                elements={sectionData.fields}
                fieldOnChangeFunc={this.props.fieldOnChangeFunc}
            />));

        return (
            <form className="ui form" onSubmit={this.props.onSubmitFunc} >
                {sectionList}
                <br />
                {this.getButton(this.props.buttonOnClickFunc)}
                <br />

            </form>
        );
    }

    render() {
        return <div>{this.createForm()}</div>;
    }
}
