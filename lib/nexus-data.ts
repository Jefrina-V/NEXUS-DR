export type RiskBand = 'low' | 'moderate' | 'high' | 'severe'

export type Driver = {
  label: string
  /** contribution in risk points, can be negative */
  points: number
  detail: string
}

export type District = {
  id: string
  name: string
  state: string
  lat: number
  lon: number
  score: number
  delta: number
  population: number
  villages: number
  rainfall24h: number
  rainfall72h: number
  soilMoisture: number
  slope: number
  seismicZone: string
  lastEvent: string
  drivers: Driver[]
  advisory: string
}

export const districts: District[] = [
  {
    id: 'dima-hasao',
    name: 'Dima Hasao',
    state: 'Assam',
    lat: 25.17,
    lon: 93.02,
    score: 91,
    delta: 12,
    population: 214000,
    villages: 68,
    rainfall24h: 168,
    rainfall72h: 310,
    soilMoisture: 0.93,
    slope: 34,
    seismicZone: 'V',
    lastEvent: 'May 2022 — 61 slides, NH-27 cut for 9 days',
    advisory: 'Pre-position NDRF at Haflong. Evacuate 4 hillside hamlets on Mahur ridge.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 31, detail: '310 mm against a 180 mm slide threshold for this terrain class' },
      { label: 'Soil saturation', points: 22, detail: 'Sentinel-1 backscatter shows 0.93 saturation index — near field capacity' },
      { label: 'Slope + lithology', points: 16, detail: '34° mean slope on weathered Barail sandstone' },
      { label: 'Historical slide density', points: 13, detail: '61 recorded failures within 5 km grid since 2015' },
      { label: 'Toe-cutting / road works', points: 9, detail: 'Active railway cutting at Mahur reduces slope support' },
      { label: 'Forest cover retention', points: -6, detail: 'Dense canopy on 42% of the ridge adds root cohesion' },
    ],
  },
  {
    id: 'noney',
    name: 'Noney (Tupul)',
    state: 'Manipur',
    lat: 24.79,
    lon: 93.68,
    score: 87,
    delta: 9,
    population: 47000,
    villages: 34,
    rainfall24h: 141,
    rainfall72h: 268,
    soilMoisture: 0.89,
    slope: 38,
    seismicZone: 'V',
    lastEvent: 'Jun 2022 — Tupul railway camp slide, 61 fatalities',
    advisory: 'Halt night movement on Tupul–Khoupum stretch. Sensor cluster N-14 flagged creep.',
    drivers: [
      { label: 'Ground displacement (IoT)', points: 29, detail: 'Tiltmeter N-14 recorded 21 mm creep in 36 hours' },
      { label: 'Cumulative rainfall (72h)', points: 26, detail: '268 mm with continuing convective bands' },
      { label: 'Slope + lithology', points: 18, detail: '38° cut slope, shale-dominant with high weathering' },
      { label: 'Historical slide density', points: 14, detail: 'Repeat failure corridor along the Jiribam rail alignment' },
      { label: 'Pore-water pressure', points: 8, detail: 'Piezometer trend rising for 3 consecutive cycles' },
      { label: 'Recent slope stabilisation', points: -8, detail: 'Soil nailing completed on 1.2 km in 2024' },
    ],
  },
  {
    id: 'east-khasi',
    name: 'East Khasi Hills',
    state: 'Meghalaya',
    lat: 25.57,
    lon: 91.88,
    score: 78,
    delta: 6,
    population: 825000,
    villages: 112,
    rainfall24h: 212,
    rainfall72h: 402,
    soilMoisture: 0.86,
    slope: 27,
    seismicZone: 'V',
    lastEvent: 'Jul 2023 — Sohra bypass slumping, 3 day closure',
    advisory: 'Monitor Sohra–Shillong bypass. Extreme rainfall but competent quartzite slopes.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 34, detail: '402 mm — highest in NER grid this cycle' },
      { label: 'Soil saturation', points: 19, detail: 'Saturation index 0.86 with poor drainage on plateau edge' },
      { label: 'Slope + lithology', points: 11, detail: '27° slope on competent quartzite reduces failure odds' },
      { label: 'Historical slide density', points: 10, detail: 'Moderate density, concentrated on road cuttings' },
      { label: 'Quarry / land-use change', points: 9, detail: 'Limestone quarrying within 2 km buffer' },
      { label: 'Engineered drainage', points: -5, detail: 'Catch-water drains functional on 68% of corridor' },
    ],
  },
  {
    id: 'papum-pare',
    name: 'Papum Pare',
    state: 'Arunachal Pradesh',
    lat: 27.09,
    lon: 93.61,
    score: 72,
    delta: -3,
    population: 176000,
    villages: 51,
    rainfall24h: 96,
    rainfall72h: 214,
    soilMoisture: 0.78,
    slope: 31,
    seismicZone: 'V',
    lastEvent: 'Aug 2024 — Itanagar–Ziro road blocked 40 hours',
    advisory: 'Risk easing. Keep one JCB unit staged at Kimin junction.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 24, detail: '214 mm, tapering over the last 12 hours' },
      { label: 'Slope + lithology', points: 17, detail: '31° slope on Siwalik soft sediments' },
      { label: 'Soil saturation', points: 15, detail: 'Saturation 0.78 and draining' },
      { label: 'Historical slide density', points: 12, detail: '18 failures on the Hollongi corridor since 2018' },
      { label: 'Deforestation trend', points: 7, detail: '4.1% canopy loss in 3 years' },
      { label: 'Drying trend (48h forecast)', points: -3, detail: 'IMD forecasts <20 mm over next 48 hours' },
    ],
  },
  {
    id: 'aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    lat: 23.73,
    lon: 92.72,
    score: 69,
    delta: 4,
    population: 400000,
    villages: 44,
    rainfall24h: 118,
    rainfall72h: 236,
    soilMoisture: 0.81,
    slope: 36,
    seismicZone: 'V',
    lastEvent: 'May 2024 — Melthum quarry collapse',
    advisory: 'Steep urban slopes with dense housing. Inspect retaining walls in Chaltlang.',
    drivers: [
      { label: 'Slope + built density', points: 25, detail: '36° slopes with unregulated multi-storey construction' },
      { label: 'Cumulative rainfall (72h)', points: 22, detail: '236 mm sustained' },
      { label: 'Soil saturation', points: 14, detail: 'Saturation 0.81 in colluvial cover' },
      { label: 'Historical slide density', points: 11, detail: 'Recurrent failures along Bawngkawn ridge' },
      { label: 'Quarrying activity', points: 6, detail: 'Two active quarries inside city buffer' },
      { label: 'Retaining structures', points: -9, detail: '2023 gabion works on 3.4 km of ridge road' },
    ],
  },
  {
    id: 'mangan',
    name: 'Mangan',
    state: 'Sikkim',
    lat: 27.51,
    lon: 88.53,
    score: 84,
    delta: 15,
    population: 43000,
    villages: 29,
    rainfall24h: 152,
    rainfall72h: 289,
    soilMoisture: 0.9,
    slope: 41,
    seismicZone: 'IV',
    lastEvent: 'Jun 2024 — North Sikkim cut off for 11 days',
    advisory: 'Glacial-fed valley with debris flow risk. Chungthang corridor is single-point access.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 28, detail: '289 mm on already saturated moraine debris' },
      { label: 'Slope + debris cover', points: 23, detail: '41° slope with unconsolidated glacial debris' },
      { label: 'Upstream discharge (Teesta)', points: 17, detail: 'River level 1.8 m above normal, active toe erosion' },
      { label: 'Historical slide density', points: 12, detail: 'Chronic failure zone north of Mangan' },
      { label: 'Snowmelt contribution', points: 6, detail: 'Above-normal temperatures accelerating melt' },
      { label: 'Slope monitoring density', points: -2, detail: '6 active sensors provide early creep detection' },
    ],
  },
  {
    id: 'kohima',
    name: 'Kohima',
    state: 'Nagaland',
    lat: 25.67,
    lon: 94.11,
    score: 58,
    delta: 2,
    population: 270000,
    villages: 38,
    rainfall24h: 74,
    rainfall72h: 162,
    soilMoisture: 0.68,
    slope: 29,
    seismicZone: 'V',
    lastEvent: 'Aug 2023 — NH-2 slip at Piphema',
    advisory: 'Watch category. Routine corridor inspection sufficient.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 19, detail: '162 mm, below the 180 mm threshold' },
      { label: 'Slope + lithology', points: 15, detail: '29° slope on Disang shale' },
      { label: 'Soil saturation', points: 12, detail: 'Saturation 0.68' },
      { label: 'Historical slide density', points: 9, detail: '11 events on NH-2 corridor since 2016' },
      { label: 'Road cutting works', points: 5, detail: 'Four-laning excavation near Piphema' },
      { label: 'Terrace farming cohesion', points: -2, detail: 'Terracing reduces runoff velocity' },
    ],
  },
  {
    id: 'dhalai',
    name: 'Dhalai',
    state: 'Tripura',
    lat: 23.94,
    lon: 91.85,
    score: 41,
    delta: -5,
    population: 378000,
    villages: 57,
    rainfall24h: 52,
    rainfall72h: 108,
    soilMoisture: 0.55,
    slope: 18,
    seismicZone: 'V',
    lastEvent: 'Sep 2022 — minor slumping on Ambassa road',
    advisory: 'Low risk. Normal operations.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 14, detail: '108 mm, well below threshold' },
      { label: 'Slope + lithology', points: 9, detail: '18° gentle hills, low failure potential' },
      { label: 'Soil saturation', points: 8, detail: 'Saturation 0.55 and falling' },
      { label: 'Historical slide density', points: 6, detail: 'Sparse historical record' },
      { label: 'Land-use change', points: 4, detail: 'Rubber plantation expansion' },
      { label: 'Drying trend', points: -4, detail: 'Clear sky forecast for 72 hours' },
    ],
  },
  {
    id: 'churachandpur',
    name: 'Churachandpur',
    state: 'Manipur',
    lat: 24.33,
    lon: 93.68,
    score: 66,
    delta: 3,
    population: 290000,
    villages: 62,
    rainfall24h: 103,
    rainfall72h: 198,
    soilMoisture: 0.76,
    slope: 33,
    seismicZone: 'V',
    lastEvent: 'Jul 2024 — NH-2 Tuivai slip',
    advisory: 'Alert category. Verify sensor cluster C-07 telemetry gap.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 22, detail: '198 mm approaching threshold' },
      { label: 'Slope + lithology', points: 18, detail: '33° slope on flysch sequences' },
      { label: 'Soil saturation', points: 13, detail: 'Saturation 0.76' },
      { label: 'Historical slide density', points: 10, detail: 'Repeat failures on Tuivai alignment' },
      { label: 'Telemetry gap penalty', points: 5, detail: 'Cluster C-07 offline for 6 hours — uncertainty added' },
      { label: 'Bamboo cover cohesion', points: -2, detail: 'Extensive bamboo root mat' },
    ],
  },
  {
    id: 'tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    lat: 27.58,
    lon: 91.86,
    score: 63,
    delta: 7,
    population: 50000,
    villages: 26,
    rainfall24h: 88,
    rainfall72h: 176,
    soilMoisture: 0.72,
    slope: 39,
    seismicZone: 'V',
    lastEvent: 'Apr 2024 — Sela pass debris flow',
    advisory: 'High-altitude corridor. Sela tunnel approach requires patrol.',
    drivers: [
      { label: 'Slope + debris cover', points: 24, detail: '39° slope with frost-shattered rock' },
      { label: 'Cumulative rainfall (72h)', points: 18, detail: '176 mm combined with snowmelt' },
      { label: 'Freeze-thaw cycling', points: 12, detail: '9 freeze-thaw cycles in 10 days' },
      { label: 'Soil saturation', points: 11, detail: 'Saturation 0.72' },
      { label: 'Historical slide density', points: 8, detail: 'Sela and Jang corridors chronic' },
      { label: 'Tunnel bypass completed', points: -10, detail: 'Sela tunnel removes 6 km of exposed alignment' },
    ],
  },
  {
    id: 'west-jaintia',
    name: 'West Jaintia Hills',
    state: 'Meghalaya',
    lat: 25.44,
    lon: 92.2,
    score: 74,
    delta: 5,
    population: 270000,
    villages: 49,
    rainfall24h: 176,
    rainfall72h: 331,
    soilMoisture: 0.84,
    slope: 30,
    seismicZone: 'V',
    lastEvent: 'Jun 2023 — Sonapur slide, NH-6 closed 3 days',
    advisory: 'Sonapur gorge is the critical chokepoint for Silchar-bound traffic.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 30, detail: '331 mm on the Jaintia escarpment' },
      { label: 'Slope + lithology', points: 17, detail: '30° slope, coal-bearing sandstone' },
      { label: 'Soil saturation', points: 16, detail: 'Saturation 0.84' },
      { label: 'Mining-induced instability', points: 12, detail: 'Legacy rat-hole mining within 3 km' },
      { label: 'Historical slide density', points: 9, detail: 'Sonapur gorge repeat failures' },
      { label: 'Slope netting', points: -10, detail: 'Rockfall netting installed 2023 on 2 km' },
    ],
  },
  {
    id: 'karbi-anglong',
    name: 'Karbi Anglong',
    state: 'Assam',
    lat: 25.84,
    lon: 93.43,
    score: 55,
    delta: -2,
    population: 956000,
    villages: 94,
    rainfall24h: 69,
    rainfall72h: 149,
    soilMoisture: 0.64,
    slope: 22,
    seismicZone: 'V',
    lastEvent: 'Jun 2022 — Diphu-Lumding slips',
    advisory: 'Watch category. Rail corridor patrol advised.',
    drivers: [
      { label: 'Cumulative rainfall (72h)', points: 18, detail: '149 mm' },
      { label: 'Slope + lithology', points: 12, detail: '22° slope, moderate competence' },
      { label: 'Soil saturation', points: 11, detail: 'Saturation 0.64 and falling' },
      { label: 'Historical slide density', points: 9, detail: 'Rail corridor failures 2019, 2022' },
      { label: 'Jhum cultivation', points: 7, detail: 'Shifting cultivation on 12% of slopes' },
      { label: 'Drying trend', points: -2, detail: 'Rainfall tapering' },
    ],
  },
]

