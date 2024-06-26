import validator from "validator";

const validatorAdapter = {
  equals: (str, comparison) => {
    return validator.equals(str, comparison);
  },

  contains: (str, seed) => {
    return validator.contains(str, seed);
  },

  matches: (str, pattern, modifiers) => {
    return validator.matches(str, pattern, modifiers);
  },

  isEmail: (email) => {
    return validator.isEmail(email);
  },

  isURL: (url, options) => {
    return validator.isURL(url, options);
  },

  isMACAddress: (str) => {
    return validator.isMACAddress(str);
  },

  isIP: (str, version) => {
    return validator.isIP(str, version);
  },

  isFQDN: (str, options) => {
    return validator.isFQDN(str, options);
  },

  isBoolean: (str) => {
    return validator.isBoolean(str);
  },

  isAlpha: (str) => {
    return validator.isAlpha(str);
  },

  isAlphanumeric: (str) => {
    return validator.isAlphanumeric(str);
  },

  isNumeric: (str) => {
    return validator.isNumeric(str);
  },

  isDecimal: (str) => {
    return validator.isDecimal(str);
  },

  isHexadecimal: (str) => {
    return validator.isHexadecimal(str);
  },

  isOctal: (str) => {
    return validator.isOctal(str);
  },

  isDivisibleBy: (str, number) => {
    return validator.isDivisibleBy(str, number);
  },

  isFloat: (str, options) => {
    return validator.isFloat(str, options);
  },

  isInt: (str, options) => {
    return validator.isInt(str, options);
  },

  isPort: (str) => {
    return validator.isPort(str);
  },

  isLowercase: (str) => {
    return validator.isLowercase(str);
  },

  isUppercase: (str) => {
    return validator.isUppercase(str);
  },

  isAscii: (str) => {
    return validator.isAscii(str);
  },

  isFullWidth: (str) => {
    return validator.isFullWidth(str);
  },

  isHalfWidth: (str) => {
    return validator.isHalfWidth(str);
  },

  isVariableWidth: (str) => {
    return validator.isVariableWidth(str);
  },

  isMultibyte: (str) => {
    return validator.isMultibyte(str);
  },

  isSurrogatePair: (str) => {
    return validator.isSurrogatePair(str);
  },

  isSemVer: (str) => {
    return validator.isSemVer(str);
  },

  isBase64: (str) => {
    return validator.isBase64(str);
  },

  isDataURI: (str) => {
    return validator.isDataURI(str);
  },

  isMagnetURI: (str) => {
    return validator.isMagnetURI(str);
  },

  isLatLong: (str) => {
    return validator.isLatLong(str);
  },

  isLocale: (str) => {
    return validator.isLocale(str);
  },

  isPostalCode: (str, locale) => {
    return validator.isPostalCode(str, locale);
  },

  isMilitaryTime: (str) => {
    return validator.isMilitaryTime(str);
  },

  isISO31661Alpha2: (str) => {
    return validator.isISO31661Alpha2(str);
  },

  isISO31661Alpha3: (str) => {
    return validator.isISO31661Alpha3(str);
  },

  isIMEI: (str, options) => {
    return validator.isIMEI(str, options);
  },

  isMobilePhone: (str, locale, options) => {
    return str.length === 10 && validator.isMobilePhone(str, locale, options);
  },

  isCurrency: (str, options) => {
    return validator.isCurrency(str, options);
  },

  isISO8601: (str, options) => {
    return validator.isISO8601(str, options);
  },

  isRFC3339: (str) => {
    return validator.isRFC3339(str);
  },

  isJWT: (str) => {
    return validator.isJWT(str);
  },

  isEAN: (str) => {
    return validator.isEAN(str);
  },

  isISSN: (str, options) => {
    return validator.isISSN(str, options);
  },

  isUUID: (str, version) => {
    return validator.isUUID(str, version);
  },

  isMongoId: (str) => {
    return str !== undefined && validator.isMongoId(str);
  },

  isJWT: (str) => {
    return validator.isJWT(str);
  },

  isIBAN: (str) => {
    return validator.isIBAN(str);
  },

  isBIC: (str) => {
    return validator.isBIC(str);
  },

  isAlphaNumeric: (str) => {
    return validator.isAlphanumeric(str);
  },

  isStrongPassword: (str, options) => {
    return validator.isStrongPassword(str, options);
  },

  isPostalCode: (str, locale) => {
    return validator.isPostalCode(str, locale);
  },

  isEmpty: (str) => {
    if (str === undefined) {
      return true;
    }
    return validator.isEmpty(str);
  },
  isMongoValidObjectId: (id) => {
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    return objectIdRegex.test(id);
  },
};

export default validatorAdapter;
