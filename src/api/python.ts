import req from "./python_req";

// export function employeeLaborartoryResult(params: {} = {}) {
//   return req.get(`/labresults/lab/${params.userid}`, params);
// }

export function getAllClient(params: {} = {}) {
  return req.get("/client/all", params);
}

export function createClient(params: {} = {}) {
  return req.post("/client",params);
}
