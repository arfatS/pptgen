import * as Sentry from "@sentry/browser";

/**
 *@param extraData any extra data in object format.
 *@param error Error object
 */
export const logError = ({ extraData, error, email }) => {
  Sentry.configureScope(scope => {
    email && scope.setUser({ email });
    extraData && scope.setExtra("Extra Log", extraData);
  });
  Sentry.captureException(error);
};
