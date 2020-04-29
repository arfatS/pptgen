import React from "react";
import styled from "styled-components";

import StepDetails from "components/buildProcess/stepDetails";
import FilterRates from "./components/filter";
import RatesTable from "./components/ratesTable";
import SelectedRatesDetail from "./components/details";
import featureFlags from "utils/featureFlags";
import { get } from "lodash";

const SelectRatesComponent = props => {
  let unsavedData = !!props.isEdited;
  return (
    <>
      <StepDetails
        _continue
        _save={unsavedData}
        title={"Select Rates"}
        onSave={props.onSave}
        onPreview={props.onPreview}
        {...props}
      />
      <SelectRatesContainer className="clearfix">
        <FilterRatesListContainer>
          <FilterRates {...props} />
          <RatesTable {...props} />
        </FilterRatesListContainer>
        <SelectedRatesDetail
          {...props}
          allowCobrandLogoUpload={get(
            featureFlags,
            "renewal.allowCobrandLogoUpload"
          )}
        />
      </SelectRatesContainer>
    </>
  );
};

const FilterRatesListContainer = styled.div`
  display: inline-block;
  vertical-align: top;
`;

const SelectRatesContainer = styled.div`
  padding-top: 8px;
  margin-bottom: 50px;
`;

export default SelectRatesComponent;
