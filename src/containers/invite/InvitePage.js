import React from 'react';
import { string, shape, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { acceptThesis } from './inviteAction';

const InvitePage = ({ acceptThesisAction, match, status }) => {
    const token = match.params.token;

    if (!status && match.params.type === 'thesis') {
        acceptThesisAction(token);
    }

    if (status) {
        return <Redirect to="/" />;
    }

    return (
        <div />
    );
};

const mapStateToProps = ({ invite }) => ({
    status: invite
});

const mapDispatchToProps = dispatch => ({
    acceptThesisAction: token => dispatch(acceptThesis(token))
});

InvitePage.propTypes = {
    match: shape({
        params: shape({
            token: string.isRequired,
            type: string.isRequired
        }).isRequired
    }).isRequired,
    status: bool.isRequired,
    acceptThesisAction: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitePage);
