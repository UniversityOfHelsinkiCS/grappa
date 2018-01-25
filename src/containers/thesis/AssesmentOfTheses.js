import React, { Component } from 'react';

import AssesmentInFinnish from '../../resources/assesmentInFinnish.json';
import AssesmentInEnglish from '../../resources/assesmentInEnglish.json';
import AssesmentInSwedish from '../../resources/assesmentInSwedish.json';

class AssesmentOfTheses extends Component {
    constructor() {
        super();
        this.state = {
            language: 'en'
        };
    }

    componentDidMount() {
        document.title = 'Assesment of Theses';
    }

    changeLanguage = (lang) => {
        this.setState({ language: lang });
    };

    renderAssesment() {
        let assesment = AssesmentInFinnish;
        if (this.state.language === 'en') {
            assesment = AssesmentInEnglish;
        } else if (this.state.language === 'swe') {
            assesment = AssesmentInSwedish;
        }
        return assesment.map((all, index) => (
            <div key={index}>
                <h2>{all.title}</h2>
                <p>{all.text}</p>
                <ul className="ui list"> {all.list !== undefined &&
                    all.list.map((lista, index) => (
                        <li key={index}><b>{lista.title}</b> {lista.text}</li>
                    ))
                }
                </ul>
            </div>
        ))
    }

    renderTitles() {
        if (this.state.language === 'en') {
            return (
                <div>
                    <b>
                        UNIVERSITY OF HELSINKI<br />
                        2.8.2017<br />
                        Academic Affairs Council<br />
                        <h1>Assessment of Master’s theses included in second-cycle degrees</h1>
                    </b>
                </div>
            );
        } else if (this.state.language === 'swe') {
            return (
                <div>
                    <b>
                        HELSINGFORS UNIVERSITET<br />
                        2.8.2017<br />
                        Utbildningsrådet<br />
                        <h1>Bedömningen av pro gradu-avhandlingen som hör till högre högskoleexamen</h1>
                    </b>
                </div>
            );
        }
        return (
            <div>
                <b>
                    HELSINGIN YLIOPISTO<br />
                    2.8.2017<br />
                    Opintoasiainneuvosto<br />
                    <h1>Ylempään korkeakoulututkintoon sisältyvän pro gradu -tutkielman arviointi</h1>
                </b>
            </div>
        );
    }

    render() {
        return (
            <div className="App">
                <div className="ui left aligned segment">
                    <button id="fin" className="ui button" onClick={e => this.changeLanguage('fin', e)}>suomeksi</button>
                    <button id="en" className="ui button" onClick={e => this.changeLanguage('en', e)}>in English</button>
                    <button id="swe" className="ui button" onClick={e => this.changeLanguage('swe', e)}>på svenska</button>
                    <p />
                    {this.renderTitles()}
                    {this.renderAssesment()}
                </div>
            </div >
        );
    }
}

export default AssesmentOfTheses;
