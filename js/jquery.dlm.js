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
        "mapName": "0",
        "view": [22.9870689, 120.2735845],
        "zoom": 11,
        "dir": "photo",
        "dirData": [],
        "infoId": "#info",
        "listId": "#list"
      };

      // easy for end user, the order start with 1
      $obj.data("target", 1);
      $.fn.dlm.options = $.extend({}, _defaultOptions, options);

      console.log("token:" + $.fn.dlm.options.token);
      console.log("mapName: " + $.fn.dlm.options.mapName);
      console.log("mapboxId: " + $.fn.dlm.options.mapboxId);
      console.log("view: " + $.fn.dlm.options.view);
      console.log("zoom: " + $.fn.dlm.options.zoom);
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
      var max = $obj.data("pointsNum");
      var target = $obj.data("target");
      target = (++target > max) ? max : target;
      $obj.data("target", target);
      _change($obj, target);
    }

    function previous($obj){
      var min = 0;
      var target = $obj.data("target");
      target = (--target < min) ? min : target;
      $obj.data("target", target);
      _change($obj, target);
    }
    
    function listAll($obj) {
      var max = $obj.data("pointsNum") - 1;
      $obj.data("target", max);
      _change($obj, max);
    }

    function getMapName($obj){
      var mapNameList = _getDataList($obj, "mapName");
      $obj.data("mapNameList", mapNameList);
    }

    /**
     * private method
     */

    // _change
    function _change($obj, i){
      var rows = 10;
      var cols = 5;
      var listId = $.fn.dlm.options.listId;
      $(listId).text("");

      $obj.data("featureLayer").setFilter(function(p){
        // list marker
        if(p.order <= i){
          var title = p.order + ". " + p.properties["title"];
          $(listId).append(title + "\n");
          cols = (title.length-7 > cols) ? title.length-7 : cols;
        }

        // find target marker and panTo it
        if(p.order == i){
          var latlng = [p.geometry.coordinates[1], p.geometry.coordinates[0]];
          $obj.data("map").panTo(latlng);
          console.log("panTo: " + latlng);
        }

        return p.order <= i;
      });

      $(listId).attr("rows", rows);
      $(listId).attr("cols", cols);
      console.log("target: " + i);
    }

    // _getGeoJSONData
    function _getGeoJSONData($obj){
      var pointsList = _getDataList($obj, "dir", $.fn.dlm.options.mapName);
      console.log($.fn.dlm.options.mapName);
      var json = [];
      for(var i in pointsList){
        // easy for end user, the order start with 1
        var order = parseInt(i) + 1;
        json.push(_getGeoJSONPoint($obj, pointsList[i], order));
      }
      
      $obj.data("pointsNum", json.length);
      console.log(json);
      return json;
    }

    // _showImgHandler
    function _showImgHandler(options, map, featureLayer){
      // when click a marker
      featureLayer.on("click",function(e){
        e.layer.closePopup();
        $(options.infoId).fadeOut(250);

        setTimeout(function(){
          // find images of new point(marker)
          var imgs = [];
          var feature = e.layer.feature;
          for(var i in feature.imgList){
            imgSrc = "./" + options.dir + "/" + options.mapName + "/" + feature.imgList[i];
            imgs.push({
              title: _splitLast(feature.imgList[i].split("/")[0], "-")[0],
              description: feature.imgList[i].split("/")[1],
              thumb: imgSrc,
              img: imgSrc
            });
          }

          // build tn3
          var $mytn3 = $(options.infoId).tn3({
            skinDir: "skins",
            delay: 2000,
            image: {
              maxZoom: 1.5,
              crop: true,
              clickEvent: "click",
              transitions: [
                {
                  type: "blinds",
                },
                {
                  type: "grid"
                },
                {
                  type: "grid",
                  duration: 460,
                  easing: "easeInQuad",
                  gridX: 1,
                  gridY: 8,
                  // flat, diagonal, circle, random
                  sort: "random",
                  sortReverse: false,
                  diagonalStart: "bl",
                  // fade, scale
                  method: "scale",
                  partDuration: 360,
                  partEasing: "easeOutSine",
                  partDirection: "left"
                }
              ]
            },

            init_start: function(e) {
              e.source.data = [{
                imgs: imgs
              }];
            }
          }).data("tn3");

          $(options.infoId).fadeIn(500);
        }, 250);

      });

      // when touch other place
      map.on("click", function(){
        $(options.infoId).fadeOut();
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
          "marker-symbol": order
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

      listAll: function(){
        return this.each(function(){
          console.log("listAll function");
          listAll($(this));
        });
      },

      getMapName: function(){
        this.each(function(){
          console.log("getMapName function");
          getMapName($(this));
        });
        return $(this).data("mapNameList");
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

