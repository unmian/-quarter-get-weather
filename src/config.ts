/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:29:55
 * @LastEditTime: 2022-05-07 10:44:46
 * @LastEditors: Quarter
 * @Description: 配置文件
 * @FilePath: /get-weather/src/config.ts
 */

import { WeatherApiType, WeatherConfig, WeatherOptions } from "./types";

export const CACHE_WEATHER_ITEM: string = "__CACHE_WEATHER_DATA";

// 天气类型列表
const typeList: WeatherApiType[] = ["AMapWeather", "CaiyunWeather", "HeWeather", "HeWeatherV7"];

// 天气查询配置
const weatherConfig: WeatherConfig = {
  caiYunRewrite: "https://api.caiyunapp.com",
  cache: 60,
  timeout: 60 * 1000,
  keys: [],
  channels: Array.from(typeList),
};

/**
 * @description: 修改配置
 * @author: Quarter
 * @param {WeatherOptions} opts 配置项
 * @return
 */
export const config = (opts: WeatherOptions = {}): void => {
  if (opts) {
    if ("number" === typeof opts.cache && opts.cache >= 0) {
      weatherConfig.cache = opts.cache;
    }
    if ("number" === typeof opts.timeout && opts.timeout >= 0) {
      if (opts.timeout > 0) {
        weatherConfig.timeout = opts.timeout;
      } else {
        weatherConfig.timeout = undefined;
      }
    }
    if (Array.isArray(opts.keys)) {
      weatherConfig.keys = opts.keys;
    }
    if ("string" === typeof opts.caiYunRewrite && opts.caiYunRewrite) {
      weatherConfig.caiYunRewrite = opts.caiYunRewrite;
    }
    if (Array.isArray(opts.channels)) {
      weatherConfig.channels = opts.channels.filter((channel: WeatherApiType) => typeList.includes(channel));
    }
  }
};

export default weatherConfig;