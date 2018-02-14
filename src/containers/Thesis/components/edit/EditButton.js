import React from 'react'
import { func, bool } from 'prop-types'
import { Button, GridColumn } from 'semantic-ui-react'

const EditButton = ({ toggle, allowEdit }) => {
    if (!allowEdit)
        return false

    return (
        <GridColumn>
            <Button onClick={toggle}>Edit</Button>
        </GridColumn>
    )
}

EditButton.propTypes = {
    toggle: func.isRequired,
    allowEdit: bool.isRequired
}

export default EditButton
