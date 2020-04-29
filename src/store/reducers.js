/**
 * import all app reducers and export them to combine and integrate in the store
 * !Do not modify the store to combine reducers.
 */
import sampleReducer from "./sampleReducer";
import reports from "tools/renewal/pages/reports/services/reports/reducer";
import presentation from "tools/presentation/pages/dashboard/services/reducer";
import presentationSetupReducers from "tools/presentation/pages/build/services";
import userProfile from "pages/app/services/getUserDetail/reducer";

import setup from "tools/presentation/pages/admin/setup/services";

export default {
  ...sampleReducer,
  ...reports,
  ...presentationSetupReducers,
  ...presentation,
  ...userProfile,
  ...setup
};
