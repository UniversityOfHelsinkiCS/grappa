import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { saveRole, updateRole } from '../role/roleActions';

const findVisitorRole = roles => roles.find(role => role.role === 'visitor');

class UserStudyfieldSelector extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            selectedStudyfieldId: ''
        };

        this.saveStudyfieldSelection = this.saveStudyfieldSelection.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.user || !newProps.user.roles) {
            return;
        }

        const visitorRole = findVisitorRole(newProps.user.roles);

        if (visitorRole && newProps.studyfields.length > 0) {
            const studyfield = newProps.studyfields.find(studyfield => studyfield.name === visitorRole.studyfield);
            this.setState({ selectedStudyfieldId: studyfield.studyfieldId });
        }
    }

    saveStudyfieldSelection() {
        const visitorRole = findVisitorRole(this.props.user.roles);

        if (visitorRole) {
            visitorRole.studyfieldId = this.state.selectedStudyfieldId;
            this.props.updateStudyfieldSelection(visitorRole);
        } else {
            const newRole = {
                studyfieldId: this.state.selectedStudyfieldId,
                personId: this.props.user.personId,
                name: 'visitor'
            };

            this.props.saveStudyfieldSelection(newRole);
        }
    }
    
    render() {
        return (    
            <div className="">
                <div className="ui form">
                    <div className="field inline">
                        <label>Studyfield</label>
                        <select
                            className="ui dropdown"
                            onChange={(e) => this.setState({ selectedStudyfieldId: e.target.value })}
                            value={this.state.selectedStudyfieldId}
                        >
                            <option />
                            {this.props.studyfields.map(studyfield => 
                                <option
                                    key={studyfield.studyfieldId}
                                    value={studyfield.studyfieldId}
                                >
                                    {studyfield.name}
                                </option>
                            )}
                        </select>
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
    saveStudyfieldSelection: PropTypes.func.isRequired
};

const mapStateToProps = ({ studyfields, user }) => ({
    studyfields,
    user
});

const mapDispatchToProps = (dispatch) => ({
    saveStudyfieldSelection: data => dispatch(saveRole(data)),
    updateStudyfieldSelection: data => dispatch(updateRole(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStudyfieldSelector);
