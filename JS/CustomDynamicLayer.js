dojo.declare("CustomDynamicLayer",esri.layers.DynamicMapServiceLayer,{
  constructor: function() {
    // Do Constructor Stuff Here
  },
  getImageUrl: function(extent,width,height,callback){
    var params = {
      request:"setLayerDrawingOptions",
      transparent:true,
      format:"image/png",
      bgcolor:"ffffff",
      layers:"3"
    }

    //callback(url+dojo.objectToQuery(params));
  }

});