export type Road = {
  id: string
  name: string
  corridor: string
  status: 'open' | 'at-risk' | 'blocked'
  blockProbability: number
  chokepoint: string
  district: string
  villagesCutOff: number
  alternate: string
  alternateDetour: string
  restoreEta: string
  criticality: string
  path: [number, number][]
}

export const roads: Road[] = [
  {
    id: 'nh-27-haflong',
    name: 'NH-27 Silchar–Haflong',
    corridor: 'Silchar → Haflong → Lumding',
    status: 'blocked',
    blockProbability: 96,
    chokepoint: 'Km 42 Harangajao cutting',
    district: 'Dima Hasao',
    villagesCutOff: 23,
    alternate: 'NH-306 via Jatinga valley',
    alternateDetour: '+74 km / +3h 10m',
    restoreEta: '38 hours (2 excavators deployed)',
    criticality: 'Sole access to Haflong civil hospital catchment',
    path: [
      [24.82, 92.8],
      [25.02, 92.9],
      [25.17, 93.02],
      [25.5, 93.2],
    ],
  },
  {
    id: 'nh-6-sonapur',
    name: 'NH-6 Shillong–Silchar',
    corridor: 'Shillong → Jowai → Sonapur → Silchar',
    status: 'at-risk',
    blockProbability: 71,
    chokepoint: 'Sonapur gorge km 118',
    district: 'West Jaintia Hills',
    villagesCutOff: 14,
    alternate: 'NH-44 via Ratacherra',
    alternateDetour: '+58 km / +2h 25m',
    restoreEta: 'Preventive closure window 22:00–05:00',
    criticality: 'Primary fuel and LPG supply line into Barak valley',
    path: [
      [25.57, 91.88],
      [25.44, 92.2],
      [25.2, 92.5],
      [24.85, 92.75],
    ],
  },
  {
    id: 'nh-2-tupul',
    name: 'NH-2 Imphal–Jiribam',
    corridor: 'Imphal → Noney → Tupul → Jiribam',
    status: 'at-risk',
    blockProbability: 83,
    chokepoint: 'Tupul km 61 rail cutting',
    district: 'Noney',
    villagesCutOff: 19,
    alternate: 'NH-37 via Barak bridge',
    alternateDetour: '+96 km / +4h 05m',
    restoreEta: 'Monitoring — creep 21 mm/36h',
    criticality: 'Lifeline route for Imphal valley essential supplies',
    path: [
      [24.81, 93.94],
      [24.79, 93.68],
      [24.7, 93.4],
      [24.8, 93.12],
    ],
  },
  {
    id: 'nh-10-teesta',
    name: 'NH-10 Sevoke–Gangtok',
    corridor: 'Siliguri → Rangpo → Gangtok → Mangan',
    status: 'blocked',
    blockProbability: 92,
    chokepoint: 'Km 29 Teesta toe erosion',
    district: 'Mangan',
    villagesCutOff: 31,
    alternate: 'Kalimpong–Algarah–Lava route',
    alternateDetour: '+112 km / +5h 20m',
    restoreEta: '3–4 days (river training required)',
    criticality: 'Only all-weather access to North Sikkim',
    path: [
      [26.87, 88.47],
      [27.17, 88.53],
      [27.33, 88.61],
      [27.51, 88.53],
    ],
  },
  {
    id: 'nh-702-ziro',
    name: 'NH-702 Itanagar–Ziro',
    corridor: 'Itanagar → Kimin → Ziro',
    status: 'open',
    blockProbability: 34,
    chokepoint: 'Km 55 Pitapool slip zone',
    district: 'Papum Pare',
    villagesCutOff: 0,
    alternate: 'Gohpur–Ziro via Assam plains',
    alternateDetour: '+140 km / +6h',
    restoreEta: 'Open — single lane at km 55',
    criticality: 'Administrative link to Lower Subansiri HQ',
    path: [
      [27.09, 93.61],
      [27.3, 93.72],
      [27.63, 93.83],
    ],
  },
  {
    id: 'nh-306-aizawl',
    name: 'NH-306 Aizawl–Lunglei',
    corridor: 'Aizawl → Serchhip → Lunglei',
    status: 'at-risk',
    blockProbability: 58,
    chokepoint: 'Km 78 Thenzawl ridge cut',
    district: 'Aizawl',
    villagesCutOff: 8,
    alternate: 'NH-54 via Thenzawl bypass',
    alternateDetour: '+41 km / +1h 45m',
    restoreEta: 'Patrol every 4 hours',
    criticality: 'Connects southern Mizoram district hospitals',
    path: [
      [23.73, 92.72],
      [23.3, 92.85],
      [22.88, 92.73],
    ],
  },
]

