(function($){
  $.fn.dlm = function(method){
    if(this.data("target") == undefined){
      this.data("target", 2);
    }

    function init($obj, options){
      $obj.css({
        'position': 'absolute',
        'top': '0',
        'bottom': '0',
        'width': '100%'
      });
      var _defaultOptions = {
        'token': 'pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q',
        'mapboxId': 'mapbox.streets',
        'view': [22.9870689,120.2735845],
        'zoom': 11,
        'mapName': '0'
      };

      $.fn.dlm.options = $.extend({}, _defaultOptions, options);
    }

    function show($obj){
      var options = $.fn.dlm.options;

      var points = _getPoints();

      L.mapbox.accessToken = options.token;
      var map = L.mapbox.map($obj.attr('id'), options.mapboxId)
        .setView(options.view, options.zoom);
      $obj.data("map", map);

      featureLayer = L.mapbox.featureLayer()
        .setGeoJSON(points)
        .addTo($obj.data("map"));
      $obj.data("featureLayer", featureLayer);

      _change($obj, $obj.data("target"));
    }

    function next($obj){
      target = $obj.data("target");
      target = (++target > 4) ? 4 : target;
      $obj.data("target", target);
      _change($obj, target);
    }

    function previous($obj){
      target = $obj.data("target");
      target = (--target < 1) ? 1 : target;
      $obj.data("target", target);
      _change($obj, target);
    }

    function _change($obj, i){
      $obj.data("featureLayer").setFilter(function (f) {
        return f.properties['myNo'] < i;
      });
      console.log("target: " + i);
    }

    function _getPoints() {
      var points = [
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
      return points;
    }

    /**
     * methods
     */
    var methods = {
      init: function(options){
        return this.each(function(){
          console.log("init function");
          init($(this), options);
        });
      },

      show: function(){
        return this.each(function(){
          console.log("show function");
          show($(this));
        });
      },

      next: function(){
        return this.each(function(){
          console.log("next function");
          next($(this));
        });
      },

      previous: function(){
        return this.each(function(){
          console.log("previous function");
          previous($(this));
        });
      }
    };

    if(methods[method]){
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if(typeof method === 'object' || !method){
      return methods.init.apply(this, arguments);
    }
    else{
      $.error('Method ' + method + ' does not exist on jQuery.mapbox');
    }
  };
})(jQuery);

