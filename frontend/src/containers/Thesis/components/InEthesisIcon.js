import React, { useState, useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { callApi } from '../../../util/apiConnection'

const InEthesisIcon = ({ title, authors }) => {
  const [state, setState] = useState(undefined)

  const updateState = async () => {
    try {
      const authorsString = authors.filter(a => a.firstname !== undefined).map(a => `${a.firstname}+${a.lastname}`).join(' ')
      const { data } = await callApi(`/theses/in_ethesis?title=${title}&authors=${authorsString}`)
      setState(data.found)
    } catch (err) {
      setState(false)
    }
  }

  useEffect(() => {
    updateState()
  }, [])

  return (
    <div>
      {state === false && <Icon color="red" name="remove" />}
      {state === true && <Icon color="green" name="checkmark" />}
    </div>
  )
}

export default InEthesisIcon
