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

export function clientCount(params: {} = {}) {
  return req.get("/clients/count",params);
}

export function clientVaccinated(params: {} = {}) {
  return req.get("/client/vaccinated",params);
}

export function clientDateDue(params: {} = {}) {
  return req.get("/client/date_due",params);
}

export function clientMissed(params: {} = {}) {
  return req.get("/client/missed",params);
}

export function trackClient(params: {} = {}) {
  return req.get("/track/client",params);
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

export function getVaccineClientInfo(params: {} = {}) {
  return req.get("/vaxinfo/client",params);
}

export function updateVaccineInfo(params: {} = {}) {
  return req.put("/vaxinfo?client_id="+params.client_id+"&vaccine_type="+ params.vaccine_type,params);
}

export function createActivity(params: {} = {}) {
  return req.post("/activity/create",params);
}

export function createTracking(params: {} = {}) {
  return req.post("/tracking/create",params);
}

export function updateTracking(params: {} = {}) {
  return req.put("/tracking/update",params);
}

export function getTracking(params: {} = {}) {
  return req.get("/tracking/all",params);
}

export function getIncoming(params: {} = {}) {
  return req.get("/incoming/all",params);
}

export function getAccepted(params: {} = {}) {
  return req.get("/accepted/all",params);
}

export function barChartData(params: {} = {}) {
  return req.get("/barchart",params);
}

export function lineChartData(params: {} = {}) {
  return req.get("/linechart",params);
}

export function lineChartDataNew(params: {} = {}) {
  return req.get("/linechart/new",params);
}