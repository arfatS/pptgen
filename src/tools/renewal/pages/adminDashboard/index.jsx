import React from "react";
import CustomTable from "components/customTable";
import Container from "./container";
import Loader from "components/loader";
import BgWrapper from "components/bgWrapper";
import FullPageLoader from "components/FullPageLoader";

const Admin = props => {
  return (
    <>
      {props.isFullPageLoaderActive && <FullPageLoader />}
      {props.isRenderTable ? (
        <CustomTable
          data={props.state.data}
          tableHeader={props.state.cols}
          columnWidth={props.state.columnWidth}
          searchFields={props.searchFields}
          updateRateRoute={props.updateRateRoute}
          tableColumnHeader={props.state.tableColumnHeader}
          handleRadioButtonChange={props.handeRenewalActiveStatus}
          tabName={props.tabName}
          tabs={props.tabs}
          showIcon={props.showIcon}
          renderHead={props.renderTabs}
          ratesValue={props.ratesValue}
          renewalsValue={props.renewalsValue}
          role={props.role}
          handleNewButtonClick={props.handleNewButtonClick}
          expanderWidth={props.tabName === "Renewals" ? "25" : null}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Container(BgWrapper(Admin));
