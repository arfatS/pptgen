//import network services
import { getContentRepoList } from "./services/setupContentRepoList";
import { triggerPresentationBuild } from "./services/triggerPresentationBuild";

import {
  getCustomerLogoList,
  createNewCustomerLogo,
  deleteLogo,
  saveCroppedLogoDetails
} from "./services/setupCustomerLogoList";

import { getThemeList, getCoverList } from "./services/themeCoverList";
import { getDynamicCoverFieldsList } from "./services/presentationDynamicFields";
import { getImageCategoryListOfSelectedRepo } from "./services/imageCategoryList";

import {
  getLibraryBySearch,
  getLibraryByTopic,
  getLibraryFiltersList
} from "./services/libraryTopicSearchFilters";

import {
  getDividerListOfSelectedRepo,
  getBlankSlideListOfSelectedRepo
} from "./services/dividerBlankSlideList";

import {
  getMultipleSlidesIdForMetadata,
  getSlideDetails
} from "./services/libraryOverlay";

import {
  createPresentation,
  getPresentationDetail,
  resetPresentationDetails
} from "./services/saveBuildData";
import { getPresentationBuildStatus } from "./services/presentationBuildStatus";

const mapStateToProps = state => {
  const {
    SUCCESS_USER_PROFILE,
    SUCCESS_LIBRARY_FILTERS,
    SUCCESS_LIBRARY_SEARCH,
    SUCCESS_LIBRARY_TOPIC,
    SUCCESS_IMAGE_CATEGORY_LIST,
    SUCCESS_DYNAMIC_COVER_FIELDS,
    SUCCESS_SETUP_CONTENTREPO,
    SUCCESS_CUSTOMER_LOGO,
    SUCCESS_THEME,
    SUCCESS_COVER,
    LOADING_THEME,
    LOADING_COVER,
    LOADING_SETUP_CONTENTREPO,
    LOADING_DYNAMIC_COVER_FIELDS,
    LOADING_IMAGE_CATEGORY_LIST,
    LOADING_LIBRARY_TOPIC_SEARCH,
    LOADING_LIBRARY_FILTERS,
    LOADING_CUSTOMER_LOGO,
    LOADING_SLIDE_DETAILS,
    SUCCESS_DIVIDER_LIST,
    LOADING_DIVIDER_LIST,
    SUCCESS_BLANK_SLIDE_LIST,
    LOADING_BLANK_SLIDE_LIST,
    SUCCESS_SLIDE_DETAILS,
    SUCCESS_MULTIPLE_SLIDES_DATA,
    LOADING_SAVING_DATA,
    SUCCESS_PRESENTATION_DATA,
    SUCCESS_PRESENTATION_BUILD,
    LOADING_PRESENTATION_BUILD,
    RESET_PRESENTATION_DATA
  } = state;
  return {
    ...LOADING_CUSTOMER_LOGO,
    ...LOADING_LIBRARY_FILTERS,
    ...LOADING_THEME,
    ...LOADING_COVER,
    ...LOADING_SETUP_CONTENTREPO,
    ...LOADING_DYNAMIC_COVER_FIELDS,
    ...LOADING_IMAGE_CATEGORY_LIST,
    ...LOADING_LIBRARY_TOPIC_SEARCH,
    ...SUCCESS_SETUP_CONTENTREPO,
    ...SUCCESS_CUSTOMER_LOGO,
    ...SUCCESS_THEME,
    ...SUCCESS_COVER,
    ...SUCCESS_DYNAMIC_COVER_FIELDS,
    ...SUCCESS_IMAGE_CATEGORY_LIST,
    ...SUCCESS_LIBRARY_SEARCH,
    ...SUCCESS_LIBRARY_TOPIC,
    ...SUCCESS_LIBRARY_FILTERS,
    ...LOADING_SLIDE_DETAILS,
    ...SUCCESS_DIVIDER_LIST,
    ...LOADING_DIVIDER_LIST,
    ...SUCCESS_BLANK_SLIDE_LIST,
    ...LOADING_BLANK_SLIDE_LIST,
    ...SUCCESS_USER_PROFILE,
    ...SUCCESS_SLIDE_DETAILS,
    ...SUCCESS_MULTIPLE_SLIDES_DATA,
    ...LOADING_SAVING_DATA,
    ...SUCCESS_PRESENTATION_DATA,
    ...SUCCESS_PRESENTATION_BUILD,
    ...LOADING_PRESENTATION_BUILD,
    ...RESET_PRESENTATION_DATA
  };
};

const actions = {
  getContentRepoList,
  getCustomerLogoList,
  getThemeList,
  getCoverList,
  createNewCustomerLogo,
  getDynamicCoverFieldsList,
  getImageCategoryListOfSelectedRepo,
  getLibraryByTopic,
  getLibraryBySearch,
  getLibraryFiltersList,
  deleteLogo,
  saveCroppedLogoDetails,
  getDividerListOfSelectedRepo,
  getBlankSlideListOfSelectedRepo,
  getMultipleSlidesIdForMetadata,
  getSlideDetails,
  createPresentation,
  getPresentationDetail,
  triggerPresentationBuild,
  getPresentationBuildStatus,
  resetPresentationDetails
};

export { mapStateToProps, actions };
