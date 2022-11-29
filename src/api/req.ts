import Axios from "axios";

import router from "@/router";

// const { t } = useI18n();
import { S } from "@/utils";

declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

Axios.defaults.timeout = 120000;

//设置请求基地址
//Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const laravelAxios = import.meta.env.VITE_API_BASE_URL

// 添加请求拦截器
Axios.interceptors.request.use((request: any) => {

  request.headers["Authorization"] = request.headers["Authorization"] ? '' : 'Bearer '+S.getAuthToken();

  request.headers["Accept"] = "application/json";
  request.headers["Content-Type"] = "application/json;charset=UTF-8";

  return request;
});

// 添加响应拦截器
Axios.interceptors.response.use(
  (response) => {
    const code = response.status;

    if (code == undefined) {
      let error = {
        message: "网络异常",
      };
      return Promise.reject(error);
    } else if (code < 200 || code > 300) {
      return Promise.reject("error");
    } else {
      // 如果为undefined 说明为下载接口，无code
      if (response.data.code === undefined) {
        return response.data;
      } else if (response.data.code !== 0 && !response.data.data) {
        console.log(response.data.message);
      }
    }

    return response.data.data;
  },
  (error) => {
    let code = 0;
    let customCode = 0;
    try {
      // code = error.response.data.status;
      // customCode = error.response.data.code;
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
  return Axios.get(laravelAxios + url, { params, headers });
}

/**
 * delect方法封装
 */
function deletes(url: string, params: any, headers: {} = {}) {
  return Axios.delete(laravelAxios + url, {
    params,
    headers,
  });
}

/**
 * post方法封装
 */
function post(url: string, params: any, headers: {} = {}) {
  return Axios.post(laravelAxios + url, params, headers);
}

/**
 * put方法封装
 */
function put(url: string, params: any, headers: {} = {}) {
  return Axios.put(laravelAxios + url, params, headers);
}

export default {
  get,
  deletes,
  post,
  put,
};
