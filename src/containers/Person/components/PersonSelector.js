import React, { Component } from 'react'
import { arrayOf, bool, func } from 'prop-types'
import { personType } from '../../../util/types'

export default class PersonSelector extends Component {
    constructor() {
        super()
        this.state = {
            searchValue: '',
            menuActive: false,
            filtered: []
        }
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.unfocusMenu)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.unfocusMenu)
    }

    personToText = person => `${person.firstname} ${person.lastname} ${person.email}`;

    removePerson = person => () => {
        if (this.props.allowEdit) {
            const removed = this.props.selected.filter(prsn => prsn !== person)
            this.props.changeList(removed)
        }
    };

    addPerson = person => () => {
        const selected = [...this.props.selected, person]
        this.props.changeList(selected)
    };

    toggleMenu = () => {
        this.setState({ menuActive: !this.state.menuActive })
    };

    search = (event) => {
        const searchValue = event.target.value.toLowerCase()
        if (this.props.persons) {
            const getPersonName = person => this.personToText(person).toLowerCase()
            const filtered = this.props.persons.filter(person => getPersonName(person).includes(searchValue))

            this.setState({
                searchValue,
                filtered
            })
        }
    };

    handleKeyPress = (target) => {
        // charCode 13 is ENTER
        if (target.charCode === 13) {
            const person = this.state.filtered.find(p => !this.isActivated(p))
            if (person !== undefined) {
                this.addPerson(person)()
            }
        }
    };

    focusMenu = (event) => {
        event.stopPropagation()
        if (this.props.allowEdit)
            this.setState({ menuActive: true })
    };

    unfocusMenu = () => {
        if (this.state.menuActive) {
            this.setState({ menuActive: false })
        }
    };

    isActivated(person) {
        return this.props.selected.includes(person)
    }

    shouldRenderPerson(person) {
        return (!this.state.searchValue || this.state.filtered.includes(person)) && !this.isActivated(person)
    }

    renderSelected() {
        return this.props.selected.map(person => (
            <span key={person.personId} className="ui label transition visible" onFocus={this.focusMenu}>
                {this.personToText(person)}
                <i
                    className="delete icon"
                    onClick={this.removePerson(person)}
                />
            </span>
        ))
    }

    renderSearch() {
        return (<input
            className="search"
            autoComplete="off"
            tabIndex="0"
            style={{ width: '100%' }}
            value={this.state.searchValue}
            onChange={this.search}
            onKeyPress={this.handleKeyPress}
            disabled={!this.props.allowEdit}
        />)
    }

    renderDropdown() {
        return (this.state.menuActive ?
            <div className="menu transition visible" tabIndex="-1">
                {this.props.persons ? this.props.persons.map((person) => {
                    if (this.shouldRenderPerson(person)) {
                        return (
                            <div
                                key={person.personId}
                                className="item"
                                onClick={this.addPerson(person)}
                            >
                                {this.personToText(person)}
                            </div>
                        )
                    }
                    return (
                        <div key={person.personId} className="item filtered">{this.personToText(person)}</div>
                    )
                })
                    : undefined
                }
            </div>
            :
            <div className="menu transition hidden" tabIndex="-1" />
        )
    }

    render() {
        const errorClass = this.props.validationError ? 'error' : ''
        const className = `ui fluid multiple search selection dropdown empty visible ${errorClass}`

        return (
            <div>
                <div
                    className={className}
                    onMouseDown={this.focusMenu}
                >
                    {this.props.selected ? this.renderSelected() : undefined}
                    {this.renderSearch()}
                    {this.renderDropdown()}
                </div>
            </div>
        )
    }
}

PersonSelector.propTypes = {
    persons: arrayOf(personType).isRequired,
    selected: arrayOf(personType).isRequired,
    changeList: func.isRequired,
    validationError: bool,
    allowEdit: bool
}

PersonSelector.defaultProps = {
    validationError: false,
    allowEdit: true
}
