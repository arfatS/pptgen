import contentRepoReducers from "./setupContentRepoList/reducer";
import customerLogo from "./setupCustomerLogoList/reducer";
import themeCoverReducers from "./themeCoverList/reducer";
import dynamicCoverFieldsReducers from "./presentationDynamicFields/reducer";
import imageCategoryListReducers from "./imageCategoryList/reducer";
import libraryOverlay from "./libraryOverlay/reducer";
import libraryTopicSearchReducers from "./libraryTopicSearchFilters/reducer";
import dividerBlankSlideListReducers from "./dividerBlankSlideList/reducer";
import savePresentationReducers from "./saveBuildData/reducer";
import triggerPresentationBuild from "./triggerPresentationBuild/reducer";
import presentationBuildStatus from "./presentationBuildStatus/reducer";

export default {
  ...contentRepoReducers,
  ...themeCoverReducers,
  ...customerLogo,
  ...dynamicCoverFieldsReducers,
  ...imageCategoryListReducers,
  ...libraryTopicSearchReducers,
  ...dividerBlankSlideListReducers,
  ...libraryOverlay,
  ...savePresentationReducers,
  ...triggerPresentationBuild,
  ...presentationBuildStatus
};
