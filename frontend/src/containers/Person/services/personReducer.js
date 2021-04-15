const reducer = (state = [], action) => {
    switch (action.type) {
        case 'PERSON_GET_ALL_SUCCESS':
            return action.response.persons
        case 'ROLE_DELETE_ONE_SUCCESS': {
            const { person } = action.response
            const persons = state.filter(oldPerson => oldPerson.personId !== person.personId)
            persons.push(person)
            return persons
        }
        case 'ROLE_SAVE_ONE_SUCCESS': {
            const { person } = action.response
            const persons = state.filter(oldPerson => oldPerson.personId !== person.personId)
            persons.push(person)
            return persons
        }
        case 'PERSON_INVITE_ONE_SUCCESS':
            return [...state, action.response.person]
        default:
            return state
    }
}

export default reducer
