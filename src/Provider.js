import React, { Fragment } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { ProfileProvider } from "context/ProfileContext";
import Routes from "routes";
import GlobalStyle from "globalStyle";

// configure redux store
import configureStore from "./store";

//configure app theme
import configureTheme from "./theme";

function AllProvider() {
  return (
    <Provider store={configureStore()}>
      <ThemeProvider theme={configureTheme()}>
        <ProfileProvider>
          <Fragment>
            <Routes />
            <GlobalStyle />
          </Fragment>
        </ProfileProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default AllProvider;
