import { Component } from 'react'
import { func } from 'prop-types'

class Interval extends Component {
    state = {
        intervalId: undefined
    }

    componentDidMount() {
        const intervalId = window.setInterval(this.props.function, this.minutes(30))
        this.setState({ intervalId })
    }

    componentWillUnmount() {
        window.clearInterval(this.state.intervalId)
    }

    minutes = howMany => howMany * 60000

    render = () => null
}

Interval.propTypes = {
    function: func.isRequired
}

export default Interval
