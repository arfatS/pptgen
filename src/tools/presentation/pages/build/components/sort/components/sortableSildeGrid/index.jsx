import React from "react";
import SlideThumbnail from "./components/slideThumbnail";
import SlideList from "./components/slideList";
import DraggableSort from "components/draggableSort";
import { get } from "lodash";

const SortableGrid = props => {
  let isThumbnailLayout = props.selectedLayout === "thumbnail";
  let {
    slideList,
    slidesInEachRow,
    onDragOverExternalCallback,
    onListUpdate,
    allowExternalDrop,
    UI_STRINGS,
    onDeleteSlide,
    onPreviewSlide,
    onPreview,
    selectedSlidesListDetail,
    buildSetupDetails
  } = props;
  // If single image is shown in row in thumbnail layout drag and drop should occour in vertical axis
  let draggableAxis = isThumbnailLayout && slidesInEachRow !== 1 ? "x" : "y";
  return (
    <DraggableSort
      onListUpdate={onListUpdate}
      style={getStyle(isThumbnailLayout, slideList)}
      axis={draggableAxis}
      listData={slideList}
      onDragOverExternalCallback={onDragOverExternalCallback}
      allowExternalDrop={allowExternalDrop}
      handleGroups={true}
      groupDropError={UI_STRINGS.GROUP_ERROR_MESSAGE}
      renderChild={(data, index) =>
        isThumbnailLayout ? (
          <SlideThumbnail
            key={data._id}
            data={data}
            {...data}
            slidesInEachRow={slidesInEachRow}
            index={index}
            onDeleteSlide={onDeleteSlide}
            onPreviewSlide={onPreviewSlide}
            onPreview={onPreview}
            selectedSlidesListDetail={selectedSlidesListDetail}
            coverTitle={get(buildSetupDetails, `title.value`)}
          />
        ) : (
          <SlideList
            key={data._id}
            data={data}
            {...data}
            index={index}
            onDeleteSlide={onDeleteSlide}
            onPreviewSlide={onPreviewSlide}
            onPreview={onPreview}
            selectedSlidesListDetail={selectedSlidesListDetail}
            coverTitle={get(buildSetupDetails, `title.value`)}
          />
        )
      }
    />
  );
};

const getStyle = (isThumbnailLayout, list = []) => {
  let height = 0;
  let length = list && list.length;
  if (length) {
    if (length < 6) {
      // Static height of each row is 48px
      height = Math.ceil(length) * 48;
    } else {
      height = Math.ceil(length / 3) * 48;
    }
  }

  if (isThumbnailLayout) {
    return {
      width: "100%",
      display: "flex",
      flexWrap: "wrap"
    };
  } else {
    return {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      height
    };
  }
};

export default SortableGrid;
