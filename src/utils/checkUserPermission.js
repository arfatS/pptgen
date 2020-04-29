import history from "../history";
import { flatMap, includes, get, find } from "lodash";
import ToastUtils from "utils/handleToast";

const ratesUploadAccess = ["rates/upload", "rate/update"];
const checkUserPermission = ({ location, profile }) => {
  if (location && profile) {
    let roles = get(profile, "roles");

    // check if path exists in common routes where API is not requested on component mount
    let accessFlag = find(
      ratesUploadAccess,
      route => location.pathname.indexOf(route) > -1
    );

    if (Array.isArray(roles) && roles.length && accessFlag) {
      // set initial redirection flag
      let isRedirectToDashboard = true;

      flatMap(roles, role => {
        if (includes(["Underwriter", "Admin"], role)) {
          isRedirectToDashboard = false;
        }
      });

      if (isRedirectToDashboard) {
        ToastUtils.handleToast({
          operation: "error",
          message: "Permission denied"
        });
        history.push("/home");
      }
    }
  }
};

export default checkUserPermission;