export type Sensor = {
  id: string
  type: 'Rain gauge' | 'Tiltmeter' | 'Piezometer' | 'Seismograph' | 'Soil moisture'
  district: string
  status: 'online' | 'degraded' | 'offline'
  reading: string
  battery: number
  lastSync: string
}

export const sensors: Sensor[] = [
  { id: 'N-14', type: 'Tiltmeter', district: 'Noney', status: 'online', reading: '21 mm / 36h creep', battery: 78, lastSync: '2 min ago' },
  { id: 'DH-03', type: 'Rain gauge', district: 'Dima Hasao', status: 'online', reading: '168 mm / 24h', battery: 91, lastSync: '1 min ago' },
  { id: 'MG-07', type: 'Piezometer', district: 'Mangan', status: 'online', reading: '1.8 m above normal', battery: 64, lastSync: '4 min ago' },
  { id: 'C-07', type: 'Soil moisture', district: 'Churachandpur', status: 'offline', reading: 'No telemetry', battery: 12, lastSync: '6 h ago' },
  { id: 'EK-11', type: 'Rain gauge', district: 'East Khasi Hills', status: 'online', reading: '212 mm / 24h', battery: 88, lastSync: '1 min ago' },
  { id: 'AZ-02', type: 'Seismograph', district: 'Aizawl', status: 'degraded', reading: 'Intermittent packets', battery: 41, lastSync: '27 min ago' },
  { id: 'TW-05', type: 'Tiltmeter', district: 'Tawang', status: 'online', reading: '4 mm / 36h creep', battery: 83, lastSync: '3 min ago' },
  { id: 'WJ-09', type: 'Soil moisture', district: 'West Jaintia Hills', status: 'online', reading: '0.84 saturation', battery: 72, lastSync: '2 min ago' },
]

