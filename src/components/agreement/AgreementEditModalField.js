import React, { Component } from 'react';

class AgreementEditModalField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content
        }
    }

    handleChange = (e) => {
        this.setState(
            {
                content: e.target.value
            }
        );
        this.props.onChange(this.props.fieldName, e.target.value);
    }

    resetContent = (e) => {
        var originalContent = this.props.originalContent;
        this.setState(
            {
                content: originalContent
            }
        );
        e.preventDefault();
        this.props.onChange(this.props.fieldName, originalContent);
    }

    render() {
        if (this.props.textField) {
            return (
                <div style={{flex: 1}}>
                    <div className="field ui" style={{fontSize: 15, fontWeight: "bold", flex: 1}}>
                        <label key={ this.props.fieldName + "label" }>{ this.props.fieldName }</label>
                        <textarea rows="2" style={{flex: 2.5}} key={ this.props.fieldName + "key" } name={ this.props.fieldName } type="text" value={ this.state.content } onChange={ this.handleChange } />
                    </div>
                    <button className="ui right floated primary button" onClick={ this.resetContent }>reset</button>
                </div>
            );
        } else {
            return (
              <div className="two fields" style={{flex: 1}}>
                  <div className="field ui" style={{fontWeight: "bold", flex: 1}}>{ this.props.fieldName }</div>
                  <div className="field ui input required" style={{flex: 2.5}}>
                      <input key={ this.props.fieldName + "key" } name={ this.props.fieldName } type="text" value={ this.state.content } onChange={ this.handleChange } />
                      <button className="ui primary button" onClick={ this.resetContent }>reset</button>
                  </div>
              </div>
            );
        }
    }
}

export default AgreementEditModalField;
