/**
 * Validate Text
 */

class ValidationUtils {
  checkIfspecialChar = value => {
    let regex = /[=?`<>]/g;
    return regex.test(value);
  };

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line no-useless-escape
    return re.test(String(email).toLowerCase());
  };

  checkIfEmptyField = value => {
    let re = /^$/;
    return re.test(value);
  };

  checkIfWhiteSpace = value => {
    if (typeof value !== "number" && value && value.trim().length === 0) {
      let re = /^\s/;
      return re.test(value);
    }
  };

  checkContactNumber = value => {
    let re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
    return !re.test(value);
  };

  validatePassword = password => {
    // minimum eight characters, at least one uppercase letter, one lowercase letter and one special character
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // By default max file size 5mb
  compareFileSize = (currentFileSizeInBytes, maximumFileSizeInMb = 5) => {
    //Convert mb to bytes
    let maxSizeInByte = maximumFileSizeInMb * Math.pow(2, 20);
    return !!(currentFileSizeInBytes < maxSizeInByte);
  };
}

export default new ValidationUtils();