/** 72-hour forecast, 6-hour steps */
export const forecastSeries = [
  { t: 'Now', rainfall: 26, risk: 91, soil: 93, threshold: 75 },
  { t: '+6h', rainfall: 34, risk: 93, soil: 94, threshold: 75 },
  { t: '+12h', rainfall: 41, risk: 95, soil: 96, threshold: 75 },
  { t: '+18h', rainfall: 38, risk: 96, soil: 97, threshold: 75 },
  { t: '+24h', rainfall: 29, risk: 94, soil: 96, threshold: 75 },
  { t: '+30h', rainfall: 18, risk: 90, soil: 93, threshold: 75 },
  { t: '+36h', rainfall: 11, risk: 84, soil: 89, threshold: 75 },
  { t: '+42h', rainfall: 7, risk: 78, soil: 85, threshold: 75 },
  { t: '+48h', rainfall: 4, risk: 71, soil: 80, threshold: 75 },
  { t: '+54h', rainfall: 9, risk: 68, soil: 77, threshold: 75 },
  { t: '+60h', rainfall: 14, risk: 70, soil: 78, threshold: 75 },
  { t: '+66h', rainfall: 6, risk: 64, soil: 74, threshold: 75 },
  { t: '+72h', rainfall: 3, risk: 58, soil: 70, threshold: 75 },
]

