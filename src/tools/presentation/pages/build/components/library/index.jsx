import React from "react";
import styled from "styled-components";
import Container from "./container";
import StepDetails from "components/buildProcess/stepDetails";
import SearchBox from "components/searchBox";
import { Filters } from "./components/Filters";
import { ViewTabs } from "./components/ViewTabs";

/**
 * Main library component
 * @param {*} props
 */
const Library = props => {
  let {
    selectSlides,
    selectedTabValue,
    maximumSlideCount,
    handleLibrarySearchChange,
    nextStepHandler,
    librarySearchString,
    onPreview
  } = props;

  return (
    <LibraryWrapper>
      <StepDetails
        _content
        _showCount
        maximumSlideCount={maximumSlideCount}
        _slideCount={selectSlides.length}
        _preview
        _save
        _next
        title={"Library"}
        description={selectedTabValue}
        onNext={() => nextStepHandler(3)}
        onPreview={() => onPreview()}
      />
      <LibraryMainContainer>
        <FiltersAside>
          <Filters {...props} />
        </FiltersAside>
        <LibraryMain>
          {selectedTabValue === "View by Search" ? (
            <SearchBox
              handleChange={handleLibrarySearchChange}
              float="initial"
              placeholder={"Please enter a slide name..."}
              defaultValue={librarySearchString || ""}
            />
          ) : (
            ""
          )}
          <ViewContainer>
            <ViewTabs {...props} />
          </ViewContainer>
        </LibraryMain>
      </LibraryMainContainer>
    </LibraryWrapper>
  );
};

const LibraryWrapper = styled.div``;

const FiltersAside = styled.aside`
  padding: 12px 12px 73px;
  flex-basis: 24%;
  align-self: baseline;
  border-radius: 4px;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
`;

const LibraryMainContainer = styled.div`
  margin: 38px 0;
  display: flex;
  justify-content: space-between;
`;

const LibraryMain = styled.div`
  flex-basis: 68.9%;

  .search-wrapper {
    margin-bottom: 27px;
    width: 100%;

    input {
      min-width: auto;
      width: calc(100% - 45px);
    }
  }
`;

const ViewContainer = styled.div`
  .tabsData {
    padding-top: 12px;
    border-radius: 3px;
    background-color: ${props => props.theme.COLOR.WHITE};
    display: none;
    position: relative;
    ${props => props.theme.SNIPPETS.BOX_SHADOW};

    &.active-tab {
      display: block;
    }
  }
`;

export default Container(Library);
