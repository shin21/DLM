(function($){
  $.fn.dlm = function(method){

    /**
     * public method
     */
    function init($obj, options){
      $obj.css({
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "width": "100%",
        "z-index": 1
      });
      var _defaultOptions = {
        "token": "pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q",
        "mapboxId": "mapbox.streets",
        "view": [22.9870689,120.2735845],
        "zoom": 11,
        "mapName": "0",
        "dir": "photo",
        "dirData": [],
        "infoId": "info"
      };

      $obj.data("target", 0);
      $.fn.dlm.options = $.extend({}, _defaultOptions, options);
    }

    function show($obj){
      var options = $.fn.dlm.options;

      // set mapbox
      L.mapbox.accessToken = options.token;
      var map = L.mapbox.map($obj.attr("id"), options.mapboxId)
        .setView(options.view, options.zoom);
      $obj.data("map", map);

      // set featurelayer
      var geoJSONData = _getGeoJSONData($obj);
      var featureLayer = L.mapbox.featureLayer()
        .setGeoJSON(geoJSONData)
        .addTo($obj.data("map"));
      _showImgHandler(options, map, featureLayer);
      $obj.data("featureLayer", featureLayer);

      _change($obj, $obj.data("target"));
    }

    function next($obj){
      var max = $obj.data("pointsNum") - 1;
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
      /*
      var pointsList = _getDataList($obj, "dir", $.fn.dlm.options.mapName);
      console.log(pointsList);
      console.log("============");
      var pointsList = _getDataList($obj, "image", pointsList[0]);
      console.log(pointsList);
      console.log("============");
      var pointsList = _getDataList($obj, "mapName");
      console.log(pointsList);
      */
    }

    /**
     * private method
     */

    // _change
    function _change($obj, i){
      $obj.data("featureLayer").setFilter(function(p){
        return p.order <= i;
      });
      console.log("target: " + i);
    }

    // _getGeoJSONData
    function _getGeoJSONData($obj){
      var pointsList = _getDataList($obj, "dir", $.fn.dlm.options.mapName);
      var json = [];
      for(var i in pointsList){
        json.push(_getGeoJSONPoint($obj, pointsList[i], parseInt(i)));
      }
      
      $obj.data("pointsNum", json.length);
      console.log(json);
      return json;
    }

    // _showImgHandler
    function _showImgHandler(options, map, featureLayer){
      featureLayer.on("click",function(e){
        e.layer.closePopup();

        var info = document.getElementById(options.infoId);
        $(info).fadeOut();

        var feature = e.layer.feature;
        for(var i in feature.imgList){
          console.log(feature.imgList[i]);
        }

        // TODO: study parameters
        // http://www.tn3gallery.com/parameters/
        // then for each img, add to tn3 and display
        var $mytn3 = $(".info").tn3({
          skinDir:"skins",
          imageClick:"fullscreen",
          image:{
            maxZoom:1.5,
            crop:true,
            clickEvent:"dblclick",
            transitions:[{
              type:"blinds"
              },{
              type:"grid"
              },{
              type:"grid",
              duration:460,
              easing:"easeInQuad",
              gridX:1,
              gridY:8,
              // flat, diagonal, circle, random
              sort:"random",
              sortReverse:false,
              diagonalStart:"bl",
              // fade, scale
              method:"scale",
              partDuration:360,
              partEasing:"easeOutSine",
              partDirection:"left"
            }]
          },

          init_start:function(e) {
            e.source.data = [{
                title: "My Album",
                thumb: "./photo/1/2014-onepiece-22.9931668,120.1430514/ffhxlgjixt7tckss6d3l.jpg",
                imgs: [{
                    title: "Image One",
                    thumb: "./photo/1/2014-onepiece-22.9931668,120.1430514/ffhxlgjixt7tckss6d3l.jpg",
                    img: "./photo/1/2014-onepiece-22.9931668,120.1430514/ffhxlgjixt7tckss6d3l.jpg"
                }, {
                    title: "Image Two",
                    thumb: "./photo/1/2014-onepiece-22.9931668,120.1430514/3561953-6157147575-2013-.jpg",
                    img: "./photo/1/2014-onepiece-22.9931668,120.1430514/3561953-6157147575-2013-.jpg"
                }]
            }];
          }
        }).data("tn3");

        $(info).fadeIn("slow");
      });

      map.on("click", function(){
        var info = document.getElementById(options.infoId);
        $(info).fadeOut();
      });
    }

    function _getDataList($obj, want, where){
      if($.inArray(want, ["dir", "image", "mapName"]) <= -1){
        $.error("undefined \"want\": " + want + " in _getDataList.");
        return [];
      }
      var retData = [];
      var options = $.fn.dlm.options;

      for(var key in options.dirData){
        var addr = options.dirData[key].split("/");
        var lastName = addr[addr.length-1];

        // check first address
        if(key == 0){
          if(lastName != options.dir){
            alert("Your location of dirData is: " + lastName + "\nPlease modify it to: " + options.dir);
            return [];
          }
          else
            continue;
        }

        // find image filetype
        if(lastName.match(/\.(jpg|png|bmp|gif)/gi)){
          if(want == "image" && addr[addr.length-3] == options.mapName)
            _pushData(retData, addr, want, where);
        }
        else{
          if($.inArray(want, ["dir", "mapName"]) > -1)
            _pushData(retData, addr, want, where);
        }
      }
      return retData;
    }

    function _pushData(retData, addr, want, where){
      var lastName = addr[addr.length-1];
      if(want == "image")
        lastName = addr[addr.length-2] + "/" + lastName;
      if((want == "image" && addr[addr.length-2] == where) ||
          (want == "dir" && (addr[addr.length-2] == where || typeof where == "undefined")) ||
          (want == "mapName" && addr[addr.length-2] == $.fn.dlm.options.dir)
        )
        retData.push(lastName);
    }

    function _getGeoJSONPoint($obj, point, order){
      var imgList = _getDataList($obj, "image", point);
      var ptrArr = _splitLast(point, "-");
      var coor = _splitLast(ptrArr[1], ",");

      if(coor[0] == "" | coor[1] == ""){
        coor[0] = 22.9996873 + Math.random()/800;
        coor[1] = 120.2180947 + Math.random()/800;
      }

      var point = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [parseFloat(coor[1]), parseFloat(coor[0])]
        },
        "properties": {
          "title": ptrArr[0],
          "description": point,
          "marker-color": "#fc4353",
          "marker-size": "large",
          "marker-symbol": "monument"
        },
        "imgList": imgList,
        "order": order
      };

      return point;
    }

    function _splitLast(string, seperator){
      var ret = [];
      var a = string.split(seperator);

      head = "";
      for(var i = 0; i < a.length-1; i++){
        head = head.concat(a[i], seperator);
      }
      ret.push(head.substring(0, head.length-1));
      ret.push(a[a.length-1]);

      return ret;
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
    else if(typeof method === "object" || !method){
      return methods.init.apply(this, arguments);
    }
    else{
      $.error("Method " + method + " does not exist on jQuery.mapbox");
    }
  };
})(jQuery);

