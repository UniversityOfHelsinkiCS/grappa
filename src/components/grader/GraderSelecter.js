import React, { Component } from "react";

export default class GraderSelecter extends Component {

  constructor() {
    super();
    this.state = {
      searchValue: "",
      menuActive: false,
      selected: [],
      filtered: [],
    };
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.unfocusMenu);
    this.setState({ filtered: this.props.graders });
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.unfocusMenu);
  }

  removeGrader = (grader) => () => {
    const removed = this.state.selected.filter(grdr => grdr !== grader);
    this.setState({ selected: removed });
  }

  addGrader = (grader) => () => {
    this.setState({
        selected: [...this.state.selected, grader]
    })
  }

  toggleMenu = () => {
    this.setState({
        menuActive: !this.state.menuActive,
    });
  }

  search = (event) => {
      const searchValue = event.target.value.toLowerCase();
      const filtered = this.props.graders.filter(grader => {
        return grader.name.toLowerCase().includes(searchValue) ||
          grader.title.toLowerCase().includes(searchValue);
      });
      this.setState({
        searchValue,
        filtered,
      });
  }

  handleKeyPress = (target) => {
    // charCode 13 is ENTER
    if (target.charCode === 13) {
      const grader = this.state.filtered.find(grader => !this.isActivated(grader) );
      if (grader !== undefined) {
        this.addGrader(grader)();
      }
    }
  }

  focusMenu = (event) => {
    event.stopPropagation()
    this.setState({ menuActive: true });
  }

  unfocusMenu = (event) => {
    if (this.state.menuActive) {
      this.setState({ menuActive: false });
    }
  }

  isActivated(grader) {
    return this.state.selected.includes(grader);
  }

  renderSelected() {
    return this.state.selected.map((grader, index) => {
      return (
        <a key={index} className="ui label transition visible" onFocus={this.focusMenu}>
          { `${grader.title}` }&nbsp;{ `${grader.name}` }
          <i className="delete icon"
            onClick={this.removeGrader(grader)}
          ></i>
        </a>
      );
    })
  }

  renderSearch() {
    return <input
    className="search"
    autoComplete="off"
    tabIndex="0"
    style={{ width: "100%" }}
    value={this.state.searchValue}
    onChange={this.search}
    onKeyPress={this.handleKeyPress}
  />
  }

  renderDropdown() {
    return (this.state.menuActive ?
      <div className="menu transition visible" tabIndex="-1">
        { this.props.graders.map((grader, index) => {
          if (this.state.filtered.includes(grader) && !this.isActivated(grader)) {
            return (
              <div
                key={index}
                className="item"
                onClick={this.addGrader(grader)}
              >
                { grader.title }&nbsp;&nbsp;{ grader.name }
              </div>
            );
          } else {
            return (
              <div key={index} className="item filtered">{grader.name}</div>
            );
          }
        })
        }
      </div>
        :
      <div className="menu transition hidden" tabIndex="-1"></div>
      )
  }

  render() {
    return (
      <div>
        <div
          className="ui fluid multiple search selection dropdown empty visible"
          onMouseDown={this.focusMenu}
        >
          <input name="tags" type="hidden" value="" />
          {this.renderSelected()}
          {this.renderSearch()}
          {this.renderDropdown()}
        </div>
      </div>
    );
  }
}