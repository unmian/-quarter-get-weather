/*
 * @Author: Quarter
 * @Date: 2022-05-07 10:49:13
 * @LastEditTime: 2022-05-07 10:50:20
 * @LastEditors: Quarter
 * @Description: 入口文件
 * @FilePath: /get-weather/test/main.ts
 */
import GetWeather, { WeatherInfoData } from "../src";

GetWeather.getWeather().then((weather: WeatherInfoData) => {
  console.log(123, weather);
}).catch((e) => {
  console.log(123, e);
});