export const rainfall14d = [
  { d: 'D-13', mm: 18 },
  { d: 'D-12', mm: 24 },
  { d: 'D-11', mm: 41 },
  { d: 'D-10', mm: 12 },
  { d: 'D-9', mm: 8 },
  { d: 'D-8', mm: 33 },
  { d: 'D-7', mm: 57 },
  { d: 'D-6', mm: 72 },
  { d: 'D-5', mm: 44 },
  { d: 'D-4', mm: 91 },
  { d: 'D-3', mm: 126 },
  { d: 'D-2', mm: 149 },
  { d: 'D-1', mm: 158 },
  { d: 'Today', mm: 168 },
]

export type WeatherCell = {
  system: string
  detail: string
  window: string
  severity: RiskBand
  districts: string[]
}

export const weatherCells: WeatherCell[] = [
  {
    system: 'Active monsoon trough — Meghalaya plateau',
    detail: 'IMD nowcast: 180–220 mm in 24h, orange warning',
    window: 'Next 24 hours',
    severity: 'severe',
    districts: ['East Khasi Hills', 'West Jaintia Hills'],
  },
  {
    system: 'Convective cluster over Barail range',
    detail: 'Embedded cells, 60 mm/h peak intensity',
    window: '6–18 hours',
    severity: 'high',
    districts: ['Dima Hasao', 'Karbi Anglong'],
  },
  {
    system: 'Teesta basin cloudburst probability',
    detail: 'INSAT-3DR IR shows deepening convection above 4000 m',
    window: '12–30 hours',
    severity: 'high',
    districts: ['Mangan'],
  },
  {
    system: 'Weakening low over Manipur hills',
    detail: 'Rainfall tapering to 20 mm/24h',
    window: '24–48 hours',
    severity: 'moderate',
    districts: ['Noney', 'Churachandpur'],
  },
]

