import req from "./req";

/**
 * 账号密码登录
 * @param params 参数
 * @returns
 */
export function userLogin(params: {}) {
  return req.post("/user/login", params);
}

export function getUserProfile(params: {} = {}) {
  return req.get("/user/profile", params);
}

export function getUserInfo(params: {} = {}) {
  return req.get("/user/profile/info", params);
}

export function getUserBarangay(params: {} = {}) {
  return req.get("/user/barangay", params);
}

export function getUserBarangayAssignment(params: {} = {}) {
  return req.get("/user/user_barangay", params);
}

export function getUserMunicipality(params: {} = {}) {
  return req.get("/user/muncity", params);
}

export function textBlast(params: {} = {}) {
  return req.get("/user/text_blast", params);
}

