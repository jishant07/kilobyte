function success(msg, data) {
  if (data !== "") {
    return {
      msg,
      data,
      status: "success",
    };
  } else {
    return {
      msg,
      status: "success",
    };
  }
}
function fail(msg, err) {
  if (err !== "") {
    return {
      msg,
      err,
      status: "fail",
    };
  } else {
    return {
      msg,
      status: "fail",
    };
  }
}

module.exports = { success, fail };
