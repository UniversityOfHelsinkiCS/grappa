import React, { Component } from 'react';

import ThesisStatisticsTable from './ThesisStatisticsTable';

/**
 * StatisticsYearElement contains tables for new and old system.
 * Old system has grades from laudatur to approbatur and the new system from 1-5 and
 * those are split to different tables.
 */
export default class ThesisStatisticsYearElement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filteredTheses: [],
            year: null,
        };
    }

    componentWillMount() {
        this.setYear(this.props.theses);
    }

    componentDidMount() {
        this.filterThesesByGradingSystem(this.props.theses);
    }

    setYear(theses) {
        if (theses) {
            this.setState({year: theses[0].CouncilMeeting.date.slice(0,4) })
        }
    }

    filterThesesByGradingSystem(theses) {
        let filteredTheses = [[], []];
        let oldGrades = ['Laudatur',
            'Eximia Cum Laude Approbatur', 'Magna Cum Laude Approbatur',
            'Cum Laude Approbatur', 'Non Sine Laude Approbatur', 'Lubenter Approbatur', 'Approbatur',]
        if (theses) {
            theses.forEach(thesis => {
                if (oldGrades.includes(thesis.grade)) {
                    filteredTheses[1].push(thesis);
                } else {
                    filteredTheses[0].push(thesis);
                }
            });
        }
        this.setState({ filteredTheses });
    }

    render() {
        console.log('YR element')
        return (
            <div>
                <h2>{this.state.year}</h2>
                {this.state.filteredTheses.map((theses, index) => {
                    if (theses.length > 0) {
                        return <ThesisStatisticsTable key={index} theses={theses} />;
                    } else {
                        return <div key={index}/>;
                    }
                })}
                <br/>
            </div>
        );
    }
}