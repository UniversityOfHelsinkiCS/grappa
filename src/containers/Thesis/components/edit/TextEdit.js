import React from 'react'
import { func, bool, string } from 'prop-types'
import { Button, Form } from 'semantic-ui-react'
import ThesisFieldEdit from './ThesisFieldEdit'

const TextEdit = ({ value, handleChange, save, active }) => (
    <ThesisFieldEdit active={active}>
        <Form>
            <Form.Field>
                <input value={value} onChange={handleChange} />
                <Button onClick={save}>Save</Button>
            </Form.Field>
        </Form>
    </ThesisFieldEdit>
)

TextEdit.propTypes = {
    value: string.isRequired,
    handleChange: func.isRequired,
    save: func.isRequired,
    active: bool.isRequired
}

export default TextEdit
