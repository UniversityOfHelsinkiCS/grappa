import React, { Component } from 'react';

export default class PersonSelecter extends Component {

    constructor() {
        super();
        this.state = {
            searchValue: '',
            menuActive: false,
            filtered: [],
        };
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.unfocusMenu);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.unfocusMenu);
    }

    personToText = (person) => {
        return person.firstname + ' ' + person.lastname + ' ' + person.email
    }

    removePerson = (person) => () => {
        const removed = this.props.selected.filter(prsn => prsn !== person);
        this.props.changeList(removed)
    }

    addPerson = (person) => () => {
        const selected = [...this.props.selected, person];
        this.props.changeList(selected)
    }

    toggleMenu = () => {
        this.setState({ menuActive: !this.state.menuActive });
    }

    search = (event) => {
        const searchValue = event.target.value.toLowerCase();
        if (this.props.persons) {
            const filtered = this.props.persons.filter(person => {
                return this.personToText(person).toLowerCase().includes(searchValue)
            });
            this.setState({
                searchValue,
                filtered,
            });
        }
    }

    handleKeyPress = (target) => {
        // charCode 13 is ENTER
        if (target.charCode === 13) {
            const person = this.state.filtered.find(person => !this.isActivated(person));
            if (person !== undefined) {
                this.addPerson(person)();
            }
        }
    }

    focusMenu = (event) => {
        event.stopPropagation()
        this.setState({ menuActive: true });
    }

    unfocusMenu = (event) => {
        if (this.state.menuActive) {
            this.setState({ menuActive: false });
        }
    }

    isActivated(person) {
        return this.props.selected.includes(person);
    }

    renderSelected() {
        return this.props.selected.map((person, index) => {
            return (
                <a key={index} className="ui label transition visible" onFocus={this.focusMenu}>
                    {this.personToText(person)}
                    <i className="delete icon"
                        onClick={this.removePerson(person)}
                    ></i>
                </a>
            );
        })
    }

    renderSearch() {
        return <input
            className="search"
            autoComplete="off"
            tabIndex="0"
            style={{ width: '100%' }}
            value={this.state.searchValue}
            onChange={this.search}
            onKeyPress={this.handleKeyPress}
        ></input>
    }

    renderDropdown() {
        return (this.state.menuActive ?
            <div className="menu transition visible" tabIndex="-1">
                {this.props.persons ? this.props.persons.map((person, index) => {
                    if ((!this.state.searchValue || this.state.filtered.includes(person)) && !this.isActivated(person)) {
                        return (
                            <div
                                key={index}
                                className="item"
                                onClick={this.addPerson(person)}
                            >
                                {this.personToText(person)}
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="item filtered">{this.personToText(person)}</div>
                        );
                    }
                })
                    : undefined
                }
            </div>
            :
            <div className="menu transition hidden" tabIndex="-1"></div>
        )
    }

    render() {
        return (
            <div>
                <div className="ui fluid multiple search selection dropdown empty visible"
                    onMouseDown={this.focusMenu}>
                    {this.props.selected ? this.renderSelected() : undefined}
                    {this.renderSearch()}
                    {this.renderDropdown()}
                </div>
            </div>
        );
    }
}