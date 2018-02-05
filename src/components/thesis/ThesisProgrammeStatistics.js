import React from 'react';
import { array, object, number, func, string } from 'prop-types';

const getThesisCount = gradesByField => Object.keys(gradesByField)
    .map(field => gradesByField[field])
    .reduce((sum, thesisCount) => sum + thesisCount);

const ThesisProgrammeStatistics = ({ stats, year, programmeId, grades, getStudyfieldName, programmeName }) => (
    <table className="ui celled table">
        <thead>
            <tr>
                <th>{programmeName}</th>
                {grades.map(grade => <th key={grade}>{grade}</th>)}
                <th>Sum</th>
            </tr>
        </thead>
        <tbody>
            {!stats[year][programmeId] ? '' : Object.keys(stats[year][programmeId]).map(field => (
                <tr key={`${year}-${field}`}>
                    <td>{getStudyfieldName(field)}</td>
                    {grades.map(grade => (
                        <td key={`${year}-${field}-${grade}`}>
                            {stats[year][programmeId][field][grade] ? stats[year][programmeId][field][grade] : ''}
                        </td>
                    ))}
                    {<td>{getThesisCount(stats[year][programmeId][field])}</td>}
                </tr>
            ))}
        </tbody>
    </table>
);

ThesisProgrammeStatistics.propTypes = {
    stats: object.isRequired,
    year: number.isRequired,
    programmeId: number.isRequired,
    programmeName: string.isRequired,
    grades: array.isRequired,
    getStudyfieldName: func.isRequired
};

export default ThesisProgrammeStatistics;
