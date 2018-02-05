import React, { Component } from 'react';
import { connect } from 'react-redux';
import { array, arrayOf, func } from 'prop-types';

import { getStatistics } from '../thesis/statisticsActions';
import ThesisProgrammeStatistics from '../../components/thesis/ThesisProgrammeStatistics';
import { programmeType, studyfieldType } from '../../util/types';
import { oldGradeFields } from '../../util/theses';

class StatisticsPage extends Component {
    componentDidMount() {
        this.props.getStatistics();
    }

    render() {
        const years = Object.keys(this.props.stats).reverse();
        const grades = oldGradeFields.map(field => field.id).reverse();
        const programmeIds = [...new Set(this.props.studyfields.map(field => field.programmeId))];

        const getStudyfieldName = (field) => {
            const found = this.props.studyfields.find(f => f.studyfieldId === Number(field));
            return found ? found.name : 'unknown';
        };

        const getProgrammeName = (programmeId) => {
            const programme = this.props.programmes.find(prg => prg.programmeId === programmeId);
            return programme ? programme.name : '';
        };

        return (
            <div>
                {years.map(year => (
                    <div key={year}>
                        <h2>{year}</h2>
                        {programmeIds.map((progremmeId) => (this.props.stats[year][progremmeId] ? (
                            <ThesisProgrammeStatistics
                                stats={this.props.stats}
                                year={year}
                                programmeId={progremmeId}
                                programmeName={getProgrammeName(progremmeId)}
                                grades={grades}
                                getStudyfieldName={getStudyfieldName}
                            />
                        ) : null))}
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    stats: state.statistics,
    studyfields: state.studyfields,
    programmes: state.programmes
});

const mapDispatchToProps = dispatch => ({
    getStatistics() {
        dispatch(getStatistics());
    }
});

StatisticsPage.propTypes = {
    stats: array.isRequired,
    getStatistics: func.isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    programmes: arrayOf(programmeType).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsPage);
