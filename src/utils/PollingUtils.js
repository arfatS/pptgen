/**
 * Util to poll for build process
 *
 * @class PollingUtils
 */
class PollingUtils {
  /**
   * Start Polling
   *
   * @param {Function} pollingAction - Callback function which needs to be polled for polling process.
   * @param {Function} timeoutCallback - Callback function which needs for request timout.
   * @param {Function} timeoutDuration -  Duration of the request timout.   *
   * @param {Function} duration - Duration of the set Interval time.
   */
  startPolling = ({
    pollingAction,
    timeoutCallback,
    timeoutDuration = 100000,
    duration = 3000
  }) => {
    pollingAction();
    // poll function using set Interval
    this.pollingFunction = setInterval(() => {
      pollingAction();
    }, duration);

    // Check if connection is timed out
    this.timeout = setTimeout(() => {
      this.stopPolling();
      timeoutCallback();
    }, timeoutDuration);
  };

  /**
   *Clear all timeout and intervals
   *
   * @memberof PollingUtils
   */
  stopPolling = () => {
    clearInterval(this.pollingFunction);
    clearTimeout(this.timeout);
  };
}

export default new PollingUtils();
