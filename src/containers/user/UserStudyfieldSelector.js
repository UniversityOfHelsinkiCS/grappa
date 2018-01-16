import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { personType } from '../../util/types';
import { updateVisitorRoles } from '../role/roleActions';

const findVisitorRoles = roles => roles.filter(role => role.role === 'visitor');

class UserStudyfieldSelector extends Component {

    constructor(props) {
        super(props);

        const selectedStudyfields = props.user.roles ? findVisitorRoles(props.user.roles).map(role => role.programmeId) : [];

        this.state = { selectedStudyfields };

        this.saveStudyfieldSelection = this.saveStudyfieldSelection.bind(this);
        this.selectionUpdated = this.selectionUpdated.bind(this);
        this.isStudyfieldChecked = this.isStudyfieldChecked.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.user || !newProps.user.roles) {
            return;
        }
        const selectedStudyfields = findVisitorRoles(newProps.user.roles).map(role => role.programmeId);

        this.setState({ selectedStudyfields });
    }

    isStudyfieldChecked(programmeId) {
        return this.state.selectedStudyfields.includes(programmeId);
    }

    selectionUpdated(event) {
        const value = Number(event.target.value);
        const programmes = new Set(this.state.selectedStudyfields);
        const nextState = event.target.checked ? programmes.add(value) : programmes.delete(value);
        this.setState({ selectedStudyfields: Array.from(nextState) });
    }

    saveStudyfieldSelection() {
        this.props.saveStudyfieldSelection({
            programmeIds: this.state.selectedStudyfields
        });
    }

    render() {
        return (
            <div className="">
                <div className="ui form">
                    <div className="field inline">
                        <label>Studyfield</label>

                        {this.props.programmes.map(programme => (
                            <div key={programme.programmeId} className="ui filed">
                                <div className="ui checkbox">
                                    <input
                                        type="checkbox"
                                        value={programme.programmeId}
                                        id={`programme-${programme.programmeId}`}
                                        onChange={this.selectionUpdated}
                                        defaultChecked={this.isStudyfieldChecked(programme.programmeId)}
                                    />
                                    <label htmlFor={`programme-${programme.programmeId}`}> {programme.name}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="ui primary button"
                        onClick={this.saveStudyfieldSelection}
                    >
                        Save programme
                    </button>
                </div>
            </div>
        );
    }
}

UserStudyfieldSelector.propTypes = {
    programmes: PropTypes.array.isRequired,
    saveStudyfieldSelection: PropTypes.func.isRequired,
    user: personType.isRequired
};

const mapStateToProps = ({ programmes, user }) => ({
    programmes,
    user
});

const mapDispatchToProps = (dispatch) => ({
    saveStudyfieldSelection: data => dispatch(updateVisitorRoles(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStudyfieldSelector);
