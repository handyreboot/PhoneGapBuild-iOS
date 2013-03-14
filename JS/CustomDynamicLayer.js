// Custom Extended Layer
dojo.declare("CustomDynamicLayer",esri.layers.ArcGISDynamicMapServiceLayer,{
  constructor: function() {
    // Do Constructor Stuff Here
  },
  getImageUrl: function(extent,width,height,callback){
    var params = {
      dynamicLayers: [{
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
              "value": "BR",
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
              "value": "BD",
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
            }]
          }
        }
      }],
      transparent:true,
      dpi: 96,
      format:"png8",
      layers:"show:1,3",
      f:"image",
      imageSR:102100,
      bboxSR:102100,
      bbox: extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
      size: width+","+height
      //width: width,
      //height:height
    }
    //size	1316,569
    callback(Config.dynamicLayer.url+"/export?"+dojo.objectToQuery(params));
  }
});
// Custom Extended Layer