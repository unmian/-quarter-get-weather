# @quarter/get-weather

> 使用多个服务商的聚合天气 API 查询天气信息的工具库

## Documents

### 配置

通过调用 `config` 方法来设置插件相关配置

```typescript
import GetWeather from "@quarter/get-weather";

GetWeather.config(opts);
```

其中 `opts` 为相关配置项构成的对象， 类型为 `WeatherConfig`，具体属性类型如下

```typescript
// WeatherConfig 类型说明
caiYunRewrite: string; // 彩云天气重写地址，主要为解决跨域问题
cache: number; // 天气缓存过期时间，单位：分钟
keys: WeatherKeyConfig[]; // 密钥配置数组，可配置多组同类型或不同类型密钥，防止 API 调用达上限
timeout: number | undefined; // ajax 超时时间
channels: WeatherApiType[]; // 指定渠道，仅从指定的渠道中获取天气信息

// WeatherKeyConfig 类型说明
key: string; // 密钥
type: WeatherApiType; // 类型

// WeatherApiType 类型说明
"HeWeather" | "HeWeatherV7" | "CaiyunWeather" | "AMapWeather"
```

**注意：** 初始化配置应尽量提前，需要在调用获取天气方法之前完成相关配置修改

### 获取天气

通过调用 `getWeather` 方法来获取天气数据

```typescript
import GetWeather from "@quarter/get-weather";

GetWeather.getWeather("江苏省南京市").then((data: WeatherInfoData) => { console.log(data); });

// getWeather 类型说明
(address?: string, opts?: GetWeatherOptions) => Promise<WeatherInfoData>
// address: 为需要获取天气的地址字符串
// opts: 为获取天气的相关配置项

// GetWeatherOptions 类型说明
cache?: boolean; // 本次是否允许从缓存获取
```

`WeatherInfoData` 为获取的天气数据类型，具体类型说明如下

```typescript
// WeatherInfoData 类型说明
status: "processing" | "success" | "error" | "cancel"; // 数据状态
data: WeatherInfo | null; // 数据

// WeatherInfo 类型说明
basic: WeatherBaseInfo; // 基础天气数据
now: WeatherInfoItem; // 实时天气数据
forecast?: WeatherInfoItem[]; // 预报天气数据

// WeatherBaseInfo 类型说明
location: string | null; // 地点
time: string; // 时间
lng: number; // 经度
lat: number; // 纬度

// WeatherInfoItem 类型说明
time?: string; // 时间
timeStage?: "all" | "day" | "night"; // 天气时间段
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

// WeatherAirQuality 类型说明
aqi: number | null; // 国标 AQI
description: string | null; // 国标空气质量中文描述
pm25: number | null; // PM25 浓度(μg/m3)
pm10: number | null; // PM10 浓度(μg/m3)
o3: number | null; // 臭氧浓度(μg/m3)
no2: number | null; // 二氧化氮浓度(μg/m3)
so2: number | null; // 二氧化硫浓度(μg/m3)
co: number | null; // 一氧化碳浓度(mg/m3)
```


## Licenses

GPL-3.0 License © 2022-PRESENT [Quarter](https://github.com/unmian)

## Releases

### Version 0.2.1 - 2022/05/10

- **refactor:** 按照彩云天气文档更新天气代码映射关系

### Version 0.2.0 - 2022/05/09

- **feat:** 加入和风天气空气质量数据
- **docs:** 完善 README 文档

### Version 0.1.0 - 2022/05/07

- **Refactor:** 从业务系统迁移相关代码并整理和分拆相关逻辑
- **feat:** 加入和风天气地理信息查询
- **feat:** 加入彩云天气空气质量数据