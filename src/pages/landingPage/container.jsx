import React, { Component } from "react";
import Loader from "components/loader";
import { FocusedImage } from "image-focus";
import ToastUtils from "utils/handleToast";

const Container = Main =>
  class LandingPage extends Component {
    state = {
      mountWithLoader: true,
      heading: "Create 51-100 Renewals in Minutes",
      form: {
        username: null,
        password: null
      }
    };

    /** handling form inputs change  */
    handleChange = (field, value) => {
      let form = { ...this.state.form };
      form[field] = value;
      this.setState({
        form
      });
    };

    /** handling form submit */
    handleSubmit = e => e.preventDefault();

    /** handling form submit  */
    handleImageFocalPoint = () => {
      let bgImage = document.querySelector(".bg-image");
      bgImage &&
        new FocusedImage(bgImage, {
          focus: { x: 0, y: 0 },
          debounceTime: 17,
          updateOnWindowResize: true
        });
    };

    componentDidMount() {
      //check if user is not authorized by auth0
      const unAuthorizedUserFlag = localStorage.getItem("unauthorized");
      if (unAuthorizedUserFlag) {
        ToastUtils.handleToast({
          operation: "error",
          message: "You are not authorized to login."
        });

        //reset unauthorized
        this.props.auth.resetUserFlag();
      }

      //renew auth session
      const { isAuthenticated } = this.props.auth;
      if (this.state.mountWithLoader) {
        // reset loader state
        this.loaderInterval = setTimeout(() => {
          this.setState({
            mountWithLoader: false
          });
          !isAuthenticated() && this.handleImageFocalPoint();
        }, 1000);
      }

      /**  assign the height of the form to the right-image */
      let page = document.querySelector(".landing-page");
      if (page) {
        page.style.opacity = 0;
      }

      setTimeout(() => {
        let page = document.querySelector(".landing-page");
        if (page) {
          page.style.opacity = 1;
        }
        let leftImg = document.querySelector(".left-image");
        let rightForm = document.querySelector(".right-form");
        if (leftImg) leftImg.style.height = rightForm.offsetHeight + 29 + "px";
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.loaderInterval);
    }

    // method to redirect to auth0 Login
    login = () => {
      this.props.auth.login();
    };

    render() {
      const $this = this;
      const { mountWithLoader } = this.state;
      const { isAuthenticated } = this.props.auth;

      // show loader if authentication is in progress
      if (
        mountWithLoader ||
        (isAuthenticated() && localStorage.getItem("isLoggedIn") === "true")
      ) {
        return <Loader />;
      }

      return (
        <Main {...$this.state} {...$this} isAuthenticated={isAuthenticated} />
      );
    }
  };

export default Container;
