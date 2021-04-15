import React from 'react'
import { func, bool, string } from 'prop-types'
import { Form } from 'semantic-ui-react'
import ThesisFieldEdit from './ThesisFieldEdit'

const TextEdit = ({ value, handleChange, active }) => (
    <ThesisFieldEdit active={active}>
        <Form>
            <Form.Field>
                <input value={value} onChange={handleChange} />
            </Form.Field>
        </Form>
    </ThesisFieldEdit>
)

TextEdit.propTypes = {
    value: string.isRequired,
    handleChange: func.isRequired,
    active: bool.isRequired
}

export default TextEdit
