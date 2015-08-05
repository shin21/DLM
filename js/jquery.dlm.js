(function($){
  $.fn.dlm = function(method){

    /**
     * public method
     */
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
        'mapName': '0',
        'dir': 'photo',
        'dirData': [],
      };

      $obj.data("target", 0);
      $.fn.dlm.options = $.extend({}, _defaultOptions, options);
    }

    function show($obj){
      var options = $.fn.dlm.options;

      // set mapbox
      L.mapbox.accessToken = options.token;
      var map = L.mapbox.map($obj.attr('id'), options.mapboxId)
        .setView(options.view, options.zoom);
      $obj.data("map", map);

      // set featurelayer
      var geoJSONData = _getGeoJSONData($obj);
      var featureLayer = L.mapbox.featureLayer()
        .setGeoJSON(geoJSONData)
        .addTo($obj.data("map"));
      $obj.data("featureLayer", featureLayer);

      _change($obj, $obj.data("target"));
    }

    function next($obj){
      var max = $obj.data("points").length - 1;
      var target = $obj.data("target");
      target = (++target > max) ? max : target;
      $obj.data("target", target);
      _change($obj, target);
    }

    function previous($obj){
      var min = -1;
      var target = $obj.data("target");
      target = (--target < min) ? min : target;
      $obj.data("target", target);
      _change($obj, target);
    }

    function test($obj){
      _getGeoJSONData($obj);
    }

    /**
     * private method
     */
    function _change($obj, i){
      $obj.data("featureLayer").setFilter(function(p){
        return p.properties['order'] <= i;
      });
      console.log("target: " + i);
    }

    function _getGeoJSONData($obj){
      var pointsList = _getDataList($obj, "dir", $.fn.dlm.options.mapName);
      console.log(pointsList);
      console.log("============");
      var pointsList = _getDataList($obj, "image", pointsList[0]);
      console.log(pointsList);

      if(pointsList == [])
        return [];
      return [];
    }

    function _getDataList($obj, want, where){
      if(typeof want == "undefined"){
        $.error("undefined \"want\" in _getDataList.");
        return [];
      }
      var retData = [];
      var dirData = $.fn.dlm.options.dirData;

      for(var key in dirData){
        var addr = dirData[key].split("/");
        var lastName = addr[addr.length-1];

        // check first address
        if(key == 0){
          if(lastName != $.fn.dlm.options.dir){
            alert("Your location of dirData is: " + lastName + "\nPlease modify it to: " + $.fn.dlm.options.dir);
            return [];
          }
          else
            continue;
        }

        // find image filetype
        if(lastName.match(/\.(jpg|png|bmp|gif)/gi)){
          if(want == "image" && addr[addr.length-3] == $.fn.dlm.options.mapName)
            _pushData(retData, addr, want, where);
        }
        else{
          if(want == "dir")
            _pushData(retData, addr, want, where);
        }
      }
      return retData;
    }

    function _pushData(retData, addr, want, where){
      var lastName = addr[addr.length-1];
      if(want == "image")
        lastName = addr[addr.length-2] + "/" + lastName;
      if(addr[addr.length-2] == where || typeof where == "undefined" || where == "0")
        retData.push(lastName);
    }

    function _getPoints($obj){
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
            "order": 0
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
            "order": 1
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
            "order": 2
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
      },

      test: function() {
        return this.each(function(){
          console.log("test function");
          test($(this));
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

