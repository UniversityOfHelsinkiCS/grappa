import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const service =  require("../util/apiConnection.js");

class ThesisList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //there has to be a empty thesisListElements on first render before componentDidMount
            thesisListElements: <tr key={0} class="item"><td>{""}</td><td>{""}</td><td>{""}</td></tr>
        }
    }

  componentDidMount() {
      document.title = "Thesis List Page";
      service.get("/theses").then((resp) => {
          console.log("THESES: ", resp.data);
          this.setState(
              {thesisListElements: resp.data.map((thesis) =>
                  <tr key={thesis.id} class="item"><td>{thesis.authorLastname + ", " + thesis.authorFirstname}</td><td>{thesis.title}</td><td>{thesis.grade}</td></tr>
              )}
          );
      }).catch((error) => console.error(error));
  }

  render() {
    return (
    <div className="App">

        <div className="ui inverted segment">
            <h2>Thesis List</h2>
        </div>
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>Author</th>
                    <th>Title</th>
                    <th>Grade</th>
                </tr>
            </thead>
            <tbody>{this.state.thesisListElements}</tbody>
        </table>
        <div className="ui segment">
            <p><Link to="/"> Go back to HomePage</Link></p>
        </div>
    </div>
    );
  }
}

export default ThesisList;
