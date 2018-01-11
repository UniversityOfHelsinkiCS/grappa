import React from 'react';
import { string, shape, bool, func } from 'prop-types';
import { connect } from 'react-redux';


import { acceptThesis } from './inviteAction';
import { Redirect } from 'react-router';

const InvitePage = ({ acceptThesis, match, status }) => {
    const token = match.params.token;

    if (!status && match.params.type === 'thesis') {
        acceptThesis(token);
    }

    if (status) {
        return <Redirect to="/" />;
    }

    return(
        <div />
    );
};

const mapStateToProps = ({ invite }) => ({
    status: invite
});

const mapDispatchToProps = (dispatch) => ({
    acceptThesis: token => dispatch(acceptThesis(token))
});

InvitePage.propTypes = {
    match: shape({
        params: shape({
            token: string.isRequired,
            type: string.isRequired
        }).isRequired
    }).isRequired,
    status: bool.isRequired,
    acceptThesis: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitePage);
