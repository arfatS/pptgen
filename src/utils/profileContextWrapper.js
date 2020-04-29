import React from "react";
import ProfileContext from "context/ProfileContext";

const profileContextWrapper = (Component, auth, props, otherProps) => (
  <ProfileContext.Consumer>
    {({ profile, setProfile, ...profileData }) => (
      <Component
        profile={profile}
        setProfile={setProfile}
        auth={auth}
        {...profileData}
        {...props}
        {...otherProps}
      />
    )}
  </ProfileContext.Consumer>
);

export default profileContextWrapper;
