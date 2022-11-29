/*
 * @Author: sunxu “xu.sun@ideal-careerbridge.com”
 * @Date: 2022-05-16 22:21:58
 * @LastEditors: xu.sun xu.sun@ideal-careerbridge.com
 * @LastEditTime: 2022-08-10 13:18:26
 * @FilePath: \icb_bpo_web\src\utils\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//import rsaEncrypt from "./rsaEncrypt";
//import aesEncrypt from "./aesEncrypt";
import S from "./storage";
import moment from "moment";

/**
 * 判断是否是 Object 类型
 * */
const isObject = (value: any) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

/**
 * 禁用当然时间以后的日期
 * */
const disabledDateAfter = (value: Date) => {
  return value.getTime() > Date.now();
};

/**
 * 禁用当然时间之前的日期
 * */
const disabledDateBefore = (value: Date) => {
  return value.getTime() < Date.now() - 8.64e7;
};

/**
 * 开始时间不能大于结束时间
 * */
const validatorStartTime = (value: any, item: any, callback: any) => {
  const endTime = item.endTime === "1" ? Date.now() : item.endTime;

  if (!value) {
    callback(new Error("请选择开始时间"));
  } else if (!endTime) {
    callback();
  } else if (value > endTime) {
    callback(new Error("开始时间不能大于结束时间"));
  } else {
    callback();
  }
};

/**
 * 结束时间不能小于开始时间
 * */
const validatorEndTime = (value: any, item: any, callback: any) => {
  const nVal = value === "1" ? Date.now() : value;

  if (!nVal) {
    callback(new Error("请选择结束时间"));
  } else if (!item.startTime) {
    callback();
  } else if (nVal < item.startTime) {
    callback(new Error("结束时间不能小于开始时间"));
  } else {
    callback();
  }
};

/**
 * 获取当前城市父级
 * */
const getCityParent = (id: number) => {
  const list = S.get("cityJson", true);

  for (let index = 0; index < list.length; index++) {
    const item = list[index];

    if (id === item.id) {
      return item;
    }
  }

  return false;
};

/**
 * 获取当前行业父级
 * */
const getCategoryParent = (id: number) => {
  const list = S.get("categoryOpenJson", true);

  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    if (id === item.id) {
      return item;
    }
  }

  return false;
};

/**
 * 格式化时间
 * 默认返回 "YYYY-MM-DD"
 * */
const formatTime = (time: number, formatter: string = "YYYY-MM-DD") => {
  return moment(time).format(formatter);
};

/**
 * 格式化时间
 * 默认返回 "YYYY.MM"
 * */
const formatTimeMonth = (time: number, formatter: string = "YYYY.MM") => {
  return moment(time).format(formatter);
};

/**
 * 格式化时间
 * 默认返回 YYYY-MM-DD HH:mm:ss
 * */
const formatDataTime = (
  time: number,
  formatter: string = "YYYY-MM-DD HH:mm:ss"
) => {
  return moment(time).format(formatter);
};

const getFileName = (name: string) => {
  const i = name.lastIndexOf(".");

  return name.substring(0, i);
};

/**
 * 获取滑块
 * */
const getSlider = () => {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010

  s[19] = hexDigits.substr((Number(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  return 'slider' + '-' + s.join("");
} 

export {
  S,
  //rsaEncrypt,
  //aesEncrypt,
  disabledDateAfter,
  disabledDateBefore,
  validatorStartTime,
  validatorEndTime,
  getCityParent,
  getCategoryParent,
  formatTime,
  formatTimeMonth,
  formatDataTime,
  getFileName,
  getSlider
};
