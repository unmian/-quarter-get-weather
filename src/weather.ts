/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:10:49
 * @LastEditTime: 2022-05-07 10:52:36
 * @LastEditors: Quarter
 * @Description: 天气查询工具
 * @FilePath: /get-weather/src/weather.ts
 */

import getAmapWeather from "./amap";
import getCaiyunWeather from "./caiyun";
import weatherConfig, { CACHE_WEATHER_ITEM } from "./config";
import { getHeWeather, getHeWeatherVersion7 } from "./hefeng";
import { GetWeatherOptions, WeatherInfoCache, WeatherInfoData, WeatherKeyConfig, WeatherMethodMap } from "./types";

// 天气函数映射
const weatherMethodMap: WeatherMethodMap = {
  HeWeather: getHeWeather,
  HeWeatherV7: getHeWeatherVersion7,
  CaiyunWeather: getCaiyunWeather,
  AMapWeather: getAmapWeather,
};

/**
 * @description: 递归获取天气信息
 * @author: Quarter
 * @param {number} index 下标
 * @param {WeatherKeyConfig[]} keys 配置列表
 * @param {string} address 配置列表
 * @param {function} success 成功的回调
 * @param {function} error 失败的回调
 * @return
 */
const getWeatherInfo = (
  index: number = 0,
  keys: WeatherKeyConfig[],
  address: string,
  success: (weather: WeatherInfoData) => void,
  error: () => void
): void => {
  if (index < keys.length) {
    const methods: string[] = Object.keys(weatherMethodMap);
    const key: WeatherKeyConfig = keys[index];
    if (methods.includes(key.type) && weatherConfig.channels.includes(key.type)) {
      weatherMethodMap[key.type](key.key, address).then((weather: WeatherInfoData) => {
        if (weather.status === "success") {
          const cacheWeatherInfo: WeatherInfoCache = {
            timestamp: new Date().valueOf(),
            location: address,
            data: weather,
          };
          localStorage.setItem(CACHE_WEATHER_ITEM, JSON.stringify(cacheWeatherInfo));
          success(weather);
        } else {
          getWeatherInfo(index + 1, keys, address, success, error);
        }
      });
    } else {
      getWeatherInfo(index + 1, keys, address, success, error);
    }
  } else {
    error();
  }
};

/**
 * @description: 获取天气信息
 * @author: Quarter
 * @param {string} address 地址
 * @param {GetWeatherOptions} opts 配置项
 * @return {Promise<WeatherInfoData>}
 */
const getWeather = (address: string = "南京市秦淮区", opts: GetWeatherOptions = {}): Promise<WeatherInfoData> => {
  return new Promise<WeatherInfoData>((resolve, reject) => {
    const cacheNumber: number = weatherConfig.cache;
    const { cache = true } = opts;
    // 从缓存获取天气数据
    let cacheWeatherInfo: WeatherInfoCache | null = null;
    if (cache || cacheNumber === 0) {
      try {
        cacheWeatherInfo = JSON.parse(String(localStorage.getItem(CACHE_WEATHER_ITEM)));
        if (cacheWeatherInfo !== null && cacheWeatherInfo.location === address) {
          const nowTimestamp: number = new Date().valueOf();
          const expire = cacheNumber * 60 * 1000;
          if (nowTimestamp - cacheWeatherInfo.timestamp < expire) {
            resolve(cacheWeatherInfo.data);
          } else {
            cacheWeatherInfo = null;
            localStorage.removeItem(CACHE_WEATHER_ITEM);
          }
        } else {
          cacheWeatherInfo = null;
          localStorage.removeItem(CACHE_WEATHER_ITEM);
        }
      } catch (error) {
        cacheWeatherInfo = null;
        localStorage.removeItem(CACHE_WEATHER_ITEM);
      }
    }
    if (cacheWeatherInfo === null && weatherConfig.keys.length > 0) {
      // 从天气服务商获取天气数据
      getWeatherInfo(
        0,
        weatherConfig.keys,
        address,
        resolve,
        reject
      );
    } else {
      reject();
    }
  });
};

export default getWeather;