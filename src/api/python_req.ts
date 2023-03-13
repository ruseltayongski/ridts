import Axios from "axios";

declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

Axios.defaults.timeout = 300000;
//设置请求基地址
//Axios.defaults.baseURL = import.meta.env.LABRESULT_API_URL;
const PythonAxios = import.meta.env.VITE_API_BASE_URL_PYTHON;

// 添加请求拦截器
Axios.interceptors.request.use((request: any) => {

  //request.headers["Authorization"] = request.headers["Authorization"] ? '' : 'Bearer '+S.getAuthToken();
  request.headers["Accept"] = "application/json";
  request.headers["Content-Type"] = "application/json;charset=UTF-8";

  return request;
});

// 添加响应拦截器
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let code = 0;
    let customCode = 0;
    try {
      code = error.response.status;
      customCode = error.response.code;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        return Promise.reject(error);
      }
    }

    if (customCode) {
      if (customCode === 403) {
        console.log(error.response.data.message);
      } else if (customCode === 500) {
        console.log(error.response.data.message);
      }
    } else if (code) {
      if (code === 401) {
        // router.push({
        //   path: "/login",
        // });
      } else if (code === 403) {
      } else {
        console.log(error.response.data.message);
      }
    }

    return Promise.reject(error.response);
  }
);

/**
 * get方法封装
 */
function get(url: string, params: any, headers: {} = {}) {
  return Axios.get(PythonAxios + url, { params, headers });
}

/**
 * delect方法封装
 */
function deletes(url: string, params: any, headers: {} = {}) {
  return Axios.delete(PythonAxios + url, {
    params,
    headers,
  });
}

/**
 * post方法封装
 */
function post(url: string, params: any) {
  return Axios.post(PythonAxios + url, params);
}

/**
 * put方法封装
 */
function put(url: string, params: any, headers: {} = {}) {
  return Axios.put(PythonAxios + url, params, headers);
}

export default {
  get,
  deletes,
  post,
  put
}
