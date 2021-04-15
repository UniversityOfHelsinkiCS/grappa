import React from 'react'
import { bool, node } from 'prop-types'
import { Accordion, AccordionContent } from 'semantic-ui-react'

const ThesisFieldEdit = ({ active, children }) => (
    <Accordion>
        <Accordion.Title />
        <AccordionContent active={active}>
            {children}
        </AccordionContent>
    </Accordion>
)

ThesisFieldEdit.propTypes = {
    active: bool.isRequired,
    children: node.isRequired
}

export default ThesisFieldEdit
