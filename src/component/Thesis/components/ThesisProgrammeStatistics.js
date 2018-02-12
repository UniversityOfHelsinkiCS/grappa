import React from 'react';
import { array, object, func, string } from 'prop-types';

const getThesisCount = gradesByField => Object.keys(gradesByField)
    .map(field => gradesByField[field])
    .reduce((sum, thesisCount) => sum + thesisCount);

const renderGradeCount = grade => (!grade ? '' : grade);

const ThesisProgrammeStatistics = ({
    stats, grades, getStudyfieldName, programmeName, gradeType
}) => {
    const countTheses = data => Object.values(data).reduce((sum, val) => sum + val);
    const thesisCount = Object.keys(stats)
        .map(field => countTheses(stats[field][gradeType]))
        .reduce((sum, val) => sum + val);

    if (thesisCount === 0) {
        return null;
    }

    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>{programmeName}</th>
                    {grades.map(grade => <th key={grade}>{grade}</th>)}
                    <th>Sum</th>
                </tr>
            </thead>
            <tbody>
                {!stats ? '' : Object.keys(stats).map(field => (
                    <tr key={`${field}-${gradeType}`}>
                        <td>{getStudyfieldName(field)}</td>
                        {grades.map(grade => (
                            <td key={`${grade}-${gradeType}`}>
                                {renderGradeCount(stats[field][gradeType][grade])}
                            </td>
                        ))}
                        {<td>{getThesisCount(stats[field][gradeType])}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    )
};

ThesisProgrammeStatistics.propTypes = {
    stats: object.isRequired,
    programmeName: string.isRequired,
    grades: array.isRequired,
    getStudyfieldName: func.isRequired,
    gradeType: string.isRequired
};

export default ThesisProgrammeStatistics;
