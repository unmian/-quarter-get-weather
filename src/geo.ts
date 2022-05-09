/*
 * @Author: Quarter
 * @Date: 2022-05-07 08:23:33
 * @LastEditTime: 2022-05-07 13:04:55
 * @LastEditors: Quarter
 * @Description: Geo 地理信息
 * @FilePath: /get-weather/src/geo.ts
 */

import axios, { AxiosResponse } from "axios";
import weatherConfig from "./config";
import { GeoResult, LngLat, WeatherKeyConfig } from "./types";

const API_AMAP_URL_LNGLAT = "https://restapi.amap.com/v3/geocode/geo";
const API_HE_URL_LNGLAT = "https://geoapi.qweather.com/v2/city/lookup";

/**
 * @description: 获取高德地图经纬度
 * @author: Quarter
 * @param {string} key 密钥
 * @param {string} address 地址
 * @return {Promise<GeoResult>}
 */
export const getAmapLngLat = (key: string, address: string = "南京市秦淮区"): Promise<GeoResult> => {
  return new Promise<GeoResult>((resolve) => {
    let result: GeoResult = {
      status: "error",
      data: null,
    };
    if (typeof key === "string" && key.length > 0) {
      axios.get(API_AMAP_URL_LNGLAT, {
        timeout: weatherConfig.timeout,
        params: {
          key,
          address,
        },
      }).then(({ status, data }: AxiosResponse) => {
        if (status === 200 && parseInt(data.status, 10) === 1 && parseInt(data.count, 10) === 1 && data.geocodes.length === 1) {
          const geocode: any = data.geocodes[0];
          const location: string[] = geocode.location.toString().split(",");
          const longitude: number = location[0] ? parseFloat(location[0]) : 0;
          const latitude: number = location[1] ? parseFloat(location[1]) : 0;
          result = {
            status: "success",
            data: {
              adCode: geocode.citycode,
              lnglat: {
                lng: longitude,
                lat: latitude,
              },
            },
          };
        }
      }).finally(() => {
        resolve(result);
      });
    } else {
      resolve(result);
    }
  });
};

/**
 * @description: 获取和风天气经纬度
 * @author: Quarter
 * @param {string} key 密钥
 * @param {string} location 地址
 * @return {Promise<GeoResult>}
 */
const getHeLngLat = (key: string, location: string = "南京市秦淮区"): Promise<GeoResult> => {
  return new Promise<GeoResult>((resolve) => {
    let result: GeoResult = {
      status: "error",
      data: null,
    };
    if (typeof key === "string" && key.length > 0) {
      axios.get(API_HE_URL_LNGLAT, {
        timeout: weatherConfig.timeout,
        params: {
          key,
          location,
        },
      }).then(({ status, data }: AxiosResponse) => {
        if (status === 200 && parseInt(data.code, 10) === 200 && data.location.length > 0) {
          const geocode: any = data.location[0];
          const longitude: number = geocode.lon ? parseFloat(geocode.lon) : 0;
          const latitude: number = geocode.lat ? parseFloat(geocode.lat) : 0;
          result = {
            status: "success",
            data: {
              adCode: null,
              lnglat: {
                lng: longitude,
                lat: latitude,
              },
            },
          };
        }
      }).finally(() => {
        resolve(result);
      });
    } else {
      resolve(result);
    }
  });
};

/**
 * @description: 获取经纬度
 * @author: Quarter
 * @param {string} address 地址
 * @return {Promise<LngLat>}
 */
const getLngLat = (address: string = "南京市秦淮区"): Promise<LngLat> => {
  return new Promise<LngLat>((resolve, reject) => {
    const keys: WeatherKeyConfig[] = weatherConfig.keys.filter((key: WeatherKeyConfig) => key.type === "AMapWeather" || key.type === "HeWeatherV7");
    getLngLatRecursion(keys, address, resolve, reject);
  });
};

/**
 * @description: 递归获取经纬度
 * @author: Quarter
 * @param {WeatherKeyConfig[]} keys 密钥组
 * @param {string} address 地址
 * @param {function} callback 正确回调
 * @param {function} error 错误回调
 * @return
 */
const getLngLatRecursion = (
  keys: WeatherKeyConfig[],
  address: string = "南京市秦淮区",
  callback: (lnglat: LngLat) => void,
  error: () => void
): void => {
  if (keys.length > 0) {
    if (keys[0].type === "AMapWeather") {
      getAmapLngLat(keys[0].key, address).then((result: GeoResult) => {
        if (result.status === "success") {
          callback(result.data?.lnglat as LngLat);
        } else {
          keys = keys.slice(1);
          getLngLatRecursion(keys, address, callback, error);
        }
      });
    } else if (keys[0].type === "HeWeatherV7") {
      getHeLngLat(keys[0].key, address).then((result: GeoResult) => {
        if (result.status === "success") {
          callback(result.data?.lnglat as LngLat);
        } else {
          keys = keys.slice(1);
          getLngLatRecursion(keys, address, callback, error);
        }
      });
    } else {
      error();
    }
  } else {
    error();
  }
};

export default getLngLat;