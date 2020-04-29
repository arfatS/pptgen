import React, { Component } from "react";
import { Cart, Paint, TabLibrary, Sort, ConfigRate } from "assets/icons";
import { connect } from "react-redux";
import {
  get,
  difference,
  map,
  forEach,
  each,
  flatten,
  intersection,
  keys,
  filter,
  includes,
  sortBy
} from "lodash";

import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";
//utils
import ToastUtils from "utils/handleToast";
import PollingUtils from "utils/PollingUtils";
import handleBodyScroll from "utils/handleBodyScroll";
import { Overview } from "assets/images";

//reducer action and props
import { mapStateToProps, actions } from "./mapStateToProps";

let UI_STRINGS = {
  BUILD_ERROR: "Could not complete the build.Please try again.",
  BUILD_TIMEOUT: "Build is taking too long. PLease try again later.",
  UNSAVED_BUILD_ERROR: "Please save your presentation before proceeding.",
  ADD_GROUP_SLIDE_WARNING_MESSAGE:
    "Adding this slide will add all the slides belonging to this group. Do you still want to continue?",
  REMOVE_GROUP_SLIDE_WARNING_MESSAGE:
    "Removing this slide will remove all the slides belonging to this group. Do you still want to continue?",
  EMPTY_FIELD_ERROR_MESSAGE: "This field is required.",
  FIELD_ERROR_MESSAGE: "Please enter required fields.",
  VALID_INPUT_ERROR_MESSAGE: "Please enter a valid input.",
  CONTENT_REPO_ERROR_MESSAGE: "Please select a content repo."
};

