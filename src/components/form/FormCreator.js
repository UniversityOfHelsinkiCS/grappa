import React, { Component } from 'react';
import FormSection from './FormSection';

export default class FormCreator extends Component {
    getLastAgreementAction() {
        //const forReturn = this.props.agreement[this.props.agreement.length - 1];

        return undefined//(forReturn === undefined ? {} : forReturn);
    }
    getButton() {
        const lastAction = this.getLastAgreementAction();
        const workableButton = <button className="ui primary button" type="submit" onClick={this.sendForm}>Save</button>;
        const disabledLoadingButton = <button className="ui primary disabled loading button" type="submit" onClick={this.sendForm}>Save</button>;

        if (lastAction === undefined) { return workableButton }
        else {
            if (lastAction.id == 'AGREEMENT_SAVE_ATTEMPT') { return disabledLoadingButton }
            else { return workableButton }
        }
    }
    createForm = () => {
        const formFieldProperties = {
            sections:
            [{
                header: "Opinnäytetyön tekijä",
                fields: [
                    { inputType: "input", name: "studentName", label: "Nimi", labelType: "", required: true, placeholder: "Etu- ja Sukunimi" },
                    { inputType: "input", name: "studentNumber", label: "Opiskelijanumero", labelType: "", required: true, placeholder: "XXXXXXX" },
                    { inputType: "input", name: "studentAddress", label: "Lähiosoite", labelType: "", required: true, placeholder: "Peräpolku 2 C 45, Nuppulinna" },
                    { inputType: "input", name: "studentPhone", label: "Puhelinnumero", labelType: "", required: true, placeholder: "000 000 00 00" },
                    { inputType: "input", name: "studentEmail", label: "Sähköpostiosoite", labelType: "", required: true, placeholder: "nimi@domain.com" },
                    { inputType: "input", name: "studentMajor", label: "Pääaine", labelType: "", required: true, placeholder: "(jos muu kuin TKTL)" },
                ]
            },
            {
                header: "Opinnäytetyö",
                fields: [
                    { inputType: "textarea", rows: 2, name: "thesisTitle", label: "Opinnäytetyön otsikko (työnimi) tekokielellä", labelType: "fluid", required: true, placeholder: "Opinnäytetyön otsikko (työnimi) tekokielellä" },
                    { inputType: "input", name: "thesisStartDate", label: "Aloitusajankohta", labelType: "", required: true, placeholder: "" },
                    { inputType: "input", name: "thesisCompletionEta", label: "Arvioitu valmistumisajankohta", labelType: "", required: true, placeholder: "" },
                    { inputType: "textarea", rows: 2, name: "thesisPerformancePlace", label: "Suorituspaikka", labelType: "fluid ", required: true, placeholder: "(projekti, työnantaja, tms.) ja yhteystiedot" },
                ]
            },
            {
                header: "Ohjausvastuut",
                fields: [
                    { inputType: "input", name: "thesisSupervisorMain", label: "Vastuuohjaaja", labelType: " fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
                    { inputType: "input", name: "thesisSupervisorSecond", label: "2. ohjaaja", labelType: " fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
                    { inputType: "input", name: "thesisSupervisorOther", label: "Muu ohjaaja", labelType: " fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
                ]
            },
            {
                header: "Työskentelyn tavoitteet ja ajankäyttö",
                fields: [
                    { inputType: "textarea", rows: 1, name: "thesisWorkStudentTime", label: "Opiskelijan arvioima opinnäytetyöhön käytettävä työaika", labelType: "fluid", required: true, placeholder: "(esim. tuntia / vko)" },
                    { inputType: "textarea", rows: 2, name: "thesisWorkSupervisorTime", label: "Ohjaajien ohjaukseen varaama aika (työn eri vaiheissa)", labelType: "fluid", required: true, placeholder: "" },
                    { inputType: "textarea", rows: 2, name: "thesisWorkIntermediateGoal", label: "Välitavoitteet (deadlinet työn eri vaiheille)", labelType: "fluid", required: true, placeholder: "" },
                    { inputType: "textarea", rows: 2, name: "thesisWorkMeetingAgreement", label: "Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä olevasta ajasta", labelType: "fluid", required: true, placeholder: "" },
                    { inputType: "textarea", rows: 2, name: "thesisWorkOther", label: "Muuta", labelType: "fluid", required: false, placeholder: "(esim. opiskelijan odotukset ohjaajalle / ohjaajan odotukset opiskelijalle" },
                ]
            },
            {
                header: "Tavoitearvosana",
                fields: [
                    { inputType: "textarea", rows: 1, name: "studentGradeGoal", label: "Opiskelija on tutustunut laitoksen opinnäytetyön arviointimatriisiin ja määrittää tavoitearvosanakseen:", labelType: "", required: true, placeholder: "Etu- ja Sukunimi" },
                ]
            }]
        }

        let sectionList = formFieldProperties.sections.map(
            (sectionData, sectionKey) => {

                return <FormSection sectionKey={sectionKey} header={sectionData.header} elements={sectionData.fields} />;

            });



            return (
                   <form>
                        {sectionList}
                        <br />
                        {this.getButton()}
                        <br />
                        
                    </form>
    
            );
      
    }



    render() {
        return <div className={"ui form "}>
        
            {this.createForm()}
            <br />
            {this.getButton()}
            <br />

    </div>;
    }
}