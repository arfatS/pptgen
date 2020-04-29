import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";
import { ConvertQueryParamsArrayObjectToString } from "utils/queryString";

//import content repo actions
import {
  onLibrarySearchSuccess,
  onLibraryTopicSuccess,
  onLibraryFilters,
  isLibraryFiltersLoading,
  isLibraryTopicSearchLoading
} from "./actions";

/**
 * Get Library Filters List
 */
const getLibraryFiltersList = () => async dispatch => {
  const URL = `/content-filters`;

  // start loading
  dispatch(isLibraryFiltersLoading({ isFiltersLoading: true }));

  const response = await FetchUtils.getData(
    URL,
    "Get Libray By Topic for Setup==>"
  );

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onLibraryFilters({
        libraryFiltersList: response.data
      })
    );
    // stop loading
    dispatch(isLibraryFiltersLoading({ isFiltersLoading: false }));
  } else {
    // stop loading
    dispatch(isLibraryFiltersLoading({ isFiltersLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

/**
 * Get Topic Library List for presentation setup
 * @param contentRepoId - Selected ContentRepo
 * @param selectedTheme - Selected Theme
 *
 */
const getLibraryByTopic = (
  contentRepoId,
  selectedTheme,
  { filters }
) => async dispatch => {
  const filtersList =
    (Array.isArray(filters) && filters.map(elem => ({ "filter[]": elem }))) ||
    [];

  const params = ConvertQueryParamsArrayObjectToString([...filtersList]);

  const URL = `/${contentRepoId}/${selectedTheme}/content-slides${
    params ? `?${params}` : ""
  }`;
  // start loading
  dispatch(isLibraryTopicSearchLoading({ isTopicSearchLoading: true }));

  const response = await FetchUtils.getData(
    URL,
    "Get Libray By Topic for Setup==>"
  );

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onLibraryTopicSuccess({
        libraryByTopicList: response.data
      })
    );
    // stop loading
    dispatch(isLibraryTopicSearchLoading({ isTopicSearchLoading: false }));
  } else {
    // stop loading
    dispatch(isLibraryTopicSearchLoading({ isTopicSearchLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

/**
 * Get Search Library List for presentation setup
 * @param contentRepoId - Selected ContentRepo
 * @param selectedTheme - Selected Theme
 *
 */
const getLibraryBySearch = (
  contentRepoId,
  selectedTheme,
  { search, filters }
) => async dispatch => {
  const filtersList = filters.map(elem => ({ "filter[]": elem }));

  const params = ConvertQueryParamsArrayObjectToString([
    { search },
    {
      searchByTopic: true
    },
    ...filtersList
  ]);

  const URL = `/${contentRepoId}/${selectedTheme}/content-slides${
    params ? `?${params}` : ""
  }`;

  // start loading
  dispatch(isLibraryTopicSearchLoading({ isTopicSearchLoading: true }));

  const response = await FetchUtils.getData(
    URL,
    "Get Libray By Search for Setup==>"
  );

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onLibrarySearchSuccess({
        libraryBySearchList: search ? response.data : []
      })
    );
    // stop loading
    dispatch(isLibraryTopicSearchLoading({ isTopicSearchLoading: false }));
  } else {
    // stop loading
    dispatch(isLibraryTopicSearchLoading({ isTopicSearchLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getLibraryByTopic, getLibraryBySearch, getLibraryFiltersList };
