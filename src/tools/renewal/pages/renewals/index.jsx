import React from "react";
import CustomTable from "components/customTable";
import Container from "./container";
import Loader from "components/loader";
import "react-toastify/dist/ReactToastify.css";
import BgWrapper from "components/bgWrapper";
import FullPageLoader from "components/FullPageLoader";

const Sales = props => {
  return (
    <>
      {props.isFullPageLoaderActive && <FullPageLoader />}
      {props.isRenderTable ? (
        <CustomTable
          data={props.state.data}
          tableHeader={props.state.cols}
          columnWidth={props.columnWidth}
          searchFields={props.searchFields}
          showIcon={props.showIcon}
          tableColumnHeader={props.tableColumnHeader}
          heading="Renewals"
          _hideUnhideRenwal={props._hideUnhideRenwal}
          handleRadioButtonChange={props.handeRenewalActiveStatus}
          onClickDelete={props._openConfirmationAlert}
          renderHead={props.renderHead}
          handleNewButtonClick={props.handleNewButtonClick}
          expanderWidth={"25"}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Container(BgWrapper(Sales));
