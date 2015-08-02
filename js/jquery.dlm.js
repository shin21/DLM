(function($){
  $.fn.dlm = function(method){
    var options = $.fn.dlm.options;

    var methods = {
      init: function(options){
        this.css({
          'position': 'absolute',
          'top': '0',
          'bottom': '0',
          'width': '100%'
        });
        var _defaultSettings = {
          'token': 'pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q',
          'mapId': 'mapbox.streets',
          'view': [22.9870689,120.2735845],
          'zoom': 11
        };
        return this.each(function(){
          console.log("init");
          $.fn.dlm.options = $.extend({}, _defaultSettings, options);
        });
      },

      show: function(){
        return this.each(function(){
          L.mapbox.accessToken = options.token;
          var map = L.mapbox.map(this.id, options.mapId)
            .setView(options.view, options.zoom);
        });
      }
    };

    if(methods[method]){
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if(typeof method === 'object' || !method){
      return methods.init.apply(this, arguments);
    } else{
      $.error('Method ' + method + ' does not exist on jQuery.mapbox');
    }
  };

  $.fn.dlm.options = {};
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

