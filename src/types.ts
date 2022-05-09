/*
 * @Author: Quarter
 * @Date: 2022-05-07 07:14:06
 * @LastEditTime: 2022-05-09 03:03:40
 * @LastEditors: Quarter
 * @Description: 类型描述
 * @FilePath: /get-weather/src/types.ts
 */

// 天气API类型
export type WeatherApiType = "HeWeather" | "HeWeatherV7" | "CaiyunWeather" | "AMapWeather";
// 天气时间
export type WeatherTimeStage = "all" | "day" | "night";
// API状态
export type ApiStatus = "processing" | "success" | "error" | "cancel";

// 经纬度坐标
export interface LngLat {
  lng: number;
  lat: number;
}

// 天气方法映射
export interface WeatherMethodMap {
  [name: string]: (key: string, address: string, type?: string) => Promise<WeatherInfoData>;
}

// 获取天气配置项
export interface GetWeatherOptions {
  cache?: boolean; // 是否启用缓存
}

// 天气密钥配置
export interface WeatherKeyConfig {
  key: string; // 密钥
  type: WeatherApiType; // 类型
}

// 天气配置
export interface WeatherConfig {
  caiYunRewrite: string; // 彩云天气重写地址
  cache: number; // 天气缓存过期时间，单位：分钟
  keys: WeatherKeyConfig[]; // 密钥配置
  timeout: number | undefined; // ajax 超时时间
  channels: WeatherApiType[]; // 指定渠道
}

// 天气配置项
export interface WeatherOptions {
  caiYunRewrite?: string; // 彩云天气重写地址
  cache?: number; // 天气缓存过期时间，单位：分钟
  keys?: WeatherKeyConfig[]; // 密钥配置
  timeout?: number; // ajax 超时时间
  channels?: WeatherApiType[]; // 指定渠道
}

// 高德天气图标映射
export interface AMapWeatherIconMap {
  [code: string]: string;
}

// 彩云天气信息
export interface CaiYunWeatherIconInfo {
  weather: string;
  time: WeatherTimeStage;
  icon: string;
}

// 彩云天气图标映射
export interface CaiYunWeatherIconMap {
  [code: string]: CaiYunWeatherIconInfo;
}

// 和风天气图标映射
export interface HeWeatherIconMap {
  [code: number]: string;
}

// 天气信息数据
export interface WeatherInfoData {
  status: ApiStatus; // 数据状态
  data: WeatherInfo | null; // 数据
}

// 天气信息
export interface WeatherInfo {
  basic: WeatherBaseInfo; // 基础天气数据
  now: WeatherInfoItem; // 实时天气数据
  forecast?: WeatherInfoItem[]; // 预报天气数据
}

// 天气数据缓存
export interface WeatherInfoCache {
  timestamp: number; // 时间
  location: string; // 地址
  data: WeatherInfoData; // 数据
}

// 天气信息的基础数据
export interface WeatherBaseInfo {
  location: string | null; // 地点
  time: string; // 时间
  lng: number; // 经度
  lat: number; // 纬度
}

// 风数据
export interface WeatherWind {
  deg: number | null; // 风向角度
  direction: string | null; // 风向
  force: string | null; // 风力
  speed: number | null; // 风速
}

// 空气质量
export interface WeatherAirQuality {
  aqi: number | null; // 国标 AQI
  description: string | null; // 国标空气质量中文描述
  pm25: number | null; // PM25 浓度(μg/m3)
  pm10: number | null; // PM10 浓度(μg/m3)
  o3: number | null; // 臭氧浓度(μg/m3)
  no2: number | null; // 二氧化氮浓度(μg/m3)
  so2: number | null; // 二氧化硫浓度(μg/m3)
  co: number | null; // 一氧化碳浓度(mg/m3)
}

// 单条天气数据
export interface WeatherInfoItem {
  time?: string; // 时间
  timeStage?: WeatherTimeStage; // 天气时间段
  temperature: number; // 温度，默认单位：摄氏度	21
  icon: string; // 天气图标类
  condition: string; // 实况天气状况描述	晴
  wind: WeatherWind; // 风情
  cloudRate: number | null; // 云量	23
  humidity: number; // 相对湿度	40
  precipitation: number | null; // 降水量	0
  pressure: number | null; // 大气压强	1020
  visibility: number | null; // 能见度，默认单位：公里	10
  airQuality?: WeatherAirQuality; // 空气质量，仅限彩云天气、和风天气
}

// 地理编码结果
export interface GeoResult {
  status: ApiStatus;
  data: GeoData | null;
}

// 地理编码数据
export interface GeoData {
  adCode: string | null; // 城市编码
  lnglat: LngLat; // 经纬度
}