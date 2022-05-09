/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:11:46
 * @LastEditTime: 2022-05-09 02:43:38
 * @LastEditors: Quarter
 * @Description: 和风天气 API 天气
 * @FilePath: /get-weather/src/hefeng.ts
 */

import axios, { AxiosResponse } from "axios";
import weatherConfig from "./config";
import getLngLat from "./geo";
import { HeWeatherIconMap, LngLat, WeatherInfoData, WeatherKeyConfig } from "./types";
import { getWeatherStage, getWindDirection } from "./utils";

const API_WEATHER_HEFENG = "https://free-api.heweather.net/s6/weather/{type}";
const API_WEATHER_HEFENG_V7 = "https://devapi.qweather.com/v7/weather/{type}";
const API_AIR_HEFENG_V7 = "https://devapi.qweather.com/v7/air/{type}";

// 和风天气代码和图标的映射表
const HeWeatherIconMap: HeWeatherIconMap = {
  100: "clear",
  101: "partly-cloudy",
  102: "partly-cloudy",
  103: "partly-cloudy",
  104: "cloudy",
  200: "windy",
  201: "windy",
  202: "windy",
  203: "windy",
  204: "windy",
  205: "windy",
  206: "windy",
  207: "windy",
  208: "windy",
  209: "windy",
  210: "windy",
  211: "windy",
  212: "windy",
  213: "windy",
  300: "thunder-shower",
  301: "thunder-shower",
  302: "thunder-shower",
  303: "thunder-shower",
  304: "thunder-shower",
  305: "rain",
  306: "rain",
  307: "rain",
  308: "rainstorm",
  309: "rain",
  310: "rainstorm",
  311: "rainstorm",
  312: "rainstorm",
  313: "rainstorm",
  314: "rain",
  315: "rain",
  316: "rain",
  317: "rainstorm",
  318: "rainstorm",
  399: "rain",
  400: "snow",
  402: "snow",
  403: "snowstorm",
  404: "sleet",
  405: "sleet",
  406: "sleet",
  407: "sleet",
  408: "snow",
  409: "snow",
  410: "snowstorm",
  499: "snow",
  500: "fog",
  501: "fog",
  502: "haze",
  503: "sand",
  504: "sand",
  507: "sand",
  508: "sand",
  509: "fog",
  510: "fog",
  511: "haze",
  512: "haze",
  513: "haze",
  514: "fog",
  515: "fog",
  900: "clear",
  901: "snow",
  999: "clear",
};

/**
 * @description: 获取和风天气的数据
 * @author: Quarter
 * @param {string} key 密钥
 * @param {string} address 地址
 * @param {string} type 类型
 * @return {Promise<WeatherInfoData>}
 */
export const getHeWeather = (key: string, address: string, type: string = "now"): Promise<WeatherInfoData> => {
  return new Promise<WeatherInfoData>((resolve, reject) => {
    let result: WeatherInfoData = {
      status: "error",
      data: null,
    };
    getLngLat(address)
      .then((lnglat: LngLat) => {
        // 获取接口数据
        const url = API_WEATHER_HEFENG.replace("{type}", type);
        axios.get(url, {
          timeout: weatherConfig.timeout,
          params: {
            location: `${lnglat.lng},${lnglat.lat}`,
            key,
          },
        })
          .then(({ status, data }: AxiosResponse) => {
            // 天气数据解析
            if (status === 200 && data.HeWeather6.length > 0) {
              const HeWeather6: any = data.HeWeather6[0];
              if (HeWeather6.status === "ok") {
                result = {
                  status: "success",
                  data: {
                    basic: {
                      location: data.basic.location,
                      time: data.update.loc,
                      lng: data.basic.lon,
                      lat: data.basic.lat,
                    },
                    now: {
                      temperature: parseInt(data.now.tmp, 10),
                      timeStage: getWeatherStage(data.update.loc),
                      icon: HeWeatherIconMap[data.now.cond_code],
                      condition: data.now.cond_txt,
                      wind: {
                        deg: parseInt(data.now.wind_deg, 10),
                        direction: getWindDirection(parseInt(data.now.wind_deg, 10)),
                        force: data.now.wind_sc,
                        speed: parseInt(data.now.wind_spd, 10),
                      },
                      cloudRate: parseInt(data.now.cloud, 10),
                      humidity: parseInt(data.now.hum, 10),
                      precipitation: parseFloat(data.now.pcpn),
                      pressure: parseInt(data.now.pres, 10),
                      visibility: parseInt(data.now.vis, 10),
                    },
                  },
                };
              }
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

/**
 * @description: 获取和风天气的数据
 * @author: Quarter
 * @param {string} key 密钥
 * @param {string} address 地址
 * @param {string} type 类型
 * @return {Promise<WeatherInfoData>}
 */
export const getHeWeatherVersion7 = (key: string, address: string, type: string = "now"): Promise<WeatherInfoData> => {
  return new Promise<WeatherInfoData>((resolve) => {
    let result: WeatherInfoData = {
      status: "error",
      data: null,
    };
    getLngLat(address)
      .then((lnglat: LngLat) => {
        // 获取接口数据
        const weatherUrl = API_WEATHER_HEFENG_V7.replace("{type}", type);
        const airUrl = API_AIR_HEFENG_V7.replace("{type}", type);
        const weatherAxios = axios.get(weatherUrl, {
          timeout: weatherConfig.timeout,
          params: {
            location: `${lnglat.lng},${lnglat.lat}`,
            key,
          },
        });
        const airAxios = axios.get(airUrl, {
          timeout: weatherConfig.timeout,
          params: {
            location: `${lnglat.lng},${lnglat.lat}`,
            key,
          },
        });
        Promise.all([weatherAxios, airAxios]).then(([weatherResponse, airResponse]: AxiosResponse[]) => {
          // 天气数据解析
          if (
            200 === weatherResponse.status
            && "200" === weatherResponse.data.code
            && 200 === airResponse.status
            && "200" === airResponse.data.code
          ) {
            const weather: any = weatherResponse.data;
            const air: any = airResponse.data;
            result = {
              status: "success",
              data: {
                basic: {
                  location: address || null,
                  time: weather.updateTime,
                  lng: lnglat.lng,
                  lat: lnglat.lat,
                },
                now: {
                  temperature: parseInt(weather.now.temp, 10),
                  timeStage: getWeatherStage(weather.updateTime),
                  icon: HeWeatherIconMap[weather.now.icon],
                  condition: weather.now.text,
                  wind: {
                    deg: parseInt(weather.now.wind360, 10),
                    direction: getWindDirection(parseInt(weather.now.wind360, 10)),
                    force: weather.now.windScale,
                    speed: parseInt(weather.now.windSpeed, 10),
                  },
                  cloudRate: parseInt(weather.now.cloud, 10),
                  humidity: parseInt(weather.now.humidity, 10),
                  precipitation: parseFloat(weather.now.precip),
                  pressure: parseInt(weather.now.pressure, 10),
                  visibility: parseInt(weather.now.vis, 10),
                  airQuality: {
                    aqi: parseInt(air.now.aqi, 10),
                    description: air.now.category,
                    pm25: parseInt(air.now.pm2p5, 10),
                    pm10: parseInt(air.now.pm10, 10),
                    o3: parseInt(air.now.o3, 10),
                    no2: parseInt(air.now.no2, 10),
                    so2: parseInt(air.now.so2, 10),
                    co: parseInt(air.now.co, 10),
                  },
                },
              },
            };
          }
        }).finally(() => {
          resolve(result);
        });
      })
      .catch(() => {
        resolve(result);
      });
  });
};