import React from 'react'
import { string, node } from 'prop-types'
import { GridColumn } from 'semantic-ui-react'

const ThesisValueField = ({ title, children }) => (
    <GridColumn>
        <h3 className="ui sub header">{title}</h3>
        {children}
    </GridColumn>
)

ThesisValueField.propTypes = {
    title: string.isRequired,
    children: node.isRequired
}

export default ThesisValueField