export type Incident = {
  id: string
  location: string
  district: string
  type: string
  reported: string
  priority: number
  populationAtRisk: number
  accessStatus: string
  team: string
  stage: 'triage' | 'dispatched' | 'on-site' | 'resolved'
  reason: string
}

export const incidents: Incident[] = [
  {
    id: 'INC-2411',
    location: 'Mahur ridge, 4 hamlets',
    district: 'Dima Hasao',
    type: 'Imminent slope failure',
    reported: '14 min ago',
    priority: 98,
    populationAtRisk: 1240,
    accessStatus: 'Road cut — air/foot only',
    team: 'NDRF 1st Bn Team A',
    stage: 'dispatched',
    reason: 'Risk 91 + sole access blocked + 1,240 residents inside runout zone',
  },
  {
    id: 'INC-2409',
    location: 'Tupul rail camp',
    district: 'Noney',
    type: 'Active ground creep',
    reported: '38 min ago',
    priority: 94,
    populationAtRisk: 420,
    accessStatus: 'Single lane, escorted',
    team: 'SDRF Manipur Team 2',
    stage: 'on-site',
    reason: 'Tiltmeter creep 21 mm/36h at a site with prior mass-casualty failure',
  },
  {
    id: 'INC-2415',
    location: 'Chungthang–Mangan stretch',
    district: 'Mangan',
    type: 'Debris flow / stranded travellers',
    reported: '6 min ago',
    priority: 92,
    populationAtRisk: 310,
    accessStatus: 'NH-10 blocked at km 29',
    team: 'Awaiting assignment',
    stage: 'triage',
    reason: 'Single-point access severed for 31 villages, 310 stranded',
  },
  {
    id: 'INC-2402',
    location: 'Sonapur gorge',
    district: 'West Jaintia Hills',
    type: 'Rockfall on carriageway',
    reported: '1 h 12 m ago',
    priority: 81,
    populationAtRisk: 0,
    accessStatus: 'Convoy regulated',
    team: 'BRO Task Force 4',
    stage: 'on-site',
    reason: 'Fuel supply corridor for Barak valley at 71% blockage probability',
  },
  {
    id: 'INC-2398',
    location: 'Chaltlang retaining wall',
    district: 'Aizawl',
    type: 'Structural distress report',
    reported: '2 h 05 m ago',
    priority: 67,
    populationAtRisk: 180,
    accessStatus: 'Accessible',
    team: 'Aizawl Municipal Engg.',
    stage: 'dispatched',
    reason: 'Field report with photo evidence, 9 households directly downslope',
  },
  {
    id: 'INC-2390',
    location: 'Piphema NH-2 slip',
    district: 'Kohima',
    type: 'Minor debris on road',
    reported: '4 h 41 m ago',
    priority: 38,
    populationAtRisk: 0,
    accessStatus: 'Cleared',
    team: 'NHIDCL Unit 7',
    stage: 'resolved',
    reason: 'Cleared within SLA, corridor restored to two lanes',
  },
]

export type Alert = {
  id: string
  headline: string
  district: string
  band: RiskBand
  channels: string[]
  languages: string[]
  reach: number
  delivered: number
  issued: string
  status: 'delivered' | 'sending' | 'draft'
}

