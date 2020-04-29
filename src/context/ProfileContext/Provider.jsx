import React, { Component } from "react";
import ProfileContext from "./index";
import featureFlags from "utils/featureFlags.js";

class ProfileProvider extends Component {
  setProfile = profile => {
    this.setState({
      profile
    });
  };

  state = {
    profile: {},
    setProfile: this.setProfile,
    ...featureFlags
  };

  render() {
    return (
      <ProfileContext.Provider value={this.state}>
        {this.props.children}
      </ProfileContext.Provider>
    );
  }
}

export default ProfileProvider;
