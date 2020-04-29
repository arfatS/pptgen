import React from "react";
import CustomTable from "components/customTable";
import Container from "./container";
import Loader from "components/loader";
import "react-toastify/dist/ReactToastify.css";
import FullPageLoader from "components/FullPageLoader";
import BgWrapper from "components/bgWrapper";

const HELPER_TEXT =
  "Welcome to the Rates Dashboard. You can add rates by clicking “New” or you can download, edit or delete rates below.";

const Underwriter = props => {
  return (
    <>
      {props.isShowFullPageLoader && <FullPageLoader />}
      <>
        {props.isRenderTable ? (
          <CustomTable
            data={props.state.data}
            tableHeader={props.state.cols}
            columnWidth={props.columnWidth}
            searchFields={props.searchFields}
            tableColumnHeader={props.tableColumnHeader}
            onClickDelete={({ id, record }) =>
              props.onClickDelete({
                id,
                record,
                cb: props.deleteSuccessCallBack
              })
            }
            heading="Rates"
            handleNewButtonClick={props.createNewRateRoute}
            updateRateRoute={props.updateRateRoute}
            renderHead={props.renderHead}
            helperText={HELPER_TEXT}
            {...{ role: "underwriter" }}
          />
        ) : (
          <Loader />
        )}
      </>
    </>
  );
};

export default Container(BgWrapper(Underwriter));
