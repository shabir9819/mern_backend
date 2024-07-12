const getClientIp = (req) => {
  let ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (ipAddress.startsWith("::ffff:")) {
    ipAddress = ipAddress.split(":").pop(); // Extract the IPv4 part from the IPv6 representation
  }
  return ipAddress;
};
const getClientSource = (req) => {
  const userAgent = req.headers["user-agent"];
  let source = "web";
  if (/android/i.test(userAgent)) {
    source = "android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    source = "ios";
  }
  return source;
};

export { getClientIp, getClientSource };
