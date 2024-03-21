import React, { Component } from 'react'
import { debounce } from 'lodash'
import { func } from 'prop-types'
import { callApi } from '../../../util/apiConnection'

class PersonSwitcher extends Component {
    state = {
        email: '',
        persons: []
    };

    handleChange = debounce(async (ev) => {
        const query = ev.target.value && ev.target.value.trim()
        if (!query || query.length < 5) return

        const { data } = await callApi(`/persons/search?search=${query}`)
        const results = data

        this.setState({ persons: results })
    }, 500)

    render() {
        const { onChange } = this.props

        return (
            <div className="ui segment" style={{ marginBottom: 10 }}>
                <div className="ui fluid input" style={{ margin: 10 }}>
                    <input
                        type="text"
                        className="search"
                        placeholder="Start typing name or email. Minimum 5 characters"
                        value={this.state.email}
                        onChange={(ev) => {
                            ev.persist()
                            this.setState({ email: ev.target.value })
                            this.handleChange(ev)
                        }}
                    />
                </div>

                <ul style={{ padding: 10, margin: 0 }}>
                    {this.state.persons.map(person => (
                        <div key={person.shibbolethId || person.personId}>
                            <button
                                style={{ margin: 5 }}
                                className="ui white button"
                                onClick={() => onChange(person.shibbolethId)}
                            >
                                {' '}
                                {person.firstname}{' '}{person.lastname}{' '}{person.email}{' '}Click to impersonate
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
        )
    }
}

PersonSwitcher.propTypes = {
    onChange: func.isRequired
}

export default PersonSwitcher
