const reducer = (state = [], action) => {
    switch (action.type) {
        case 'AGREEMENT_GET_ALL_SUCCESS':
            //Attachments are attachments to agreement, so fetch them all.
            return action.response.attachments;
        case 'THESIS_SAVE_ONE_SUCCESS':
            //Saving thesis response has multiple fields.
            //Whilst saving a new thesis there shouldn't exist any old attachments
            return [...state, action.response.attachments];
        case 'AGREEMENT_SAVE_ONE_SUCCESS':
            //TODO update attachments when agreement is saved
            return state
        case 'ATTACHMENT_DOWNLOAD_SUCCESS':
            //TODO: refactor
            const blob = new Blob([action.response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const show = true
            if (show) { //Display
                window.location.href = url;
            } else { //Download
                const a = document.createElement('a');
                a.href = url;
                a.download = 'theses.pdf';
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            return state
        case 'ATTACHMENT_SAVE_ONE_SUCCESS':
            return [...state, ...action.response];
        case 'ATTACHMENT_DELETE_ONE_SUCCESS':
            return state.filter(attachment => attachment.attachmentId !== action.response)
        default:
            return state;
    }
};

export default reducer;
