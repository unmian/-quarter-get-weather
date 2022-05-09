/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:11:27
 * @LastEditTime: 2022-05-07 10:56:09
 * @LastEditors: Quarter
 * @Description: 彩云天气 API 天气
 * @FilePath: /get-weather/src/caiyun.ts
 */

import axios, { AxiosResponse } from "axios";
import weatherConfig from "./config";
import getLngLat from "./geo";
import { CaiYunWeatherIconMap, LngLat, WeatherInfoData } from "./types";
import { get13Timestamp, getUTCTimeString, getWindDirection } from "./utils";

const API_WEATHER_CAIYUN = "{host}/v2.5/{key}/{location}/realtime";

// 彩云天气图标字典
const CaiYunWeatherDic: CaiYunWeatherIconMap = {
  CLEAR_DAY: {
    weather: "晴",
    time: "day",
    icon: "clear",
  },
  CLEAR_NIGHT: {
    weather: "晴",
    time: "night",
    icon: "clear",
  },
  PARTLY_CLOUDY_DAY: {
    weather: "多云",
    time: "day",
    icon: "partly-cloudy",
  },
  PARTLY_CLOUDY_NIGHT: {
    weather: "多云",
    time: "night",
    icon: "partly-cloudy",
  },
  CLOUDY: {
    weather: "阴",
    time: "all",
    icon: "cloudy",
  },
  WIND: {
    weather: "大风",
    time: "all",
    icon: "windy",
  },
  HAZE: {
    weather: "雾霾",
    time: "all",
    icon: "haze",
  },
  RAIN: {
    weather: "雨",
    time: "all",
    icon: "rain",
  },
  SNOW: {
    weather: "雪",
    time: "all",
    icon: "snow",
  },
};

/**
 * @description: 获取高德地图天气
 * @author: Quarter
 * @param {string} key 密钥
 * @param {address} address 地址
 * @param {string} type 类型
 * @return {Promise<WeatherInfoData>}
 */
const getCaiyunWeather = (key: string, address: string, type: string = "now"): Promise<WeatherInfoData> => {
  return new Promise<WeatherInfoData>((resolve) => {
    let result: WeatherInfoData = {
      status: "error",
      data: null,
    };
    // 获取经纬度数据
    getLngLat(address)
      .then((lnglat: LngLat) => {
        const location = `${lnglat.lng.toFixed(4)},${lnglat.lat.toFixed(4)}`;
        // 获取接口数据
        const url = API_WEATHER_CAIYUN.replace("{host}", weatherConfig.caiYunRewrite).replace("{key}", key).replace("{location}", location);
        axios
          .get(url, {
            timeout: weatherConfig.timeout,
          })
          .then(({ status, data }: AxiosResponse) => {
            if (status === 200 && data.status === "ok" && data.api_status === "active") {
              const realtime: any = data.result.realtime;
              result = {
                status: "success",
                data: {
                  basic: {
                    location: address,
                    time: getUTCTimeString(new Date(get13Timestamp(data.server_time))),
                    lng: data.location[0],
                    lat: data.location[1],
                  },
                  now: {
                    temperature: realtime.temperature,
                    timeStage: CaiYunWeatherDic[realtime.skycon].time,
                    icon: CaiYunWeatherDic[realtime.skycon].icon,
                    condition: CaiYunWeatherDic[realtime.skycon].weather,
                    wind: {
                      deg: realtime.wind.direction,
                      direction: getWindDirection(realtime.wind.direction),
                      force: null,
                      speed: realtime.wind.speed,
                    },
                    cloudRate: realtime.cloudrate,
                    humidity: realtime.humidity,
                    precipitation: realtime.precipitation.local.intensity,
                    pressure: realtime.pres,
                    visibility: realtime.visibility,
                    airQuality: {
                      aqi: realtime.air_quality.aqi.chn,
                      description: realtime.air_quality.description.chn,
                      pm25: realtime.air_quality.pm25,
                      pm10: realtime.air_quality.pm10,
                      o3: realtime.air_quality.o3,
                      no2: realtime.air_quality.no2,
                      so2: realtime.air_quality.so2,
                      co: realtime.air_quality.co,
                    },
                  },
                },
              };
            }
          })
          .finally(() => {
            resolve(result);
          });
      })
      .catch(() => {
        resolve(result);
      });
  });
};

export default getCaiyunWeather;