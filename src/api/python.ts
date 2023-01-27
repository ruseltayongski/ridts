import req from "./python_req";

export function getAllClient(params: {} = {}) {
  return req.get("/client/all", params);
}

export function getAllClientArchived(params: {} = {}) {
  return req.get("/client/archived", params);
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

export function deleteClient(params: {} = {}) {
  return req.deletes("/client?id="+params.id,params);
}

export function createVaccineInfo(params: {} = {}) {
  return req.post("/vaxinfo/create",params);
}

export function getVaccineInfo(params: {} = {}) {
  return req.get("/vaxinfo/all",params);
}

export function updateVaccineInfo(params: {} = {}) {
  return req.put("/vaxinfo?client_id="+params.client_id+"&vaccine_type="+ params.vaccine_type,params);
}