export const alertLog: Alert[] = [
  {
    id: 'ALT-0912',
    headline: 'Evacuate Mahur ridge hamlets — imminent landslide',
    district: 'Dima Hasao',
    band: 'severe',
    channels: ['Cell Broadcast', 'SMS', 'IVR', 'App'],
    languages: ['Dimasa', 'Assamese', 'Hindi', 'English'],
    reach: 214000,
    delivered: 198420,
    issued: '11 min ago',
    status: 'sending',
  },
  {
    id: 'ALT-0911',
    headline: 'Avoid NH-10 km 29 — road blocked, use Kalimpong detour',
    district: 'Mangan',
    band: 'severe',
    channels: ['SMS', 'App', 'Cell Broadcast'],
    languages: ['Nepali', 'Lepcha', 'Hindi', 'English'],
    reach: 43000,
    delivered: 41960,
    issued: '46 min ago',
    status: 'delivered',
  },
  {
    id: 'ALT-0910',
    headline: 'Orange warning: 200 mm rainfall expected in 24h',
    district: 'East Khasi Hills',
    band: 'high',
    channels: ['SMS', 'App', 'IVR'],
    languages: ['Khasi', 'English'],
    reach: 825000,
    delivered: 806100,
    issued: '2 h 10 m ago',
    status: 'delivered',
  },
  {
    id: 'ALT-0909',
    headline: 'Night travel ban on Tupul stretch until further notice',
    district: 'Noney',
    band: 'high',
    channels: ['SMS', 'IVR', 'App'],
    languages: ['Manipuri', 'Rongmei', 'Hindi'],
    reach: 47000,
    delivered: 44180,
    issued: '3 h 30 m ago',
    status: 'delivered',
  },
]

export const channelStats = [
  { channel: 'Cell Broadcast', reach: 99, latency: '4 s', note: 'Tower-level, no subscription needed' },
  { channel: 'SMS', reach: 94, latency: '11 s', note: 'Works on 2G feature phones' },
  { channel: 'Mobile App', reach: 61, latency: '2 s', note: 'Rich map + evacuation route' },
  { channel: 'Voice IVR', reach: 88, latency: '38 s', note: 'For low-literacy and elderly recipients' },
]

export type FieldReport = {
  id: string
  observer: string
  district: string
  note: string
  gps: string
  captured: string
  sync: 'synced' | 'queued' | 'conflict'
  photos: number
}

export const fieldReports: FieldReport[] = [
  {
    id: 'FR-771',
    observer: 'Aiban L. (ASHA worker)',
    district: 'West Jaintia Hills',
    note: 'New tension cracks above Sonapur bend, 30 m long, widening since morning.',
    gps: '25.4412, 92.1987 ±6 m',
    captured: '18 min ago',
    sync: 'queued',
    photos: 3,
  },
  {
    id: 'FR-770',
    observer: 'Const. R. Thangkhiew',
    district: 'Dima Hasao',
    note: 'Mahur hamlet evacuation started, 62 of 140 families moved to school shelter.',
    gps: '25.1701, 93.0212 ±4 m',
    captured: '41 min ago',
    sync: 'synced',
    photos: 5,
  },
  {
    id: 'FR-769',
    observer: 'Village volunteer — Noney',
    district: 'Noney',
    note: 'Muddy discharge from culvert at km 61, water turning brown. No slide visible yet.',
    gps: '24.7902, 93.6811 ±9 m',
    captured: '1 h 04 m ago',
    sync: 'queued',
    photos: 2,
  },
  {
    id: 'FR-766',
    observer: 'BRO patrol 4',
    district: 'Mangan',
    note: 'Debris cleared at km 31, but toe erosion continuing at km 29. Needs river training.',
    gps: '27.5088, 88.5344 ±5 m',
    captured: '2 h 22 m ago',
    sync: 'conflict',
    photos: 4,
  },
]

export type FalsePositive = {
  id: string
  district: string
  triggered: string
  outcome: string
  action: string
  verifiedBy: string
}

export const falsePositives: FalsePositive[] = [
  {
    id: 'FP-118',
    district: 'Papum Pare',
    triggered: 'Risk spiked to 79 on rain gauge spike',
    outcome: 'Gauge funnel blocked by leaf litter — false reading',
    action: 'Gauge excluded for 6h, model retrained on corrected series',
    verifiedBy: 'Field team + adjacent gauge cross-check',
  },
  {
    id: 'FP-115',
    district: 'Kohima',
    triggered: 'Tiltmeter jump of 14 mm',
    outcome: 'Road-widening blasting vibration, not slope movement',
    action: 'Blast schedule now ingested as a suppression signal',
    verifiedBy: 'NHIDCL blast log correlation',
  },
  {
    id: 'FP-109',
    district: 'Dhalai',
    triggered: 'Satellite change-detection flagged bare slope',
    outcome: 'Rubber plantation clearing, no failure',
    action: 'Land-use layer updated, change-detection threshold raised',
    verifiedBy: 'Sentinel-2 revisit + field photo',
  },
]

