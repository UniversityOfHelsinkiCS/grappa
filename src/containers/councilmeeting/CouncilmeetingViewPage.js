import React, { Component } from "react";
import moment from "moment";

export default class CouncilmeetingViewPage extends Component {
    constructor() {
        super();
        this.state = {
            index: "",
            previousMeeting: undefined,
            currentMeeting: undefined,
            nextMeeting: undefined,
            theses: [],
        };
    }

    componentWillMount() {
        this.initState(this.props);
    }

    componentWillReceiveProps(newProps) {
        // if on different page reset also selected theses
        if (this.props.params.id !== newProps.params.id) {
            this.initState(newProps);
        } else {
            // have to sort stuff as it is always in disorder
            const currentTheses = this.props.theses.sort((a, b) => a.id - b.id)
            const newTheses = newProps.theses.sort((a, b) => a.id - b.id)
            if (currentTheses !== newTheses) {
                this.initState(newProps);
            }
        }
    }

    initState(props) {
        if (!props.councilmeetings) return;
        const foundIndex = this.findIndexFromProps(props);
        const previousMeeting = foundIndex > 0 ? props.councilmeetings[foundIndex - 1] : undefined;
        const currentMeeting = props.councilmeetings[foundIndex];
        const nextMeeting = foundIndex === props.councilmeetings.length - 1 ? undefined : props.councilmeetings[foundIndex + 1];
        const theses = currentMeeting ? this.filterThesesByMeeting(props.theses, currentMeeting) : [];
        this.setState({
            index: foundIndex,
            previousMeeting,
            currentMeeting,
            nextMeeting,
            theses,
        });
    }

    incrementIndex(forward) {
        if (!this.props.councilmeetings) return;
        const index = forward ? this.state.index + 1 : this.state.index - 1;
        const previousMeeting = index > 0 ? this.props.councilmeetings[index - 1] : undefined;
        const currentMeeting = this.props.councilmeetings[index];
        const nextMeeting = index === this.props.councilmeetings.length - 1 ? undefined : this.props.councilmeetings[index + 1];
        const theses = currentMeeting ? this.filterThesesByMeeting(this.props.theses, currentMeeting) : [];
        this.setState({
            index,
            previousMeeting,
            currentMeeting,
            nextMeeting,
            theses,
            selectedTheses: [],
            searchedTheses: [],
        });
    }

    filterThesesByMeeting(theses, meeting) {
        return theses.filter(thesis => thesis.CouncilMeetingId === meeting.id);
    }

    findIndexFromProps(props) {
        let foundIndex;
        if (props.params && props.params.id !== "next") {
            let cmID;
            try {
                cmID = parseInt(props.params.id, 10);
            } catch (e) {
                return;
            }
            foundIndex = props.councilmeetings.findIndex(meeting => meeting.id === cmID);
        } else {
            foundIndex = this.findNextMeeting(new Date(), props.councilmeetings);
        }
        return foundIndex;
    }

    /**
     * Finds the index of closest date including today from sorted list of CouncilMeetings
     */
    findNextMeeting(starting, meetings = []) {
        return meetings.findIndex(meeting => {
            const date = new Date(meeting.date);
            return (date >= starting || date.toDateString() === starting.toDateString())
        });
    }

    changeMeeting = (where) => () => {
        switch (where) {
            case "previous":
                //browserHistory.replace(`/councilmeeting/${this.state.previousMeeting.id}`);
                this.incrementIndex(false);
                return;
            case "next":
                //browserHistory.replace(`/councilmeeting/${this.state.nextMeeting.id}`);
                this.incrementIndex(true);
                return;
            default:
                return;
        }
    }

    moveToPreviousMeeting = (thesisIds) => {
        const meeting = this.state.previousMeeting;
        this.props.moveTheses({
            thesisIds,
            CouncilMeetingId: meeting.id || 0,
        });
    }

    moveToNextMeeting = (thesisIds) => {
        const meeting = this.state.nextMeeting;
        this.props.moveTheses({
            thesisIds,
            CouncilMeetingId: meeting.id || 0,
        });
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.previousMeeting !== undefined ?
                        <button className="ui button blue" onClick={this.changeMeeting("previous")}>Previous</button>
                        :
                        <span></span>
                    }
                    {this.state.nextMeeting !== undefined ?
                        <button className="ui button blue" onClick={this.changeMeeting("next")}>Next</button>
                        :
                        <span></span>
                    }
                    <h2 className="ui dividing header" style={{ "marginTop": "10px" }}>
                        <span>
                            {this.state.currentMeeting !== undefined ?
                                "Councilmeeting of " + moment(this.state.currentMeeting.date).format("DD/MM/YYYY")
                                :
                                "No Councilmeeting found"
                            }
                    </span>
                    </h2>
                </div>
                {/*<ThesisList???
          theses={this.state.theses}
          userRole={this.props.user.role}
          moveToPreviousMeeting={this.moveToPreviousMeeting}
          moveToNextMeeting={this.moveToNextMeeting}
        />*/}
            </div>
        );
    }
}
/*
import { connect } from "react-redux";
import { updateThesis, getTheses, downloadTheses, moveTheses } from "../thesis/thesis.actions";
import { sendReminder } from "../email/email.actions";

const mapStateToProps = (state) => {
  const auth = state.get("auth");
  const cm_r = state.get("councilmeeting");
  const thesis = state.get("thesis");
  return {
    user: auth.get("user").toJS(),
    councilmeetings: cm_r.get("councilmeetings").toJS(),
    theses: thesis.get("theses").toJS(),
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateThesis(id, thesis) {
    dispatch(updateThesis(id, thesis));
  },
  getTheses() {
    dispatch(getTheses());
  },
  downloadTheses(theses) {
    dispatch(downloadTheses(theses));
  },
  moveTheses(data) {
    dispatch(moveTheses(data));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingShow);
*/