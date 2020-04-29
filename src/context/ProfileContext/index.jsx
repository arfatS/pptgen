import React from "react";
import ProfileProvider from "./Provider";
// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

const ProfileContext = React.createContext({
  profile: {},
  setProfile: () => {}
});

export default ProfileContext;
export { ProfileProvider };
