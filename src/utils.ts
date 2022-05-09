/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:14:32
 * @LastEditTime: 2022-05-07 09:27:49
 * @LastEditors: Quarter
 * @Description: 工具集合
 * @FilePath: /get-weather/src/utils.ts
 */

import { WeatherTimeStage } from "./types";

/**
 * @description: 获取风向中文说明
 * @author: Quarter
 * @param {number} deg 角度
 * @return {string}
 */
export const getWindDirection = (deg?: number): string => {
  if ("number" !== typeof deg) {
    return "无风";
  } else if (deg < 11.26) {
    return "北风";
  } else if (deg < 78.76) {
    return "东北风";
  } else if (deg < 101.26) {
    return "东风";
  } else if (deg < 168.76) {
    return "东南风";
  } else if (deg < 191.26) {
    return "南风";
  } else if (deg < 258.76) {
    return "西南风";
  } else if (deg < 281.26) {
    return "西风";
  } else if (deg < 348.76) {
    return "西北风";
  } else {
    return "北风";
  }
};

/**
 * @description: 获取天气时间阶段
 * @author: Quarter
 * @param {string} timeStr 时间字符串
 * @return {WeatherTimeStage}
 */
export const getWeatherStage = (timeStr: string): WeatherTimeStage => {
  if (timeStr) {
    try {
      const time: Date = new Date(timeStr);
      if (time) {
        if (time.getHours() > 6 && time.getHours() < 18) {
          return "day";
        } else {
          return "night";
        }
      }
    } catch (e) {
      return "all";
    }
  }
  return "all";
};

/**
 * @description: 获取 13 为时间戳
 * @author: Quarter
 * @param {number} stamp 时间戳
 * @return {number} 时间戳
 */
export const get13Timestamp = (stamp: number): number => {
  let tempStamp = stamp.toString();
  if (tempStamp.length < 13) {
    while (tempStamp.length !== 13) {
      tempStamp += "0";
    }
  } else {
    tempStamp = tempStamp.slice(0, 13);
  }
  return parseInt(tempStamp, 10);
};

/**
 * @description: 获取 UTC 时间字符串
 * @author: Quarter
 * @param {Date} time 日期
 * @return {string}
 */
export const getUTCTimeString = (time: Date = new Date()): string => {
  return `${time.getFullYear()}-${time.getMonth() +
    1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
};