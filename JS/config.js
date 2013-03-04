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
  centerX: 20,
  centerY: 0,
  zoom: 2
}