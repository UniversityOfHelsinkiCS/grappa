import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { personType } from '../../util/types';
import { updateVisitorRoles } from '../role/roleActions';

const findVisitorRoles = roles => roles.filter(role => role.role === 'visitor');

class UserStudyfieldSelector extends Component {
    
    constructor(props) {
        super(props);

        const selectedStudyfields = props.user.roles ? findVisitorRoles(props.user.roles).map(role => role.studyfieldId) : [];

        this.state = { selectedStudyfields };

        this.saveStudyfieldSelection = this.saveStudyfieldSelection.bind(this);
        this.selectionUpdated = this.selectionUpdated.bind(this);
        this.isStudyfieldChecked = this.isStudyfieldChecked.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.user || !newProps.user.roles) {
            return;
        }
        const selectedStudyfields = findVisitorRoles(newProps.user.roles).map(role => role.studyfieldId);

        this.setState({ selectedStudyfields });
    }

    isStudyfieldChecked(studyfieldId) {
        return this.state.selectedStudyfields.includes(studyfieldId);
    }

    selectionUpdated(event) {
        const value = Number(event.target.value);
        const studyfields = new Set(this.state.selectedStudyfields);
        const nextState = event.target.checked ? studyfields.add(value) : studyfields.delete(value);
        this.setState({ selectedStudyfields: Array.from(nextState) });
    }

    saveStudyfieldSelection() {
        this.props.saveStudyfieldSelection({
            studyfieldIds: this.state.selectedStudyfields
        });
    }
    
    render() {
        return (    
            <div className="">
                <div className="ui form">
                    <div className="field inline">
                        <label>Studyfield</label>

                        {this.props.studyfields.map(studyfield => (
                            <div key={studyfield.studyfieldId} className="ui filed">
                                <div className="ui checkbox">
                                    <input
                                        type="checkbox"
                                        value={studyfield.studyfieldId}
                                        id={`studyfield-${studyfield.studyfieldId}`}
                                        onChange={this.selectionUpdated}
                                        defaultChecked={this.isStudyfieldChecked(studyfield.studyfieldId)}
                                    />
                                    <label htmlFor={`studyfield-${studyfield.studyfieldId}`}> {studyfield.name}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="ui primary button"
                        onClick={this.saveStudyfieldSelection}
                    >
                        Save studyfield
                    </button>
                </div>
            </div>
        );
    }
}

UserStudyfieldSelector.propTypes = {
    studyfields: PropTypes.array.isRequired,
    saveStudyfieldSelection: PropTypes.func.isRequired,
    user: personType.isRequired
};

const mapStateToProps = ({ studyfields, user }) => ({
    studyfields,
    user
});

const mapDispatchToProps = (dispatch) => ({
    saveStudyfieldSelection: data => dispatch(updateVisitorRoles(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStudyfieldSelector);