const Container = Main =>
  connect(
    mapStateToProps,
    actions
  )(
    class Presentation extends Component {
      state = {
        userDetail: null,
        stepItems: [
          {
            title: "Setup",
            src: ConfigRate
          },
          {
            title: "Theme",
            src: Paint
          },
          {
            title: "Library",
            src: TabLibrary
          },
          {
            title: "Sort",
            src: Sort
          },
          {
            title: "Build",
            src: Cart
          }
        ],
        activeStep: 0,
        includeCoverPage: true,
        selectedThemeLayout: 0,
        selectedCoverLayout: null,
        contentRepo: {},
        seletedFilters: [],
        selectedLogo: null,
        selectedLogoId: null,
        selectSlides: [],
        selectedSlidesData: [],
        selectedSlidesListDetail: [],
        overlayChangedDynamicImages: [],
        currentOverlayData: null,
        deckChildrenSlideId: [],
        isSlideDeck: false,
        slidePartOfDeck: null,
        cropData: {},
        isImageCropperOpen: false,
        selectedImageCategoryList: {},
        accordianClosedState: [],
        librarySearchString: "",
        isShowPreview: false,
        buildSetupDetails: {
          presentationName: {
            value: "",
            error: ""
          },
          includeOverview: {
            value: true,
            error: ""
          },
          includePageNumber: {
            value: true,
            error: ""
          }
        },
        presentationId: "",
        showModal: false,
        maximumSlideCount: 60,
        contentSlideGroups: {},
        buildProgress: {
          status: "InProgress"
        },
        activeSlideDetail: {},
        isInputFocused: false
      };

      componentDidMount() {
        // set user detail profile if present and get presentation meta details
        this.setUserProfile();
      }

      //get presentation detail on edit
      getPresentationDetailOnLoad = async () => {
        let { id: presentationId } = this.props.match.params;
        const { _id: userId } = this.state.userDetail;
        const { contentRepoList } = this.props;

        if (presentationId) {
          await this.props.getPresentationDetail(userId, presentationId);

          let presentationData = this.props.presentationData || {};
          let { contentRepository } = presentationData;
          let { buildSetupDetails } = this.state;

          let title =
            (Array.isArray(contentRepoList) &&
              contentRepoList.filter(item => contentRepository === item._id)) ||
            [];

          let contentRepo = {
            _id: contentRepository,
            title: (title[0] && title[0].title) || ""
          };

          ["presentationName", "includeOverview", "inlcudePageNumber"].forEach(
            item => {
              buildSetupDetails[item] = {
                value: presentationData[item],
                error: ""
              };
            }
          );

          let slides = get(presentationData, `slides`);

          // extract slides which were selected
          let selectSlides = map(slides, eachSlide => {
            let Id = get(eachSlide, `slideId._id`);
            if (Id) return Id;
          });

          // check if slideid is present
          let checkIfSlideDataPresent = filter(slides, eachSlide => {
            return get(eachSlide, `slideId`);
          });

          // extract slide list detail
          let selectedSlidesListDetail = map(
            checkIfSlideDataPresent,
            eachSlide => {
              return {
                ...eachSlide,
                changedTitle: eachSlide.slideTitle
              };
            }
          );

          this.setState(
            {
              presentationId,
              buildSetupDetails,
              contentRepo,
              selectSlides,
              selectedSlidesListDetail
            },
            () => {
              this.onContentRepoDropdownChanged();
            }
          );
        }
      };

      componentDidUpdate(prevProps) {
        // fetch and store user detail to fetch user id and get presentation required detail.
        if (this.props.userProfileMeta !== prevProps.userProfileMeta) {
          this.setUserProfile();
        }
      }

      /**
       * Get User Profile based on API respone and store in local state
       *
       */
      setUserProfile = () => {
        const { userProfileMeta } = this.props;
        userProfileMeta &&
          this.setState(
            {
              userDetail: userProfileMeta
            },
            () => this.getPresentationSetupMetaDataList()
          );
      };

      //hits all the API requests required for presentation
      getPresentationSetupMetaDataList = async () => {
        if (this.state.userDetail) {
          await this.props.getContentRepoList(this.state.userDetail._id);
          this.props.getCustomerLogoList(this.state.userDetail._id);
          this.fetchLibraryFiltersList();
          this.fetchImageCategoryList();
          await this.getPresentationDetailOnLoad();
        }
      };

      //fetch library filters list and keep default check all stored in filters
      fetchLibraryFiltersList = async () => {
        await this.props.getLibraryFiltersList();

        // extract filter list
        const { libraryFiltersList } = this.props;
        let seletedFilters = [];
        each(libraryFiltersList, ({ childrens }, index) => {
          let filtersList = map(childrens, ({ _id }) => {
            return _id;
          });
          filtersList.push(`F-${index}`);
          seletedFilters.push(...filtersList);
        });

        this.setState({
          seletedFilters
        });
      };

      /**
       * Upload customer logo
       *
       * @param {Object} imageData Data to be sent
       * @param {Object} title Customer name
       * @param {boolean} saveToProfile states whether the uploaded image has to saved in profile
       */
      handleSelectedLogo = async (imageData, customerName, saveToProfile) => {
        // data to be sent in upload post
        let data = {
          imageData,
          saveToProfile,
          title: customerName
        };
        let response = await this.props.createNewCustomerLogo(
          this.state.userDetail._id,
          data
        );

        this.setState({
          selectedLogoId: get(response, `data._id`)
        });

        // fetch new list of logos if save to profile was checked
        if (saveToProfile) {
          this.props.getCustomerLogoList(this.state.userDetail._id);
        }
      };

      /**
       *
       * @param selectedLogo logo which was selected from the bottom or uploaded
       * @param {boolean} isImageSourceUrl states the selectedLogo is image url or data uri
       */
      selectedLogoHandler = selectedLogo => {
        if (!selectedLogo) {
          this.setState({
            selectedLogo: null
          });
          return;
        }
        this.setState({
          selectedLogo: selectedLogo.url || selectedLogo,
          croppedImage: selectedLogo.url || selectedLogo, // storing same data as selectedLogo so that croppedImage could be used for preview in the placeholder and selectedLogo as the imageSrc
          selectedLogoId: selectedLogo._id
        });
      };

      /** Fetch themes and covers data from service
       * Hit Services with content repo id
       * This services are dependent on content repo selected in dropdown
       *
       */
      onContentRepoDropdownChanged = () => {
        const { contentRepo: contentRepoId } = this.state;
        //reset library search
        this.fetchLibraryBySearch();
        this.setState({
          librarySearchString: "",
          selectedSlidesData: []
        });

        //exit if contentRepoId Detail is not present
        if (
          typeof contentRepoId === "object" &&
          !Object.keys(contentRepoId).length
        )
          return;

        //set content repo id and get lists required for presentation
        const selectedContentRepoId = contentRepoId._id;
        this.props.getDynamicCoverFieldsList(selectedContentRepoId);
        this.fetchDynamicCoverFields(selectedContentRepoId);
        this.fetchThemeList(selectedContentRepoId);
      };

      /**
       * maping edit presentation response with dynamic cover fields
       *
       * @param {*} selectedContentRepoId content repository id
       */

      fetchDynamicCoverFields = async selectedContentRepoId => {
        await this.props.getDynamicCoverFieldsList(selectedContentRepoId);
        let { dynamicCoverFieldsList, presentationData } = this.props;

        let { buildSetupDetails } = this.state;
        presentationData = presentationData || {};

        Array.isArray(dynamicCoverFieldsList) &&
          dynamicCoverFieldsList.forEach(({ label }) => {
            let key = label.replace(/\s/g, "");
            key = key.charAt(0).toLowerCase() + key.slice(1);

            buildSetupDetails[key] = buildSetupDetails[key]
              ? buildSetupDetails[key]
              : {};

            let value =
              key === "presentationDate"
                ? presentationData[key]
                  ? new Date(presentationData[key])
                  : new Date()
                : presentationData[key];

            if (this.props.match.params.id) {
              buildSetupDetails[key].value = value || "";
            } else {
              buildSetupDetails[key].value =
                key === "presentationDate"
                  ? new Date()
                  : buildSetupDetails[key].value || "";
            }
          });

        this.setState(
          {
            buildSetupDetails: {}
          },
          () => {
            this.setState({
              buildSetupDetails
            });
          }
        );
      };

      /**
       * Fetch themes data from service
       */
      fetchThemeList = async contentRepoId => {
        await this.props.getThemeList(contentRepoId);

        let defaultTheme =
          (Array.isArray(this.props.themeList) &&
            this.props.themeList[0]._id) ||
          null;

        let selectedTheme =
          this.props.presentationData &&
          get(this.props.presentationData, "theme", defaultTheme);

        let selectedThemeLayout = this.props.match.params.id
          ? selectedTheme
          : defaultTheme;

        selectedThemeLayout &&
          this.setState({ selectedThemeLayout }, () =>
            this.fetchCoverList(contentRepoId)
          );
      };

      /**
       * Fetch covers list based on selected theme from service
       */
      fetchCoverList = async () => {
        const {
          contentRepo: contentRepoId,
          seletedFilters,
          selectedThemeLayout
        } = this.state;

        //exit if contentRepoId Detail is not present
        if (
          typeof contentRepoId === "object" &&
          !Object.keys(contentRepoId).length
        )
          return;

        if (
          Array.isArray(this.props.themeList) &&
          this.props.themeList.length
        ) {
          //set content repo id and get lists required for presentation
          const selectedContentRepoId = contentRepoId._id;
          await this.props.getCoverList(
            selectedContentRepoId,
            selectedThemeLayout
          );

          let defaultCover =
            (Array.isArray(this.props.coverList) &&
              this.props.coverList.length &&
              get(this.props.coverList[0], `coverSlides[0]._id`)) ||
            null;

          let selectedCover =
            this.props.presentationData &&
            get(this.props.presentationData, "coverSlide.cover", defaultCover);

          let selectedCoverLayout = this.props.match.params.id
            ? selectedCover
            : defaultCover;

          selectedCoverLayout &&
            this.setState({
              selectedCoverLayout: selectedCoverLayout
            });

          await this.props.getLibraryByTopic(
            selectedContentRepoId,
            selectedThemeLayout,
            {
              filters: seletedFilters.filter(elem => !(elem.indexOf("F-") > -1))
            }
          );

          // to fetch selected slides detail
          this.getContentSlideDetails();

          this.props.getDividerListOfSelectedRepo(
            selectedContentRepoId,
            selectedThemeLayout
          );
          this.props.getBlankSlideListOfSelectedRepo(
            selectedContentRepoId,
            selectedThemeLayout
          );
        }

        // empty accordianClosedState array
        this.setState({
          accordianClosedState: []
        });
      };

      // get content slide detail based on the selected id from the response while editing the presentation.
      getContentSlideDetails = () => {
        let { selectSlides } = this.state;
        let newSelectedSlides = [...this.state.selectedSlidesListDetail];
        /**
         * Loop through content slides
         *
         * @param {Array} contentSlides array of content slides
         * @param {Array} [selectedSlidesListDetail=[]] array of selected content slides
         * @param {Object} contentSlideGroups unique content slide group objects
         * @returns array of selected slide detail
         */
        let getSlides = (contentSlides, contentSlideGroups = {}) => {
          each(contentSlides, item => {
            let { children, _id, label, group } = item;

            if (group && group.title) {
              contentSlideGroups[group.title] = contentSlideGroups[group.title]
                ? contentSlideGroups[group.title]
                : [];

              if (
                contentSlideGroups[group.title] &&
                contentSlideGroups[group.title].filter(
                  ({ _id: id }) => item._id === id
                ).length === 0
              ) {
                contentSlideGroups[group.title].push(item);
              }
            }

            let slideIndex = selectSlides.indexOf(_id);
            if (
              label === "slide" &&
              slideIndex > -1 &&
              this.props.match.params.id
            ) {
              newSelectedSlides[slideIndex] = {
                ...newSelectedSlides[slideIndex],
                ...item
              };
            }

            if (Array.isArray(children)) {
              return getSlides(children, contentSlideGroups);
            }
          });

          return contentSlideGroups;
        };

        let contentSlideGroups = getSlides(this.props.libraryByTopicList);

        this.setState({
          selectedSlidesListDetail: newSelectedSlides,
          contentSlideGroups
        });
      };

      /**
       * Fetch Image category list based on selected content repo
       * @param {String} contentRepoId
       */
      fetchImageCategoryList = async contentRepoId => {
        //hit get dynamic cover fields service with actions

        await this.props.getImageCategoryListOfSelectedRepo(contentRepoId);
        let { id } = this.props.match.params;
        let { selectedImageCategoryList } = this.state;
        if (id) {
          let { imageCategoryList } = this.props;
          let { imageCategories } = this.props.presentationData || {};
          Array.isArray(imageCategoryList) &&
            Array.isArray(imageCategories) &&
            imageCategoryList.forEach(imageCat => {
              let { attribute, key } = imageCat;
              attribute.forEach(item => {
                let { _id, title } = item;
                if (imageCategories.indexOf(_id) > -1) {
                  selectedImageCategoryList[key] = selectedImageCategoryList[
                    key
                  ]
                    ? selectedImageCategoryList[key]
                    : [];
                  let obj = {
                    label: title,
                    title: title,
                    value: _id,
                    _id: _id
                  };
                  selectedImageCategoryList[key].push(obj);
                }
              });
            });
        }

        this.setState({
          selectedImageCategoryList
        });
      };

      modifyStep = activeStep => {
        this.setState({ activeStep });
      };

      /**
       * Handle filters with based on current selected tab active for view by search and topics
       * @param {Boolean} viewByTopic - True for view by topic/ False for view by search
       */
      onChangeHandleFiltersCheck = (viewByTopic, resetFilters) => {
        const { contentRepo: contentRepoId, seletedFilters } = this.state;

        //exit if contentRepoId Detail is not present
        if (
          typeof contentRepoId === "object" &&
          !Object.keys(contentRepoId).length
        )
          return;

        //set content repo id and get lists required for presentation
        const selectedContentRepoId = contentRepoId._id;

        // reset selected filters on clear all button
        if (resetFilters && seletedFilters.length) {
          this.setState({
            seletedFilters: []
          });
        } else if (resetFilters && !seletedFilters.length) {
          return;
        }

        //if view by search tab is active
        !viewByTopic && this.fetchLibraryBySearch();

        //if view by topic tab is active
        this.props.getLibraryByTopic(
          selectedContentRepoId,
          this.state.selectedThemeLayout,
          {
            filters: resetFilters
              ? []
              : seletedFilters.filter(elem => !(elem.indexOf("F-") > -1))
          }
        );
      };

      /**
       * Get Library Search Results based on search Text and filters selected from left panel
       *  @param {Array} filters
       *  @param {String} search
       *
       */
      onChangeHandleLibraryBySearch = ({ search: librarySearchString }) => {
        this.setState(
          {
            librarySearchString
          },
          () => this.fetchLibraryBySearch()
        );
      };

      fetchLibraryBySearch = () => {
        const {
          contentRepo: contentRepoId,
          seletedFilters,
          librarySearchString
        } = this.state;

        //check if length exists more than 3 and content repo is selected
        let checkStringLength =
          typeof librarySearchString === "string" &&
          (librarySearchString.length > 2 || librarySearchString.length === 0);

        //exit if contentRepoId Detail is not present
        if (
          typeof contentRepoId === "object" &&
          !Object.keys(contentRepoId).length
        ) {
          ToastUtils.handleToast({
            operation: "error",
            message: "Please select a Content Repo before searching slides."
          });
          return;
        }

        // get content slides list based on selected repo
        checkStringLength &&
          this.props.getLibraryBySearch(
            contentRepoId._id,
            this.state.selectedThemeLayout,
            {
              search: librarySearchString,
              filters: seletedFilters.filter(elem => !(elem.indexOf("F-") > -1))
            }
          );
      };

      /**
       * handle Theme, Cover Layout and checkbox change
       * @param {String} key contains propertyName
       * @param {String} value contains changed value
       */
      handleStateChange = ({ key, value, cb }) => {
        this.setState(
          {
            [key]: value
          },
          () => cb && cb()
        );
      };

      /**
       * handle setup textbox datachange
       * @param {String} label key name
       * @param {String} value value of the text field
       * @param {String} error error when validation fails
       */

      handleSetupDataChange = (label, value = "", error = "") => {
        let { buildSetupDetails } = this.state;

        buildSetupDetails[label] = buildSetupDetails[label]
          ? buildSetupDetails[label]
          : {};

        buildSetupDetails[label].value = value;
        buildSetupDetails[label].error = error;

        this.setState({
          buildSetupDetails
        });
      };

      // empty data on contentrepo change
      skipKeys = [
        "presentationName",
        "includeOverview",
        "includePageNumber",
        "customerName"
      ];
      clearSavedData = () => {
        let { buildSetupDetails } = this.state;
        this.props.resetPresentationDetails({
          presentationName: buildSetupDetails["presentationName"].value,
          customerName: buildSetupDetails["customerName"].value
        });

        for (let item in buildSetupDetails) {
          if (this.skipKeys.indexOf(item) === -1) {
            buildSetupDetails[item].value = "";
          }
        }
        this.setState({
          selectSlides: [],
          buildSetupDetails,
          selectedSlidesListDetail: []
        });
      };

      // handler for setting the slides id which are selected
      handleSelectSlides = (selectSlides, selectedSlidesListDetail = []) => {
        this.setState({
          selectSlides,
          selectedSlidesListDetail
        });
      };

      // set current overlay data
      currentOverlayDataHandler = () => {
        let currentOverlayData = this.props.slideDetails;

        // emptying overlayChangedDynamicImages on another modal open so that overlayChangedDynamicImages handles only one overlay data at a time
        this.setState({
          overlayChangedDynamicImages: [],
          currentOverlayData
        });

        this.setOverlayDynamicImages();
      };

      // set the current selected image from image folders(slider on thumbnail)
      setOverlayDynamicImages = (
        selectedImage = null, // the image currently on the slider
        placeholderPosition = null,
        type // the slider(image folder) which is being changed currently
      ) => {
        let { overlayChangedDynamicImages } = this.state;

        // this executes when dynamic data is changed by the user
        if (selectedImage && placeholderPosition !== null) {
          // put the current changed image into the respective slider
          overlayChangedDynamicImages[placeholderPosition] = selectedImage;

          this.setState({
            overlayChangedDynamicImages
          });
          return;
        }

        let { slideDetails } = this.props;

        slideDetails &&
          each(slideDetails.slideData, (imageCategories, slidedataIndex) => {
            if (get(imageCategories, `inputType`) === "image") {
              each(imageCategories.images, (image, index) => {
                if (index === 0) {
                  // if the overlay is not opened use the first image from the placeholders as default
                  overlayChangedDynamicImages.push(
                    imageCategories.images[index]
                  );
                }
              });
            } else {
              // if inputType is text and the overlay was not opened set the text as blank
              overlayChangedDynamicImages[slidedataIndex] = "";
            }
          });

        this.setState({
          overlayChangedDynamicImages
        });
      };

      /**
       *Format dynamic image data for api
       *
       */
      formatSlideDataForApi = singleSlideDetail => {
        let { overlayChangedDynamicImages } = this.state;
        let { slideData } = singleSlideDetail;

        // format the response as per the requirement of build api
        let formatCurrentOverlayData = {
          ...singleSlideDetail,
          slideData: slideData.map((data, index) => {
            let slideDataObj = {};

            let dimensions = {
              height: data.height,
              width: data.width,
              x: data.x,
              y: data.y
            };

            if (data.inputType === "image") {
              slideDataObj = {
                ...dimensions,
                image: {
                  imageId:
                    overlayChangedDynamicImages[index] &&
                    overlayChangedDynamicImages[index]._id,
                  imageDimensions: {
                    // TODO on image resize this should be the changed according to the resized image
                    ...dimensions
                  }
                }
              };
            } else if (data.inputType === "text") {
              slideDataObj = {
                ...dimensions,
                text: overlayChangedDynamicImages[index]
              };
            }
            return slideDataObj;
          })
        };

        return formatCurrentOverlayData;
      };

      /**
       * Fetch selected Cover details only
       *
       */
      getCoverDetails = coverId => {
        if (coverId) {
          this.getSingleSlideDetails(coverId, "cover");
        }
      };

      /**
       *Add cover/overview to set of slides
       *
       */
      addRequiredSlidesSlides = (slides = []) => {
        let { selectedCoverLayout } = this.state;
        let { coverDetails } = this.props;
        let addedSlides = [];
        // get overview
        let overview = this.getOverviewDetails();

        // Set isCover true flag
        if (selectedCoverLayout && coverDetails) {
          coverDetails["isCover"] = true;
          // Add cover if cover is not already present
          addedSlides = overview
            ? [coverDetails, ...slides, overview]
            : [coverDetails, ...slides];
        } else if (overview) {
          addedSlides = [...slides, overview];
        } else {
          addedSlides = [...slides];
        }
        return addedSlides;
      };

      // handler function to set the data to be sent while ppt build
      setSelectedSlidesData = singleSlideDetail => {
        let { selectedSlidesData, selectSlides } = this.state;
        // format each slide detail
        let formattedData = this.formatSlideDataForApi(singleSlideDetail);

        // content slide list
        let newContentSlides =
          selectedSlidesData && selectedSlidesData.length
            ? [...selectedSlidesData, formattedData]
            : [formattedData];

        // Reorder slide array wrt to selectSlides
        let sortedCollection = sortBy(newContentSlides, function(item) {
          return selectSlides.indexOf(item._id);
        });

        this.setState({
          selectedSlidesData: sortedCollection
        });
      };

      // on library page next button click
      librarySaveDataHandler = cb => {
        let { selectedSlidesData, selectSlides } = this.state;

        // slideId of the slides whose overlay has been opened
        let slideOverlaySeen = selectedSlidesData.map(slide => {
          return slide._id;
        });
        // slides whose overlay has not been opened
        const slideOverlayNotSeen = difference(selectSlides, slideOverlaySeen);
        let attributeList = this.getImageAttributeList();

        let postData = {
          slideIds: slideOverlayNotSeen,
          imageCategory: attributeList
        };

        // Get details of the slides which were not opened in overlay
        if (slideOverlayNotSeen.length > 0) {
          //TODO - reconfigure when dynamic text and images API is reequired
          this.getMultipleSlidesData(postData, cb);
        } else {
          cb && cb();
        }
      };

      /**
       *Remove required slides after drag and drop
       *
       */
      removeRequiredSlide = slides => {
        let { selectedCoverLayout, buildSetupDetails } = this.state;
        let { coverDetails } = this.props;

        // Set isCover true flag
        if (selectedCoverLayout && coverDetails) {
          slides.shift();
        }

        // Remove last element
        get(buildSetupDetails, "includeOverview.value") && slides.pop();

        return slides;
      };

      /**
       * Callback funtion for any slide order manipulation or new slide addition
       *  The slideData is formatted for sorting in the sort component and returned with extra keys like group for sorting purposes
       *
       */
      onPresentationEdit = slideData => {
        let contentSlides = this.removeRequiredSlide(slideData);
        // check data exists
        let dataSlides = filter(contentSlides, eachSlide =>
          get(eachSlide, `_id`)
        );

        // extract slides which were selected
        let selectSlides = map(dataSlides, eachSlide => {
          return get(eachSlide, `_id`);
        });

        this.setState({
          selectedSlidesListDetail: contentSlides,
          selectSlides
        });
      };

      /**
       * Handle save on sort component
       *
       */
      sortSaveDataHandler = () => {
        let { selectedSlidesListDetail } = this.state;

        let slideList = this.formatSlidesForApi(selectedSlidesListDetail) || [];
        return slideList.length ? { slides: slideList } : {};
      };

      /**
       *Format the slides data for api calls after sort
       *
       * @param {*} slides Slide list
       * @returns Formatted slide data
       */
      formatSlidesForApi = slides => {
        return map(slides, (eachSlide, index) => {
          let {
            type,
            _id,
            slideData,
            refId,
            slideId,
            title,
            changedTitle
          } = eachSlide;
          // Check if type is not defined type is available only in blank and divider slides
          // slide data for content slide
          if (!type) {
            return {
              slideId: _id,
              type: "contentSlide",
              slideTitle: changedTitle || title,
              order: index,
              ...(slideData && {
                slideData
              })
            };
          } else {
            let uniqueId = slideId ? slideId._id : refId || _id;
            //Slide data for blank or divider slide
            return {
              slideId: uniqueId,
              type,
              order: index,
              slideTitle: changedTitle || title,
              ...(slideData && {
                slideData
              })
            };
          }
        });
      };

      /**
       *Get the details of the selected slides
       *
       * @param {*} postData Id's of slides whose details are to be fetched
       * @param {*} cb Callback function
       */
      getMultipleSlidesData = async (postData, cb) => {
        await this.props.getMultipleSlidesIdForMetadata(
          postData,
          this.state.selectedThemeLayout,
          "content"
        );
        this.setSelectedSlidesForUnseenOverlay();
        cb && cb();
      };

      /**
       * Push slides in selected slides for whom overlay was not shown
       *
       */
      setSelectedSlidesForUnseenOverlay = () => {
        let { multipleSlideMetaData } = this.props;

        forEach(multipleSlideMetaData, slideMetaData =>
          this.setSelectedSlidesData(slideMetaData)
        );
      };

      // get image categories attribute ids
      getImageAttributeList = () => {
        let { selectedImageCategoryList } = this.state;

        let arrayOfCategories = Object.values(selectedImageCategoryList);

        let mergedCategories = flatten(arrayOfCategories);

        // get the selected image categories
        let attributeList = map(mergedCategories, image => {
          return get(image, `_id`); // attribute list id
        });

        return attributeList;
      };

      // common function to get slide details
      getSingleSlideDetails = async (id, type = "content") => {
        let imageCategoriesAttributeIds = this.getImageAttributeList();

        let response = await this.props.getSlideDetails(
          id,
          this.state.selectedThemeLayout,
          imageCategoriesAttributeIds,
          type
        );
        return response;
      };

      /**
       *Handle preview navigation
       *
       * @param {*} slidePosition Position of the index in which slide is present
       *
       */
      sliderBottomNavigation = async slidePosition => {
        const { selectedSlidesListDetail } = this.state;

        let withRequiredSlides = this.addRequiredSlidesSlides(
          selectedSlidesListDetail
        );

        // TODO: Handle get slide details on dynamic imagery
        // Check if cover add type statically else pass slideType
        // let type = get(withRequiredSlides[slidePosition], "isCover")
        //   ? "cover"
        //   : get(withRequiredSlides[slidePosition], "slideType") || "content";

        // // Pass the original Id for api call
        // let id =
        //   get(withRequiredSlides[slidePosition], "refId") ||
        //   get(withRequiredSlides[slidePosition], "_id");

        // TODO: Handle get slide details
        // let response = await this.getSingleSlideDetails(id, type);
        // if (!response.success) return;

        this.setState({
          activeSlideDetail: withRequiredSlides[slidePosition],
          slideName: "",
          isInputFocused: false
        });
        this._renderSlideData(); // set slideData on every navigation
      };

      /**
       *Create a array of Id of decks
       *
       * @param {*} slideIds
       */
      handleDeckSlidesIds = slideIds => {
        let { deckChildrenSlideId } = this.state;

        // extract the ids of all the slides in the deck
        let ids = map(slideIds, slideId => {
          return slideId._id;
        });

        deckChildrenSlideId.push(ids);
        this.setState({
          deckChildrenSlideId // array of arrays consisting of ids of slides in decks
        });
      };

      // sets the deck which the current selected slide is a part of
      currentDeckHandler = associatedDeckIndex => {
        this.setState({
          isSlideDeck: associatedDeckIndex === 0 || !!associatedDeckIndex, // determine if the current selected slide is a part of deck to show/hide bottom slider on overlay
          slidePartOfDeck: this.state.deckChildrenSlideId[associatedDeckIndex] // current selected slide part of which deck
        });
      };

      deleteLogoHandler = async logoId => {
        await this.props.deleteLogo(this.state.userDetail._id, logoId);
        // fetch the logo list on delete
        this.props.getCustomerLogoList(this.state.userDetail._id);

        // logo selected and the logo deleted from the list is same empty the placeholder
        if (logoId === this.state.selectedLogoId) {
          this.setState({
            selectedLogo: null
          });
        }
      };

      logoEditHandler = async (dataUrl, cropData) => {
        this.props.saveCroppedLogoDetails(
          this.state.userDetail._id,
          this.state.selectedLogoId,
          cropData
        );

        this.setState({
          cropData,
          croppedImage: dataUrl, // placeholder will now have the cropped image
          isImageCropperOpen: false
        });
      };

      imageCropperHandler = () => {
        if (this.state.selectedLogo) {
          this.setState(state => {
            return {
              isImageCropperOpen: !state.isImageCropperOpen
            };
          });
        }
      };

      // slide data to be shown on the top of slider
      _renderSlideData = () => {
        let { slideDetails } = this.props;
        this.setState({
          sliderDynamicData: get(slideDetails, `slideData`, [])
        });
      };

      /**
       * To maintain accordian closed and open state in themes
       * @param {number} index of a closed accordian
       */
      handleAccordianClosedState = index => {
        let { accordianClosedState } = this.state;
        if (accordianClosedState.indexOf(index) > -1) {
          accordianClosedState = accordianClosedState.filter(
            (elem, idx) => idx !== index
          );
        } else {
          accordianClosedState.push(index);
        }

        this.setState({
          accordianClosedState
        });
      };

      libraryScreenValidationHandler = () => {
        let { selectSlides } = this.state;

        if (selectSlides.length === 0) {
          ToastUtils.handleToast({
            operation: "error",
            message: "Please select slides to continue further."
          });
          return false;
        }
        return true;
      };

      /**
       * To have a common Next button handler for all the four process
       * @param {number} activeStep process number
       */
      nextStepHandler = stepToSetActive => {
        const { activeStep } = this.state;

        //go back if data is already saved..
        if (activeStep > stepToSetActive) {
          this.modifyStep(stepToSetActive);
          return;
        }

        if (!this.checkValidation(activeStep)) {
          return;
        }

        for (
          let activeIndex = activeStep;
          activeIndex <= 4 && stepToSetActive > 2;
          activeIndex++
        ) {
          if (!this.checkValidation(activeIndex)) return;
        }

        // check and save on all steps if step is skipped and create a general payload
        let cb = () => this.modifyStep(stepToSetActive);
        let savePptPayload = {};
        for (let index = activeStep; index < stepToSetActive; index++) {
          savePptPayload = {
            ...savePptPayload,
            ...this.saveDataHandler(index + 1, false, cb)
          };
        }

        // save step with all payload
        Object.keys(savePptPayload).length &&
          this.savePresentationDetails(savePptPayload, cb);
      };

      /**
       * To have a common skip button handler for all the four process
       * @param {number} activeStep process number
       */
      skipBtnHandler = () => {
        if (
          this.state.activeStep !== 1 &&
          !this.checkValidation(this.state.activeStep)
        )
          return;
        this.saveDataHandler(this.state.activeStep, true);
      };

      /**
       * This is the common function to have the validation check for the process/
       * @param {number} activeStep process number
       */
      checkValidation = activeStep => {
        switch (activeStep) {
          case 0:
            return this.setupStepValidation();
          case 1:
            return true;
          case 2:
            return this.libraryScreenValidationHandler();
          case 3:
            return true;
          case 4:
            return true;
          default:
            return null;
        }
      };

      setUpKeys = ["presentationName", "customerName", "title"];
      setupStepValidation = () => {
        let { buildSetupDetails, contentRepo } = this.state;
        let counter = 0,
          errorMessage;

        if (Object.keys(contentRepo).length) {
          let keys = Object.keys(buildSetupDetails) || [];

          for (let index = keys.length; index--; ) {
            if (
              (!buildSetupDetails[keys[index]].value ||
                buildSetupDetails[keys[index]].error) &&
              this.setUpKeys.indexOf(keys[index]) > -1
            ) {
              buildSetupDetails[keys[index]].error = !buildSetupDetails[
                keys[index]
              ].value
                ? UI_STRINGS.EMPTY_FIELD_ERROR_MESSAGE
                : buildSetupDetails[keys[index]].error;

              errorMessage = !buildSetupDetails[keys[index]].value
                ? UI_STRINGS.FIELD_ERROR_MESSAGE
                : UI_STRINGS.VALID_INPUT_ERROR_MESSAGE;
            } else if (buildSetupDetails[keys[index]].error) {
              counter++;
              errorMessage = UI_STRINGS.VALID_INPUT_ERROR_MESSAGE;
            }
          }

          this.setState(
            {
              buildSetupDetails: {}
            },
            () => {
              this.setState({
                buildSetupDetails
              });
            }
          );

          if (errorMessage) {
            errorMessage =
              counter > 0 ? UI_STRINGS.VALID_INPUT_ERROR_MESSAGE : errorMessage;
            ToastUtils.handleToast({
              operation: "error",
              message: errorMessage
            });
            return false;
          } else {
            return true;
          }
        } else {
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.CONTENT_REPO_ERROR_MESSAGE
          });
          return false;
        }
      };

      setupSaveDataHandler = () => {
        let setUpData = {};
        let {
          buildSetupDetails,
          contentRepo,
          selectedLogoId,
          cropData
        } = this.state;

        setUpData.contentRepository = contentRepo._id;
        let imageCategoriesAttributeIds = this.getImageAttributeList();
        if (imageCategoriesAttributeIds.length) {
          setUpData.imageCategories = imageCategoriesAttributeIds;
        }

        if (selectedLogoId && cropData && Object.keys(cropData).length) {
          setUpData.customerLogo = {
            logo: selectedLogoId,
            dimensions: cropData
          };
        } else if (selectedLogoId) {
          setUpData.customerLogo = {
            logo: selectedLogoId
          };
        }
        Object.keys(buildSetupDetails).forEach(item => {
          if (item === "presentationDate" && buildSetupDetails[item].value) {
            let date = new Date(buildSetupDetails[item].value);
            let value =
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate();
            setUpData[item] = value;
          } else if (buildSetupDetails[item].value) {
            setUpData[item] =
              typeof buildSetupDetails[item].value === "string"
                ? buildSetupDetails[item].value.trim()
                : buildSetupDetails[item].value;
          }
        });

        return setUpData;
      };

      saveDataHandler = (activeStep, skipData, cb) => {
        switch (activeStep - 1) {
          case 0:
            return this.setupSaveDataHandler();
          case 1:
            return this.themeSaveDataHanlder(skipData);
          case 2:
            this.librarySaveDataHandler(cb);
            return this.sortSaveDataHandler();
          case 3:
            return this.sortSaveDataHandler();
          default:
            return {};
        }
      };

      savePresentationDetails = async (payload, cb) => {
        let { presentationId, userDetail } = this.state;
        if (userDetail) {
          await this.props.createPresentation(
            userDetail._id,
            payload,
            presentationId
          );

          //hit callback when presentation is saved
          cb && cb();

          if (this.props.presentationData && !presentationId) {
            presentationId = this.props.presentationData._id;
            this.setState({
              presentationId
            });
          }
          return true;
        }
        return false;
      };

      //This function is used to save the data of the theme.
      themeSaveDataHanlder = skipData => {
        const { selectedThemeLayout, selectedCoverLayout } = this.state;
        let payload = {
          theme: selectedThemeLayout
        };

        //check if user has clicked skip or not
        if (!skipData && selectedCoverLayout) {
          // Get selected cover details
          this.getCoverDetails(selectedCoverLayout);

          payload.coverSlide = {
            cover: selectedCoverLayout
          };
          payload.includeCover = true;
        } else {
          let selectedTheme =
              (this.props.themeList && get(this.props.themeList[0], `_id`)) ||
              0,
            selectedCover =
              (this.props.coverList.length &&
                get(this.props.coverList[0], `coverSlides[0]._id`)) ||
              0;

          payload = {
            theme: selectedTheme
          };

          if (selectedCover) {
            // Get default selected cover details
            this.getCoverDetails(selectedCover);

            payload.coverSlide = {
              cover: selectedCover
            };
            payload.includeCover = true;
          }
        }

        return payload;
      };

      //change the Selected cover layout based on the checkbox value
      coverListHandler = value => {
        value
          ? this.setState({
              selectedCoverLayout:
                get(this.props.coverList[0], `coverSlides[0]._id`) || 0
            })
          : this.setState({
              selectedCoverLayout: null
            });
      };

      /**
       * Get the build progres by looping object keys of the completed steps in response.
       *
       * @param {*} response Build response object
       * @returns
       */
      getCompletedPercentage = response => {
        let { buildProgress } = this.state;
        let progress = { ...buildProgress };

        let completedSteps = intersection(
          ["coverSlideBuild", "contentSlidebuild", "concatPpt"],
          keys(response)
        );
        // Check if internal steps consist of failed steps
        // TODO: Not checking currently for content slide
        let failedSteps = filter(completedSteps, key => {
          return (
            response[key]["status"] && response[key]["status"] === "Failed"
          );
        });

        if (response.status === "Failed" || failedSteps.length) {
          progress = {
            percentage: 100,
            status: "Failed"
          };
        } else if (response.status === "Initialized") {
          // Iterate percentage
          let percentage = buildProgress.percentage
            ? buildProgress.percentage + 10
            : 10;
          if (percentage < 100) {
            progress = {
              percentage,
              status: "InProgress"
            };
          }
        } else if (
          response.status === "Completed" &&
          completedSteps.length === 3
        ) {
          progress = {
            percentage: 100,
            status: "Completed"
          };
        }
        return progress;
      };

      /**
       *The polling action for presentation build
       *
       * @param {*} id
       */
      pollingActionForBuild = async id => {
        let { getPresentationBuildStatus } = this.props;
        const { _id: userId } = this.state.userDetail;
        let { match } = this.props;
        // Presentation Id of the current presentation
        let presentationId =
          get(match, "params.id") || this.state.presentationId;

        let response = await getPresentationBuildStatus(id);

        let pollingResponseStatus = get(response, "data.status");
        let responseData = get(response, "data") || {};

        // Get progress data for show progress bar
        let progressData = this.getCompletedPercentage(responseData);
        this.setState({
          buildProgress: progressData
        });

        if (
          responseData &&
          pollingResponseStatus === "Completed" &&
          progressData.status !== "Failed"
        ) {
          // Get presentation data
          await this.props.getPresentationDetail(userId, presentationId);

          this.setState({
            isBuilding: false,
            pptLocation: responseData,
            buildProgress: progressData
          });

          PollingUtils.stopPolling();
        } else if (
          pollingResponseStatus === "Failed" ||
          progressData.status === "Failed"
        ) {
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.BUILD_ERROR,
            autoclose: false
          });
          PollingUtils.stopPolling();
          this.setState({
            isBuilding: false,
            buildProgress: progressData
          });
        }
      };

      /**
       *Function for starting polling for build
       *
       * @param {*} buildId
       */
      startBuildPolling = buildId => {
        PollingUtils.startPolling({
          pollingAction: () => {
            this.pollingActionForBuild(buildId);
          },
          timeoutCallback: () => {
            this.setState({
              isBuilding: false,
              buildProgress: {
                status: "Failed",
                percentage: 100
              }
            });
            ToastUtils.handleToast({
              operation: "error",
              message: UI_STRINGS.BUILD_ERROR,
              autoclose: false
            });
          }
        });
      };

      /**
       *Start Build process
       *
       * @param {*} { buildOption } The type of build selected ppt/pdf/zip
       */
      onBuild = async ({ buildOption: contentType }) => {
        let { match, presentationData, triggerPresentationBuild } = this.props;
        const { _id: userId } = this.state.userDetail;
        // Presentation Id of the current presentation
        let presentationId =
          get(match, "params.id") || get(presentationData, "_id");

        if (presentationId) {
          this.setState({
            buildProgress: {
              status: "InProgress",
              percentage: 0
            },
            isBuilding: true
          });
          let response = await triggerPresentationBuild(
            userId,
            presentationId,
            contentType
          );
          let { buildId } = response.data;
          // on successfully triggering build
          if (buildId) {
            this.startBuildPolling(buildId);
          } else {
            this.setState({
              isBuilding: false
            });
            // Show error message popup
            ToastUtils.handleToast({
              operation: "error",
              message: get(response, "data.message", false)
            });
          }
        } else {
          this.setState({
            isBuilding: false
          });
          // Show error message popup
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.UNSAVED_BUILD_ERROR
          });
        }
      };

      /**
       * Function to insert group of slides
       * @param {Array} slidesArr Set of selected slides when group or deck is selected
       * @param {Boolean} flag To insert or remove value in to an array
       * @param {String} groupName To check if group is selected
       * @returns
       */
      handleSelectedSlides = (slidesArr, flag, groupName, slidesData = []) => {
        let { selectSlides, selectedSlidesListDetail } = this.state;
        let { maximumSlideCount } = this.state;
        let counter = 0;
        if (flag && groupName) {
          // group
          if (
            selectSlides.length < maximumSlideCount &&
            maximumSlideCount - slidesArr.length >= selectSlides.length
          ) {
            each(slidesArr, (item, index) => {
              if (!includes(selectSlides, item)) {
                selectSlides.push(item);
                selectedSlidesListDetail.push(slidesData[index]);
              }
            });
          } else {
            counter++;
          }
        } else if (flag) {
          // deck
          each(slidesArr, (item, index) => {
            if (selectSlides.length < maximumSlideCount) {
              if (!includes(selectSlides, item)) {
                selectSlides.push(item);
                selectedSlidesListDetail.push(slidesData[index]);
              }
            } else {
              counter++;
            }
          });
        } else {
          each(slidesArr, item => {
            selectSlides = selectSlides.filter(id => id !== item);

            // remove changedTitle property from slide which is getting removed
            each(selectedSlidesListDetail, eachSlide => {
              if (get(eachSlide, `changedTitle`)) {
                delete eachSlide.changedTitle;
              }
            });
            selectedSlidesListDetail = selectedSlidesListDetail.filter(
              ({ _id: slideId }) => slideId !== item
            );
          });
        }

        if (counter > 0) {
          this.handleToastError(
            "error",
            `You have reached a limit of ${maximumSlideCount} slides.`
          );
        }

        this.updateSelectedSlidesData(selectSlides);
        this.handleSelectSlides(selectSlides, selectedSlidesListDetail);
      };

      /**
       *Update selected slides data
       *
       * @param {*} selectSlides Pass an array of Id on the basis of which the Id needs to be filtered
       */
      updateSelectedSlidesData = selectSlides => {
        let { selectedSlidesData } = this.state;
        // Remove selected slidedata
        let newSelectedData = filter(
          selectedSlidesData,
          ({ _id }) => selectSlides.indexOf(_id) > -1
        );
        this.setState({ selectedSlidesData: newSelectedData });
      };

      /** Toast Error handler */
      handleToastError = (type, message) => {
        ToastUtils.handleToast({
          operation: type,
          message: message
        });
      };

      /**
       * Checkbox handler
       * @param {Event} e
       * @param {String} groupName Group name of a selected group
       * @param {Array} children Set of slides
       */
      handleCheckBoxChange = (checked, id, groupName, children, slideData) => {
        let { groupId } = this.state;
        if (groupName) {
          groupId = [];
          let groupSlidesDetail = [];
          children &&
            each(children, child => {
              if (child.group && child.group.title === groupName) {
                groupId.push(child._id);
                groupSlidesDetail.push(child);
              }
            });
          if (checked) {
            this.handleSelectedSlides(
              groupId,
              checked,
              groupName,
              groupSlidesDetail
            );
          } else {
            this.handleSelectedSlides(
              groupId,
              checked,
              groupName,
              groupSlidesDetail
            );
          }
        } else {
          this.handleSingleCheckbox(id, false, slideData);
        }
      };

      /**
       * Function to add single slide
       * @param {Number} id single slide id
       */
      handleSingleCheckbox = (id, flag = false, slideData) => {
        let {
          maximumSlideCount,
          selectSlides,
          selectedSlidesListDetail
        } = this.state;

        if (!includes(selectSlides, id)) {
          if (selectSlides.length < maximumSlideCount) {
            selectSlides.push(id);
            selectedSlidesListDetail.push(slideData);
            if (flag)
              this.handleToastError(
                "success",
                "Slide has been added to the presentation."
              );
          }
        } else {
          if (flag)
            this.handleToastError(
              "success",
              "Slide has been removed from the presentation."
            );
          selectSlides = filter(selectSlides, _id => _id !== id);

          // remove changedTitle property if the slide is removed
          each(selectedSlidesListDetail, eachSlide => {
            if (get(eachSlide, `changedTitle`) && eachSlide._id === id) {
              delete eachSlide.changedTitle;
            }
          });
          selectedSlidesListDetail = filter(
            selectedSlidesListDetail,
            (item = {}) => item._id !== id && item.refId !== id
          );
        }
        this.updateSelectedSlidesData(selectSlides);
        this.handleSelectSlides(selectSlides, selectedSlidesListDetail);
      };

      /**
       * To remove slide from preview
       *
       * @param {Boolean} flag to add or remove group
       * @param {String} id to be added or removed
       */
      addRemoveSlideFromPreview = (flag, slideData) => {
        let { contentSlideGroups, activeSlideDetail } = this.state;
        let { _id, refId } = activeSlideDetail || {};
        let grpName = "";
        //
        let slideId = _id || slideData._id;

        contentSlideGroups &&
          Object.keys(contentSlideGroups).forEach(item => {
            contentSlideGroups[item].forEach(elem => {
              if (slideId === elem._id) {
                grpName = item;
              }
            });
          });

        if (grpName) {
          let groupSlideIds =
            Array.isArray(contentSlideGroups[grpName]) &&
            contentSlideGroups[grpName].map(({ _id }) => _id);

          DeleteConfirmationAlert({
            message: flag
              ? UI_STRINGS.ADD_GROUP_SLIDE_WARNING_MESSAGE
              : UI_STRINGS.REMOVE_GROUP_SLIDE_WARNING_MESSAGE,
            onYesClick: () => {
              this.handleSelectedSlides(
                groupSlideIds,
                flag,
                grpName,
                contentSlideGroups[grpName]
              );
            }
          });
        } else {
          if (refId) {
            this.handleRemoveDividerBlank();
          } else {
            activeSlideDetail &&
              this.handleSingleCheckbox(slideId, false, slideData);
          }
        }
      };

      /**
       * Remove divider and blank slides from the presentation
       *
       */
      handleRemoveDividerBlank = () => {
        let {
          selectedSlidesListDetail,
          activeSlideDetail,
          selectSlides
        } = this.state;
        let { _id } = activeSlideDetail || {};

        selectedSlidesListDetail = filter(
          selectedSlidesListDetail,
          (item = {}) => item._id !== _id
        );
        this.handleSelectSlides(selectSlides, selectedSlidesListDetail);
      };

      /**
       * Check if the passed Id is added to presentation list and return its details
       * NOTE: Make sure to pass the refId for blank and dividers
       *
       * @param {*} id Id of the slide which needs to be checked
       * @param {*} slides Array of slides which needs to be checked
       * @returns If the passed Id is present in the presentation return its details else return null
       */
      checkAndFindSlideDetail = (id, slides) => {
        let { selectedSlidesListDetail } = this.state;

        // If slides is passed wil check in the slides deck or else will default to thhe presentation list
        let checkSlides = slides || selectedSlidesListDetail;

        let slideDetail = filter(checkSlides, (eachSlide = {}) => {
          let originalId = eachSlide.refId || eachSlide._id;
          return originalId === id;
        });
        if (slideDetail[0]) return slideDetail[0];
        return null;
      };

      /**
       *Handle preview Modal pass id in sort screen to show the current slide with selected slides
       *
       */
      onPreview = async (id, isCover, isOverview) => {
        let { selectedSlidesListDetail } = this.state;
        let currentOpenSlide = {};
        // Required slides
        let withRequiredSlides = this.addRequiredSlidesSlides(
          selectedSlidesListDetail
        );
        // Required slide with ids
        let withRequiredSlidesId = map(withRequiredSlides, (eachSlide = {}) => {
          return eachSlide._id;
        });

        if (id) {
          currentOpenSlide = this.checkAndFindSlideDetail(id);
        } else if (isCover) {
          currentOpenSlide = withRequiredSlides[0];
        } else if (isOverview) {
          currentOpenSlide = withRequiredSlides[withRequiredSlides.length - 1];
        } else {
          currentOpenSlide = withRequiredSlides[0];
        }

        // handle dynamic images
        this.currentOverlayDataHandler();

        // if preview presentation is clicked just open the modal
        if (!this.state.selectSlides.length) {
          ToastUtils.handleToast({
            operation: "error",
            message: "Please select slides to Preview."
          });
          return;
        }
        this.setState({
          slidePartOfDeck: withRequiredSlidesId,
          isSlideDeck: true,
          showModal: true,
          activeSlideDetail: currentOpenSlide
        });
      };

      /**
       *Handle preview modal. This function is used only to open preview on click of content slides in library.
       *
       * @param {*} id Slide Id
       * @param {*} childList Array of group set to which the selected slide belongs
       * @returns
       */
      handleModal = async (id, childList = [], slideData) => {
        let attributeList = this.getImageAttributeList();
        // resetting the value of associatedDeckIndex by setting it to null
        this.currentDeckHandler(null);
        let response = await this.props.getSlideDetails(
          id,
          this.state.selectedThemeLayout,
          attributeList,
          get(slideData, "slideType")
        );

        // exit if there is an error in response
        if (!response.success) return;

        this.currentOverlayDataHandler();

        let { deckChildrenSlideId } = this.state;
        // checking if the current selected id is a part of the deck
        map(deckChildrenSlideId, (slideId, associatedDeckIndex) => {
          map(slideId, deckId => {
            if (deckId === id) {
              // if current slide is a part of deck set the associated deck
              this.currentDeckHandler(associatedDeckIndex);
            }
          });
        });

        handleBodyScroll({ action: "open" });
        this.setState({
          showModal: true,
          slideName: "", // unset slideName for another slide editing
          activeSlideDetail: slideData,
          isInputFocused: false
        });
      };
      //end

      closeModal = () => {
        handleBodyScroll({ action: "close" });
        this.setState({
          showModal: false,
          activeSlideDetail: {},
          slideName: "",
          isInputFocused: false
        });
      };

      hideModal = e => {
        if (
          e.target.classList.contains("modal-preview-container") ||
          e.target.classList.contains("modal-preview-subcontainer")
        ) {
          handleBodyScroll({ action: this.state.showModal ? "close" : "open" });
          this.setState({ showModal: !this.state.showModal });
        }
      };

      setSlideTitle = (e, revertToOldName = false) => {
        let { activeSlideDetail } = this.state;

        this.setState({
          slideName: revertToOldName
            ? get(activeSlideDetail, `changedTitle`) ||
              get(activeSlideDetail, `title`)
            : e.target.value
        });
      };

      focusInputHandler = () => {
        this.setState({
          isInputFocused: true
        });
      };

      saveSlideTitle = () => {
        let { slideName } = this.state;

        if (!slideName) {
          ToastUtils.handleToast({
            operation: "error",
            message: "Please enter a valid slide title."
          });
          return false;
        }

        let { selectedSlidesListDetail, activeSlideDetail } = this.state;

        let newSelectedSlides = map(selectedSlidesListDetail, slideDetail => {
          if (get(slideDetail, `_id`) === get(activeSlideDetail, `_id`)) {
            slideDetail.changedTitle = slideName;
            return slideDetail;
          } else {
            return slideDetail;
          }
        });

        this.setState({
          selectedSlidesListDetail: newSelectedSlides
        });

        return true;
      };

      // Handle Edit click button
      onEdit = () => {
        this.modifyStep(0);
      };

      /**
       *Get thumbnail/file location based on the selected theme
       *
       * @param {*} type thumbnail/ file
       * @param {*} themeId Currently selected theme ID
       * @param {*} themedSlides Slides based on available themes
       */
      getThemeBasedUrl = (themeId, themedSlides, type = "thumbnail") => {
        let selectedThemeSlide = filter(themedSlides, slide => {
          // Check if the themeId matches selected theme and return the slide
          return get(slide, "themeId") === themeId;
        });
        if (selectedThemeSlide.length && type === "thumbnail") {
          return get(selectedThemeSlide[0], "thumbnailLocation.url");
        } else if (selectedThemeSlide.length && type === "file") {
          return get(selectedThemeSlide[0], "fileLocation.url");
        }
        return null;
      };

      /**
       *Check if the currently active slide in preview is added to presentation
       *
       */
      checkIfAddedToPresentation = () => {
        let { activeSlideDetail, selectSlides } = this.state;

        let id =
          get(activeSlideDetail, "refId") || get(activeSlideDetail, "_id");
        // Check if id is present
        let details = this.checkAndFindSlideDetail(id);

        let isAdded = details && Object.keys(details).length;

        return (
          isAdded || selectSlides.indexOf(get(activeSlideDetail, `_id`)) > -1
        );
      };

      // TODO: Overview slide details get from backend
      getOverviewDetails = () => {
        let { buildSetupDetails } = this.state;
        if (get(buildSetupDetails, "includeOverview.value")) {
          return {
            _id: "overviewSlide",
            thumbnailLocation: Overview,
            isOverview: true,
            title: "Overview",
            isDraggable: false
          };
        }
        return null;
      };

      render() {
        const $this = this;
        /** Merge States and Methods */
        const stateMethodProps = {
          ...$this,
          ...$this.state,
          ...$this.props
        };

        return <Main {...stateMethodProps} />;
      }
    }
  );

export default Container;
