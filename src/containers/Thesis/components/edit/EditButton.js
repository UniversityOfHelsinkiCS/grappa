import React from 'react'
import { func, bool } from 'prop-types'
import { Button, GridColumn } from 'semantic-ui-react'
import { noop } from 'lodash/noop'

const EditButton = ({ toggle, allowEdit, active, save, noSave }) => {
    if (!allowEdit)
        return false

    return (
        <GridColumn>
            <Button onClick={toggle}>
                {active ? 'Cancel' : 'Edit'}
            </Button>
            {active && !noSave ? <Button onClick={save}>Save</Button> : null}
        </GridColumn>
    )
}

EditButton.propTypes = {
    toggle: func.isRequired,
    allowEdit: bool.isRequired,
    save: func,
    active: bool.isRequired,
    noSave: bool
}

EditButton.defaultProps = {
    noSave: false,
    save: noop
}

export default EditButton
