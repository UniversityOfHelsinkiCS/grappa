import React, { Component } from 'react';

import { connect } from "react-redux";
import { updateThesis, getTheses, downloadTheses, moveTheses } from "../thesis/thesisActions";

import ThesisList from '../../components/thesis/ThesisList';

class ThesisListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredTheses: [],
        }
        this.props.getTheses();
    }

    componentDidMount() {
        document.title = "Thesis List";

    }
    componentWillReceiveProps(newProps) {
        if (newProps.theses) {
            this.setState({
                filteredTheses: this.props.theses,
            })
        }
    }


    search = (event) => {
        if (!event.target.value) {
            this.setState({ filteredTheses: this.props.theses })
            return;
        }
        const searchValue = event.target.value.toLowerCase();
        //if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        const filteredTheses = this.props.theses.filter(thesis => {
            const values = [
                thesis.authorLastname.toLowerCase(),
                thesis.authorFirstname.toLowerCase(),
                thesis.thesisTitle.toLowerCase(),
                thesis.grade.toString().toLowerCase(),
            ]
            return values.find(value => value.includes(searchValue))
        });
        this.setState({
            filteredTheses
        });
    }

    render() {
        return (
            <div>
                <br />
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" placeholder="Filter theses" onChange={this.search} />
                        <i className="search icon"></i>
                    </div>
                </div>
                <ThesisList
                    theses={this.state.filteredTheses}
                    userRoles={this.props.user.roles}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        theses: state.thesis,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getTheses() {
        dispatch(getTheses());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage);
