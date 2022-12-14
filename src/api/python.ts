import req from "./python_req";

export function getAllClient(params: {} = {}) {
  //console.log(params.search)
  return req.get("/client/all", params);
}

export function getAllClientPagination(params: {} = {}) {
  return req.get("/client/all/paginated", params);
}

export function createClient(params: {} = {}) {
  return req.post("/client",params);
}

export function getInfoClient(params: {} = {}) {
  return req.get("/client",params);
}

export function updateClient(params: {} = {}) {
  return req.put("/client?id="+params.id,params);
}