/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:11:50
 * @LastEditTime: 2022-05-07 10:54:49
 * @LastEditors: Quarter
 * @Description: 高德地图 API 天气
 * @FilePath: /get-weather/src/amap.ts
 */

import axios, { AxiosResponse } from "axios";
import weatherConfig from "./config";
import { getAmapLngLat } from "./geo";
import { AMapWeatherIconMap, GeoData, GeoResult, LngLat, WeatherInfoData } from "./types";
import { getWeatherStage } from "./utils";

const API_WEATHER_AMAP = "https://restapi.amap.com/v3/weather/weatherInfo";

// 高德地图天气图标字典
const AMapWeatherDic: AMapWeatherIconMap = {
  晴: "clear",
  少云: "partly-cloudy",
  晴间多云: "partly-cloudy",
  多云: "partly-cloudy",
  阴: "cloudy",
  有风: "windy",
  平静: "windy",
  微风: "windy",
  和风: "windy",
  清风: "windy",
  "强风/劲风": "windy",
  疾风: "windy",
  大风: "windy",
  烈风: "windy",
  风暴: "windy",
  狂爆风: "windy",
  飓风: "windy",
  热带风暴: "windy",
  阵雨: "thunder-shower",
  雷阵雨: "thunder-shower",
  雷阵雨并伴有冰雹: "thunder-shower",
  小雨: "rain",
  中雨: "rain",
  大雨: "rain",
  暴雨: "rainstorm",
  大暴雨: "rainstorm",
  特大暴雨: "rainstorm",
  强阵雨: "thunder-shower",
  强雷阵雨: "thunder-shower",
  极端降雨: "thunder-shower",
  "毛毛雨/细雨": "rain",
  雨: "rain",
  "小雨-中雨": "rain",
  "中雨-大雨": "rain",
  "大雨-暴雨": "rainstorm",
  "暴雨-大暴雨": "rainstorm",
  "大暴雨-特大暴雨": "rainstorm",
  雨雪天气: "sleet",
  雨夹雪: "sleet",
  阵雨夹雪: "sleet",
  冻雨: "sleet",
  雪: "snow",
  阵雪: "snow",
  小雪: "snow",
  中雪: "snow",
  大雪: "snow",
  暴雪: "snowstorm",
  "小雪-中雪": "snow",
  "中雪-大雪": "snow",
  "大雪-暴雪": "snowstorm",
  浮尘: "sand",
  扬沙: "sand",
  沙尘暴: "sand",
  强沙尘暴: "sand",
  龙卷风: "sand",
  雾: "fog",
  浓雾: "fog",
  强浓雾: "fog",
  轻雾: "fog",
  大雾: "fog",
  特强浓雾: "fog",
  霾: "haze",
  中度霾: "haze",
  重度霾: "haze",
  严重霾: "haze",
  热: "clear",
  冷: "snow",
  未知: "clear",
};

/**
 * @description: 获取高德地图天气
 * @author: Quarter
 * @param {string} key 密钥
 * @param {address} address 地址
 * @param {string} type 类型
 * @return {Promise<WeatherInfoData>}
 */
const getAmapWeather = (key: string, address: string, type: string = "now"): Promise<WeatherInfoData> => {
  return new Promise<WeatherInfoData>((resolve) => {
    let result: WeatherInfoData = {
      status: "error",
      data: null,
    };
    // 获取接口数据
    const url = API_WEATHER_AMAP;
    getAmapLngLat(address)
      .then((geoData: GeoResult) => {
        if (geoData.status === "success" && geoData.data) {
          const tempGeoData: GeoData = geoData.data;
          axios.get(url, {
            timeout: weatherConfig.timeout,
            params: {
              key,
              city: tempGeoData.adCode,
            },
          })
            .then((response: AxiosResponse) => {
              if (response.status === 200) {
                const data: any = response.data;
                if (
                  parseInt(data.status, 10) === 1 &&
                  parseInt(data.count, 10) === 1 &&
                  data.info === "OK" &&
                  data.lives.length === 1
                ) {
                  const live = data.lives[0];
                  result = {
                    status: "success",
                    data: {
                      basic: {
                        location: address || null,
                        time: live.reporttime,
                        lng: tempGeoData.lnglat.lng,
                        lat: tempGeoData.lnglat.lat,
                      },
                      now: {
                        temperature: live.temperature,
                        timeStage: getWeatherStage(live.reporttime),
                        icon: AMapWeatherDic[live.weather],
                        condition: live.weather,
                        wind: {
                          deg: null,
                          direction: live.winddirection,
                          force: live.windpower,
                          speed: null,
                        },
                        cloudRate: null,
                        humidity: parseInt(live.humidity, 10),
                        precipitation: null,
                        pressure: null,
                        visibility: null,
                      },
                    },
                  };
                }
              }
            })
            .finally(() => {
              resolve(result);
            });
        } else {
          resolve(result);
        }
      });
  });
};

export default getAmapWeather;