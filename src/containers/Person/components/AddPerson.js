import React, { Component } from 'react'
import { arrayOf, func, string } from 'prop-types'
import { Accordion, Form, Icon, Dropdown, Message, Button } from 'semantic-ui-react'
import { programmeType } from '../../../util/types'

const ACCORDION_OPEN = 0
const ACCORDION_CLOSED = -1

export class AddPerson extends Component {

    state = {
        activeIndex: ACCORDION_CLOSED,
        unitOptions: [],
        roleOptions: [],
        firstname: '',
        lastname: '',
        email: '',
        programmes: [],
        role: {}
    }

    componentDidMount() {
        const { programmes, roles } = this.props
        this.updateOptions(programmes)
        this.updateRoles(roles)
    }

    componentDidUpdate(prevProps) {
        const { programmes, roles } = this.props
        if (programmes !== prevProps.programmes) this.updateOptions(programmes)
        if (roles !== prevProps.roles) this.updateRoles(roles)
    }

    updateRoles = (roles) => {
        const options = []
        roles.map(role => options.push({ key: role, value: role, text: role }))
        this.setState({ roleOptions: options })
        if (options.length === 1) this.setState({ role: options[0].value })
    }

    updateOptions = (programmes) => {
        const options = []
        programmes.map(programme =>
            options.push({ key: programme.programmeId, value: programme.programmeId, text: programme.name }))
        this.setState({ unitOptions: options })
        if (options.length === 1) this.setState({ programmes: [options[0].value] })
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? ACCORDION_CLOSED : index

        this.setState({ activeIndex: newIndex })
    }


    handleInputChange = (event, data) => {
        const { value, name } = data
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (event) => {
        const { firstname, lastname, email, programmes, role } = this.state
        if (Array.isArray(programmes) && programmes.length > 0 && role &&
            firstname.length > 0 && lastname.length > 0 && email.length > 0) {
            const data = {
                firstname,
                lastname,
                email,
                programmes,
                role
            }
            this.props.addNewPerson(data)
            this.setState({
                formSubmitted: true,
                firstname: '',
                lastname: '',
                email: '',
                activeIndex: ACCORDION_CLOSED })
        } else {
            this.setState({ formSubmitted: false })
        }
        event.preventDefault()
    }

    handleDismiss = () => {
        this.setState({ formSubmitted: undefined })
    }

    submissionMessage = (sent) => {
        if (sent) {
            return (
                <Message positive onDismiss={this.handleDismiss} >
                    <Message.Header>The form was submitted successfully.</Message.Header>
                </Message>)
        }
        return (
            <Message negative onDismiss={this.handleDismiss}>
                <Message.Header>Please fill in all the fields before submitting.</Message.Header>
            </Message>)
    }

    render() {
        const { activeIndex, unitOptions, roleOptions } = this.state
        if (unitOptions.length > 0 && roleOptions.length > 0) {
            return (
                <div>
                    {this.state.formSubmitted !== undefined ?
                        this.submissionMessage(this.state.formSubmitted) : undefined}
                    <Accordion fluid styled>
                        <Accordion.Title
                            active={activeIndex === ACCORDION_OPEN}
                            index={ACCORDION_OPEN}
                            onClick={this.handleClick}
                        >
                            <Icon name="id card" />
                            Person information form
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === ACCORDION_OPEN}>
                            <Form onSubmit={this.handleSubmit} >
                                <label style={{ fontSize: '13px' }}><b>Unit</b></label>
                                {unitOptions.length > 1 ?
                                    <Dropdown
                                        name="programmes"
                                        placeholder="Select units"
                                        fluid
                                        multiple
                                        selection
                                        options={unitOptions}
                                        onChange={this.handleInputChange}
                                    /> :
                                    <Button disabled>{unitOptions[0].text}</Button>
                                }
                                <label style={{ fontSize: '13px' }}><b>Role</b></label>
                                {roleOptions.length > 1 ?
                                    <Dropdown
                                        name="role"
                                        placeholder="Select role"
                                        fluid
                                        selection
                                        options={roleOptions}
                                        onChange={this.handleInputChange}
                                    /> :
                                    <Button disabled>{roleOptions[0].text}</Button>
                                }
                                <Form.Group>
                                    <Form.Input
                                        name="firstname"
                                        label="First name"
                                        placeholder="First name"
                                        value={this.state.firstname}
                                        width={4}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Input
                                        name="lastname"
                                        label="Last name"
                                        placeholder="Last name"
                                        value={this.state.lastname}
                                        width={4}
                                        onChange={this.handleInputChange}
                                    />
                                    <Form.Input
                                        name="email"
                                        label="Email"
                                        placeholder="firstname.lastname@example.com"
                                        value={this.state.email}
                                        width={6}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Button>Add</Form.Button>
                            </Form>
                        </Accordion.Content>
                    </Accordion>
                </div>
            )
        }
        return <div>wait for it</div>
    }
}

AddPerson.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    roles: arrayOf(string).isRequired,
    addNewPerson: func.isRequired
}

export default AddPerson
