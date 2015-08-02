(function($){
  var _settings = {};

  var methods = {
    /*
     * init method
     */
    init: function(options){
      var _defaultSettings = {
        'token': 'pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q',
        'mapId': 'mapbox.streets',
        'view': [22.9870689,120.2735845],
        'zoom': 11
      };
      _settings = $.extend(_defaultSettings, options);

      return this.each(function(){
      });
    },

    /*
     * show method
     */
    show: function(){
      return this.each(function(){
        L.mapbox.accessToken = _settings.token;
        var map = L.mapbox.map(this.id, _settings.mapId)
          .setView(_settings.view, _settings.zoom);
      });
    },

    /*
     * update method
     */
    update: function(options){
      return this.each(function(){
      });
    }
  };

  $.fn.mapbox = function(method){
    if(methods[method]){
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if(typeof method === 'object' || !method){
      return methods.init.apply( this, arguments );
    } else{
      $.error('Method ' + method + ' does not exist on jQuery.mapbox');
    }
  };
})(jQuery);

/*

L.mapbox.accessToken = 'pk.eyJ1IjoieXNoaW5jMjEiLCJhIjoidGlBSzZEUSJ9.5Yq1DjgjbloJZe_TkJWVUA';
//var map = L.mapbox.map('map', 'examples.ra3sdcxr')
var map = L.mapbox.map('map', 'eleanor.ipncow29')
  .setView([22.9870689,120.2735845],11);

var point1 = [
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [120.2, 22.95]
    },
    "properties": {
      "title": "Mapbox DC",
      "description": "1714 14th St NW, Washington DC",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "monument",
      "myNo": 1
    }
  }
];

var point2 = [
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [120.2, 22.95]
    },
    "properties": {
      "title": "Mapbox DC",
      "description": "1714 14th St NW, Washington DC",
      "marker-color": "#fc4353",
      "marker-size": "large",
      "marker-symbol": "monument",
      "myNo": 1
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [120.3, 22.95]
    },
    "properties": {
      "title": "Mapbox DC",
      "description": "1714 14th St NW, Washington DC",
      "marker-color": "#fc4300",
      "marker-size": "large",
      "marker-symbol": "hospital",
      "myNo": 2
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [120.4, 22.95]
    },
    "properties": {
      "marker-color": "#fc4300",
      "marker-size": "large",
      "marker-symbol": "bus",
      "myNo": 3
    }
  }
];



var circle = L.circle([23, 120.5], 200).addTo(map);
var target = 2;
var featureLayer1 = L.mapbox.featureLayer();

featureLayer1.setGeoJSON(point2);
featureLayer1.addTo(map);
change(target);

function change(i){
  featureLayer1.setFilter(function (f) {
    return f.properties['myNo'] < i;
  });
  console.log("target: " + i);
}

function goLeft() {
  target = (--target < 1) ? 1 : target;
  change(target);
}
function goRight() {
  target = (++target > 4) ? 4 : target;
  change(target);
}

document.getElementById("left").addEventListener("click", goLeft);
document.getElementById("right").addEventListener("click", goRight);

*/

