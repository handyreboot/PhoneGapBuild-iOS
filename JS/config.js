var Config = {};
// Add Default Items in Here
Config.dynamicLayer = {
  id: "DHSMap",
  url: "http://gis101.measuredhs.com/arcgis/rest/services/production/StatCompiler/MapServer",
  defaultVisibleLayers: [1,3]
}

Config.mapDefaults = {
  centerX: 20,
  centerY: 40,
  zoom: 3
}

Config.mapDefaults.phone = {
  centerX: 35,
  centerY: 15,
  zoom: 3
}

Config.indicatorDefsLookup = {
  "Total fertility rate (children per women)":0,
  "Percentage of married women currently using any method of family planning":1,
  "Percentage of married women currently using any modern method of family planning":2,
  "Percentage of married women with an unmet need for family planning (Revised)":3,
  "Median age at first marriage for women age 25-49 (years)":4,
  "Median age at first sex for women age 25-49 (years)":5,
  "Infant mortality rate (per 1,000 live births)":6,
  "Under-five mortality rate (per 1,000 live births)":7,
  "Percentage of live births delivered at a health facility":8,
  "Percentage of children underweight (-2 SD)":9,
  "Percentage of children stunted (-2 SD)":10,
  "Percentage of children wasted (-2 SD)":11,
  "Percentage of children fully immunized":12,
  "Percentage of children with diarrhea who received either ORS or RHS":13,
  "Median exclusive breastfeeding duration (months)":14,
  "Percentage of children <5 sleeping under an ITN the night before the survey":15,
  "HIV prevalence among general population: Both sexes":16,
  "HIV prevalence among general population: Women":17,
  "HIV prevalence among general population: Men":18,
  "Population receiving an HIV test and receiving test results in the last 12 months: Women":19,
  "Population receiving an HIV test and receiving test results in the last 12 months: Men":20,
  "Percentage of women who are literate":21,
  "Percentage of respondents with secondary or higher education":22,
  "Percentage of households with electricity":23
}

Config.indicatorByCode = {
  '20171000':'Total fertility rate (children per women)',
  '34202000':'Percentage of married women currently using any method of family planning',
  '34202001':'Percentage of married women currently using any modern method of family planning',
  '216236002':'Percentage of married women with an unmet need for family planning (Revised)',
  '55166000':'Median age at first marriage for women age 25-49 (years)',
  '57166000':'Median age at first sex for women age 25-49 (years)',
  '70254002':'Infant mortality rate (per 1,000 live births)',
  '70254004':'Under-five mortality rate (per 1,000 live births)',
  '77282000':'Percentage of live births delivered at a health facility',
  '214528002':'Percentage of children underweight (-2 SD)',
  '214527002':'Percentage of children stunted (-2 SD)',
  '214529002':'Percentage of children wasted (-2 SD)',
  '82272010':'Percentage of children fully immunized',
  '87277003':'Percentage of children with diarrhea who received either ORS or RHS',
  '91317001':'Median exclusive breastfeeding duration (months)',
  '208490003':'Percentage of children < 5 sleeping under an ITN the night before the survey',
  '1091002003':'HIV prevalence among general population: Both sexes',
  '1091002002':'HIV prevalence among general population: Women',
  '1091002001':'HIV prevalence among general population: Men',
  '1115002002':'Population receiving an HIV test and receiving test results in the last 12 months: Women',
  '1115002001':'Population receiving an HIV test and receiving test results in the last 12 months: Men',
  '127383002':'Percentage of women who are literate',
  '11115002':'Percentage of respondents with secondary or higher education',
  '8142001':'Percentage of households with electricity'
}

Config.dynamicLayerInfo = [{
  "id": 1,
  "source": {
    "type": "mapLayer",
    "mapLayerId": 1
  }
}, {
  "id": 3,
  "source": {
    "type": "mapLayer",
    "mapLayerId": 3
  },
  "drawingInfo": {
    "renderer": {
      "type": "uniqueValue",
      "field1": "DHS_CC",
      "defaultSymbol": {
        "color": [255, 0, 0, 0],
        "outline": {
          "color": [0, 0, 0, 0],
          "width": 9,
          "type": "esriSLS",
          "style": "esriSLSSolid"
        },
        "type": "esriSFS",
        "style": "esriSFSSolid"
      },
      "uniqueValueInfos": [{
        "value": "KE",
        "symbol": {
          "color": [253, 204, 138, 255],
          "outline": {
            "color": [0, 0, 0, 0],
            "width": 0.75,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          },
          "type": "esriSFS",
          "style": "esriSFSSolid"
        }
      }, {
        "value": "UG",
        "symbol": {
          "color": [179, 0, 0, 255],
          "outline": {
            "color": [0, 0, 0, 0],
            "width": 0.75,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          },
          "type": "esriSFS",
          "style": "esriSFSSolid"
        }
      },{
        "value":"TZ",
        "symbol":{
          "color":[227, 74, 51,255],
          "outline":{
            "color":[0,0,0,0],
            "width":0.75,
            "type":"esriSLS",
            "style":"esriSLSSolid"
          },
          "type":"esriSFS",
          "style":"esriSFSSolid"
        }
      },{
          "value":"RW",
          "symbol":{
            "color":[252,141,89,255],
            "outline":{
              "color":[0,0,0,0],
              "width":0.75,
              "type":"esriSLS",
              "style":"esriSLSSolid"
            },
            "type":"esriSFS",
            "style":"esriSFSSolid"
          }
      }]
    }
  }
}];