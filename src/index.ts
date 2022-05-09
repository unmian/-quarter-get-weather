/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:34:49
 * @LastEditTime: 2022-05-07 10:27:59
 * @LastEditors: Quarter
 * @Description: 入口文件
 * @FilePath: /get-weather/src/index.ts
 */

import getWeather from "./weather";
import { config } from "./config";
export default {
  config,
  getWeather,
};
export * from "./types";