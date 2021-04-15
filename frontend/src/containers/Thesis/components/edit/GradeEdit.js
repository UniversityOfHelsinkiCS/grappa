import React from 'react'
import { arrayOf, string, func, object } from 'prop-types'
import { gradeFields, oldGradeFields } from '../../../../util/theses'
import { programmeType, studyfieldType } from '../../../../util/types'

const GradeEdit = (
    {
        programmeId,
        studyfieldId,
        grade,
        programmes,
        studyfields,
        programmeData,
        changeProgramme,
        changeStudyfield,
        changeGrade
    }
) => (
    <div>
        <select value={programmeId} onChange={changeProgramme}>
            {programmes.map(programme => (
                <option key={programme.programmeId} value={programme.programmeId}>
                    {programme.name}
                </option>
            ))}
        </select>
        <select value={studyfieldId} onChange={changeStudyfield}>
            <option />
            {studyfields
                .filter(field => field.programmeId === programmeId)
                .map(field => (
                    <option key={field.studyfieldId} value={field.studyfieldId}>{field.name}</option>
                ))}
        </select>
        <select value={grade} onChange={changeGrade}>
            {programmeData.programme.name.includes('Department') ?
                oldGradeFields.map(gradeField => (
                    <option key={gradeField.id} value={gradeField.id}>{gradeField.name}</option>
                )) : gradeFields.map(gradeField => (
                    <option key={gradeField.id} value={gradeField.id}>{gradeField.name}</option>
                ))}
        </select>
    </div>
)

GradeEdit.propTypes = {
    programmeId: string.isRequired,
    studyfieldId: string.isRequired,
    grade: string.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    programmeData: object.isRequired,
    changeProgramme: func.isRequired,
    changeStudyfield: func.isRequired,
    changeGrade: func.isRequired
}

export default GradeEdit
