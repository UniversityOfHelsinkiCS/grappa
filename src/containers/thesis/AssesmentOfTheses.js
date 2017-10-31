import React, { Component } from 'react';
//import { callApi } from "../../util/apiConnection.js";
import AssesmentInFinnish from '../../resources/assesmentInFinnish.json';
import AssesmentInEnglish from '../../resources/assesmentInEnglish.json';
import AssesmentInSwedish from '../../resources/assesmentInSwedish.json';

class AssesmentOfTheses extends Component {
    constructor() {
        super();
        this.language = "en";
    }

    componentDidMount() {
        document.title = "Assesment of Theses";

    }

    changeLanguage = (lang, e) => {
        e.preventDefault();
        console.log(lang);
        this.language = lang;
        this.forceUpdate();
    }

    renderAssesment() {
        let assesment = AssesmentInFinnish;
        if (this.language === "en") {
            assesment = AssesmentInEnglish;
        } else if (this.language === "swe") {
            assesment = AssesmentInSwedish;
        }
        return assesment.map(all => (
            <div>
                <h2>{all.title}</h2>
                <p>{all.text}</p>
                <ul class="ui list"> {all.list !== undefined &&
                    all.list.map(lista => (
                        <li><b>{lista.title}</b> {lista.text}</li>
                    ))
                }
                </ul>
            </div>
        ))
    }

    renderTitles() {
        if (this.language === "en") {
            return <div>
                <b>
                    UNIVERSITY OF HELSINKI<br />
                    2.8.2017<br />
                    Academic Affairs Council<br />
                    <h1>Assessment of Master’s theses included in second-cycle degrees</h1>
                </b>
            </div>
        } else if (this.language === "swe") {
            return <div>
                <b>
                    HELSINGFORS UNIVERSITET<br />
                    2.8.2017<br />
                    Utbildningsrådet<br />
                    <h1>Bedömningen av pro gradu-avhandlingen som hör till högre högskoleexamen</h1>
                </b>
            </div>
        }
        return <div>
            <b>
                HELSINGIN YLIOPISTO<br />
                2.8.2017<br />
                Opintoasiainneuvosto<br />
                <h1>Ylempään korkeakoulututkintoon sisältyvän pro gradu -tutkielman arviointi</h1>
            </b>
        </div>
    }

    render() {
        return (

            <div className="App">
                <div className="ui left aligned segment">
                    <button className="ui button" onClick={(e) => this.changeLanguage("fin", e)}>suomeksi</button>
                    <button className="ui button" onClick={(e) => this.changeLanguage("en", e)}>in English</button>
                    <button className="ui button" onClick={(e) => this.changeLanguage("swe", e)}>på svenska</button>
                    <p></p>
                    {this.renderTitles()},
                    {this.renderAssesment()}
                </div>
            </div >
        );
    }
}

export default AssesmentOfTheses;
