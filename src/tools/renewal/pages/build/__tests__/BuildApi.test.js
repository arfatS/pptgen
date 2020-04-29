//imports mocks for API resolved request to compare with recieved snapshots for services
import rateList from "../__mocks__/rateList";
import stateList from "../__mocks__/stateList";
import savedSelectedRatesDetail from "../__mocks__/saveSelectedRatesDetail";

//import services used in Build Component
import * as BuildServices from "../services";

//import axios and mock it with jest to resolve response for HTTP methods
import axios from "axios";
jest.mock("axios");

//=================With async/await=============================

describe("Build: Build Process Network Calls", () => {
  it("Build: GET Rate List", async () => {
    axios.get.mockResolvedValue(rateList);

    const params = {
      state: "",
      searchText: "hap",
      startDate: "2019-09-07",
      endDate: "2019-10-07"
    };

    const response = await BuildServices.getRenewalDashboardRatesList(params);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(rateList.data.data);
    expect(response).toMatchSnapshot();
  });

  it("Build: Test GET State List", async () => {
    axios.get.mockResolvedValue(stateList);

    const response = await BuildServices.fetchStateListForRateListFilter();
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(stateList.data.data);
    expect(response).toMatchSnapshot();
  });

  it("Build: Test POST mock rate detail to create new renewal", async () => {
    axios.post.mockResolvedValue(savedSelectedRatesDetail);

    const body = {
      customerName: "John",
      customerNumber: "6031579",
      employerContact: "",
      policyNumber: "62980102",
      rateId: "5d95f98ed8517e000821029f",
      renewalRepresentative: "",
      status: "Saved"
    };

    const response = await BuildServices.saveRenewal({
      isEdited: false,
      data: body
    });
    expect(response).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data.customerName).toEqual("John");
    expect(response).toMatchSnapshot();
  });
});

/**
 * Here, we’re importing Build Services methods and mock response from mockdata.
	 And we’re waiting for the promise to resolve and get the response stored to const response.
	 After getting the response we’re checking it with the actual mock response.
	 And taking a snapshot of the response.
 * 
 */