export const modelCard = {
  ensemble: [
    { name: 'XGBoost susceptibility', weight: 34, auc: 0.91, note: 'Static terrain + lithology + historical inventory' },
    { name: 'LSTM rainfall-trigger', weight: 28, auc: 0.88, note: 'Sequence model on 72h rainfall + soil moisture' },
    { name: 'Random Forest sensor fusion', weight: 22, auc: 0.86, note: 'Tilt, pore pressure, seismic micro-events' },
    { name: 'InSAR deformation index', weight: 16, auc: 0.84, note: 'Sentinel-1 interferometric ground movement' },
  ],
  metrics: [
    { label: 'Recall on recorded events', value: '92.4%' },
    { label: 'False positive rate', value: '7.1%' },
    { label: 'Mean lead time', value: '31 hours' },
    { label: 'Explainability', value: 'SHAP per district' },
  ],
}

export const dataSources = [
  { name: 'IMD public API', kind: 'Weather', cadence: '15 min', status: 'live', detail: 'Rainfall, nowcast, colour warnings by district' },
  { name: 'ISRO / NRSC Bhuvan', kind: 'Satellite', cadence: '6 h', status: 'live', detail: 'Sentinel-1 InSAR, Sentinel-2 change detection' },
  { name: 'GSI landslide inventory', kind: 'Historical', cadence: 'Monthly', status: 'live', detail: '11,400 catalogued NER failures' },
  { name: 'CartoDEM 30 m', kind: 'Terrain', cadence: 'Static', status: 'live', detail: 'Slope, aspect, curvature, flow accumulation' },
  { name: 'State IoT slope network', kind: 'Sensors', cadence: '1 min', status: 'degraded', detail: '2 of 8 clusters need servicing' },
  { name: 'NDMA / SDMA registry', kind: 'Governance', cadence: 'Daily', status: 'live', detail: 'Shelters, teams, equipment, contact trees' },
  { name: 'NHIDCL / BRO road status', kind: 'Infrastructure', cadence: '30 min', status: 'live', detail: 'Closures, works, restoration progress' },
  { name: 'Census + SECC vulnerability', kind: 'Population', cadence: 'Static', status: 'live', detail: 'Village population, households, facilities' },
]

export const impactStats = [
  { label: 'Mean warning lead time', value: '31 h', note: 'vs 4–6 h with current manual advisories' },
  { label: 'Population under active watch', value: '3.9 M', note: 'Across 12 districts in this deployment' },
  { label: 'Response effort saved', value: '~38%', note: 'Fewer wasted deployments from prioritised triage' },
  { label: 'Districts scalable per cluster', value: '40+', note: 'Modular tenancy, district → state rollout' },
]

// ── helpers ─────────────────────────────────────────────────────────────────

export function bandOf(score: number): RiskBand {
  if (score >= 85) return 'severe'
  if (score >= 70) return 'high'
  if (score >= 50) return 'moderate'
  return 'low'
}

export const bandMeta: Record<RiskBand, { label: string; cssVar: string; text: string; bg: string; border: string; dot: string }> = {
  low: {
    label: 'Low',
    cssVar: 'var(--risk-low)',
    text: 'text-risk-low',
    bg: 'bg-risk-low/12',
    border: 'border-risk-low/35',
    dot: 'bg-risk-low',
  },
  moderate: {
    label: 'Watch',
    cssVar: 'var(--risk-moderate)',
    text: 'text-risk-moderate',
    bg: 'bg-risk-moderate/12',
    border: 'border-risk-moderate/35',
    dot: 'bg-risk-moderate',
  },
  high: {
    label: 'Alert',
    cssVar: 'var(--risk-high)',
    text: 'text-risk-high',
    bg: 'bg-risk-high/12',
    border: 'border-risk-high/35',
    dot: 'bg-risk-high',
  },
  severe: {
    label: 'Severe',
    cssVar: 'var(--risk-severe)',
    text: 'text-risk-severe',
    bg: 'bg-risk-severe/14',
    border: 'border-risk-severe/40',
    dot: 'bg-risk-severe',
  },
}

export function riskColor(score: number) {
  return bandMeta[bandOf(score)].cssVar
}

export const languages = [
  'English',
  'Hindi',
  'Assamese',
  'Bengali',
  'Khasi',
  'Garo',
  'Manipuri',
  'Mizo',
  'Nagamese',
  'Nepali',
  'Bodo',
  'Dimasa',
]
