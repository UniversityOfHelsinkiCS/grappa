import React, { Component } from 'react'
//import { connect } from 'react-redux'
import { arrayOf, func } from 'prop-types'
import { Accordion, Form, Icon, Dropdown, Message, Button } from 'semantic-ui-react'
//import { addOutsider } from '../services/personActions'
import { programmeType } from '../../../util/types'

const ACCORDION_OPEN = 0
const ACCORDION_CLOSED = -1

export class AddOutsidePerson extends Component {

    state = {
        activeIndex: ACCORDION_CLOSED,
        unitOptions: [],
        firstname: '',
        lastname: '',
        email: '',
        units: []
    }

    componentDidMount() {
        const { programmes } = this.props
        const options = []
        programmes.map(programme => options.push({ key: programme.programmeId, value: programme.programmeId, text: programme.name }))
        this.setState({ unitOptions: options })
        console.log(this.state.unitOptions)
        if (options.length === 1) this.setState({ units: options })
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
        const { firstname, lastname, email, units } = this.state
        const data = {
            firstname,
            lastname,
            email,
            units
        }
        if (Array.isArray(units) && units.length > 0 && firstname.length > 0 && lastname.length > 0 && email.length > 0) {
            this.props.addOutsider(data)
            this.setState({ formSubmitted: true })
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
        const { activeIndex, unitOptions } = this.state
        if (unitOptions.length > 0) {
            return (
                <div>
                    {this.state.formSubmitted !== undefined ? this.submissionMessage(this.state.formSubmitted) : undefined}
                    <Accordion fluid styled>
                        <Accordion.Title active={activeIndex === ACCORDION_OPEN} index={ACCORDION_OPEN} onClick={this.handleClick}>
                            <Icon name="id card" />
                            Person information form
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === ACCORDION_OPEN}>
                            <Form onSubmit={this.handleSubmit} >
                                {unitOptions.length > 1 ?
                                    <Dropdown name="units" placeholder="Select units" fluid multiple selection options={unitOptions} onChange={this.handleInputChange} /> :
                                    <Button disabled>{unitOptions[0].text}</Button>
                                }
                                <Form.Group>
                                    <Form.Input name="firstname" label="First name" placeholder="First name" width={4} onChange={this.handleInputChange} />
                                    <Form.Input name="lastname" label="Last name" placeholder="Last name" width={4} onChange={this.handleInputChange} />
                                    <Form.Input name="email" label="Email" placeholder="firstname.lastname@example.com" width={6} onChange={this.handleInputChange} />
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

//const mapDispatchToProps = dispatch => ({
//    addOutsider(data) {
//        dispatch(addOutsider(data))
//    }
//})

AddOutsidePerson.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    addOutsider: func.isRequired
}

export default AddOutsidePerson
