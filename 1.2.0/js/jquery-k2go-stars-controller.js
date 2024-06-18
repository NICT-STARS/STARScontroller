;(function($){ $.k2goSTARScontroller = {
/******************************************************************************/
/* k2go STARScontroller                                                       */
/* version   : 1.2.0                                                          */
/* author    : Inoue Computer Service.                                        */
/* Copyright (c) k2go. All rights reserved.                                   */
/* See License.txt for the license information.                               */
/******************************************************************************/
/******************************************************************************/
/* k2goSTARScontroller.isAlive                                                */
/******************************************************************************/
isAlive : function(pApp)
{
  try
  {
    var objApp = $Env.apps[pApp];

    if (pApp == $Env.mainApp) return objApp.window;
    else                      return objApp.window && !objApp.window.closed;
  }
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] isAlive Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.isReady                                                */
/******************************************************************************/
isReady : function(pApp)
{
  try
  {
    var objApp = $Env.apps[pApp];
/*-----* himawari *-----------------------------------------------------------*/
    if (objApp.type == "himawari")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$Env
      &&     objApp.window.$
      &&     objApp.window.$.himawari8Image
      &&    !objApp.window.$("#lock_window").hasClass("show");
    }
/*-----* starsTouch *---------------------------------------------------------*/
    else if (objApp.type == "starsTouch")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$Env
      &&     objApp.window.$
      &&     objApp.window.$.nictSTARStouch
      &&     objApp.window.$(".nictSTARSPlotXSliderMessageBox").length <= 0;
    }
/*-----* cesium *-------------------------------------------------------------*/
    else if (objApp.type == "cesium")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$Env
      &&     objApp.window.$
      &&     objApp.window.$.nictCesium
      &&     objApp.window.$("#nict_cesium_message").length <= 0;
    }
/*-----* hpvt *---------------------------------------------------------------*/
    else if (objApp.type == "hpvt")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$Env
      &&     objApp.window.$
      &&     objApp.window.$.nictRaspberryPi
      &&    !objApp.window.$("#wait_message").hasClass("display");
    }
/*-----* harps *--------------------------------------------------------------*/
    else if (objApp.type == "harps")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$
      &&     objApp.window.$.harpsModel;
    }
/*-----* openDataGmapHouseholds *---------------------------------------------*/
    else if (objApp.type == "openDataGmapHouseholds")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$
      &&     objApp.window.map;
    }
/*-----* openDataGmapEnergy *-------------------------------------------------*/
    else if (objApp.type == "openDataGmapEnergy")
    {
      return objApp.window.document.readyState == "complete"
      &&     objApp.window.$
      &&     objApp.window.map;
    }
/*-----* other *--------------------------------------------------------------*/
    else
    {
      if (typeof objApp.window.STARScontroller_isReady == "function") return objApp.window.STARScontroller_isReady();
      else                                                            return false;
    }
  }
/*-----* error *--------------------------------------------------------------*/
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] isReady Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.getDateInfo                                            */
/******************************************************************************/
getDateInfo : function(pApp)
{
  try
  {
    var objApp    = $Env.apps[pApp];
    var objResult = { currentDate : 0, startDate : 0, endDate : 0, xScale : "" };

/*-----* himawari *-----------------------------------------------------------*/
    if (objApp.type == "himawari")
    {
      var objDate = new Date(objApp.window.$Env.showDate.getTime());

                                         objResult.currentDate = objDate.getTime();
      objDate.setHours( 0,  0,  0,   0); objResult.startDate   = objDate.getTime();
      objDate.setHours(23, 59, 59, 999); objResult.endDate     = objDate.getTime();

      return objResult;
    }
/*-----* hpvt *---------------------------------------------------------------*/
    else if (objApp.type == "hpvt")
    {
      var objDate = new Date(parseInt(objApp.window.$("#date").attr("date"), 10));

                                         objResult.currentDate = objDate.getTime();
      objDate.setHours( 0,  0,  0,   0); objResult.startDate   = objDate.getTime();
      objDate.setHours(23, 59, 59, 999); objResult.endDate     = objDate.getTime();

      return objResult;
    }
/*-----* cesium *-------------------------------------------------------------*/
    else if (objApp.type == "cesium")
    {
      var objDate = objApp.window.Cesium.JulianDate.toDate(objApp.window.$Env.cesium.viewer.clock.currentTime);

                                         objResult.currentDate = objDate.getTime();
      objDate.setHours( 0,  0,  0,   0); objResult.startDate   = objDate.getTime();
      objDate.setHours(23, 59, 59, 999); objResult.endDate     = objDate.getTime();

      return objResult;
    }
/*-----* harps *--------------------------------------------------------------*/
    else if (objApp.type == "harps")
    {
      var objDate = new Date(objApp.window.$.harpsModel.time.now.getTime());

                                         objResult.currentDate = objDate.getTime();
      objDate.setHours( 0,  0,  0,   0); objResult.startDate   = objDate.getTime();
      objDate.setHours(23, 59, 59, 999); objResult.endDate     = objDate.getTime();

      return objResult;
    }
/*-----* openDataGmapHouseholds *---------------------------------------------*/
    else if (objApp.type == "openDataGmapHouseholds")
    {
      var objDate      = new Date(objApp.dateInfo.currentDate);
      var intDayOfWeek = objDate.getDay();
      var intHour      = parseInt(objApp.window.$(".center").slick("slickCurrentSlide"), 10);

      if (objApp.window.$("#myday-switch").prop("checked"))
      {
             if (intDayOfWeek == 0) objDate.setDate(objDate.getDate() - 2);
        else if (intDayOfWeek == 6) objDate.setDate(objDate.getDate() - 1);
      }
      else
      {
        if (0 < intDayOfWeek && intDayOfWeek < 6) objDate.setDate(objDate.getDate() - intDayOfWeek);
      }

      objDate.setHours(intHour,  0,  0,   0); objResult.currentDate = objDate.getTime();
      objDate.setHours(      0,  0,  0,   0); objResult.startDate   = objDate.getTime();
      objDate.setHours(     23, 59, 59, 999); objResult.endDate     = objDate.getTime();

      return objResult;
    }
/*-----* openDataGmapEnergy *-------------------------------------------------*/
    else if (objApp.type == "openDataGmapEnergy")
    {
      var objDate = new Date(objApp.window.$("#selectdate").val  ());
      var intHour = parseInt(objApp.window.$(".center"    ).slick("slickCurrentSlide"), 10);

      objDate.setHours(intHour,  0,  0,   0); objResult.currentDate = objDate.getTime();
      objDate.setHours(      0,  0,  0,   0); objResult.startDate   = objDate.getTime();
      objDate.setHours(     23, 59, 59, 999); objResult.endDate     = objDate.getTime();

      return objResult;
    }
/*-----* starsTouch *---------------------------------------------------------*/
    else if (objApp.type == "starsTouch")
    {
      objResult.xScale      = objApp.window.$Env            .   showXScale;
      objResult.currentDate = objApp.window.$Env            .   showDate       .getTime();
      objResult.startDate   = objApp.window.$.nictSTARStouch.getShowDateLeft ().getTime();
      objResult.endDate     = objApp.window.$.nictSTARStouch.getShowDateRight().getTime();

      return objResult;
    }
/*-----* other *--------------------------------------------------------------*/
    else if (typeof objApp.window.STARScontroller_getDate == "function")
    {
      var objDateInfo = objApp.window.STARScontroller_getDate();

      objResult.currentDate = objDateInfo.currentDate.getTime();
      objResult.startDate   = objDateInfo.startDate  .getTime();
      objResult.endDate     = objDateInfo.endDate    .getTime();

      return objResult;
    }
    else
      return null;
  }
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] getDateInfo Error " + e.toString());
    return null;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.isChangeDateInfo                                       */
/******************************************************************************/
isChangeDateInfo : function(pApp, pActiveApp)
{
  try
  {
    var objApp       = $Env.apps[pApp];
    var objActiveApp = $Env.apps[pActiveApp];

         if (objActiveApp.dateInfo == null) return false;
    else if (objApp      .dateInfo == null) return true;
    else                                    return objActiveApp.dateInfo.currentDate != objApp.dateInfo.currentDate
                                            ||     objActiveApp.dateInfo.startDate   != objApp.dateInfo.startDate
                                            ||     objActiveApp.dateInfo.endDate     != objApp.dateInfo.endDate
                                            ||     objActiveApp.dateInfo.xScale      != objApp.dateInfo.xScale;
  }
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] isChangeDateInfo Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.setDateInfo                                            */
/******************************************************************************/
setDateInfo : function(pApp, pActiveApp)
{
  try
  {
    var objApp       = $Env.apps[pApp];
    var objActiveApp = $Env.apps[pActiveApp];
/*-----* starsTouch *---------------------------------------------------------*/
    if (objApp.type == "starsTouch")
    {
      var objAppDate = new Date($.k2goSTARScontroller.getDateInfo(pApp).currentDate);
      var objSynDate = new Date(objApp.dateInfo.currentDate - (objActiveApp.type.search(/cesium|hpvt|harps|openDataGmap/) > -1 ? 1000 * 60 * 60 * 9 : 0));

      if (objAppDate.getTime() != objSynDate.getTime())
      {
        objApp.window.$.nictSTARStouch.getDateTimePickerOption().onClose(objApp.window.$.nictSTARStouch.formatDate(objSynDate, null, "%Sy/%Sm/%Sd %SH:%SM:%SS", objApp.window.$.nictSTARStouch.getTimeZone(objApp.window.$Env.showTimeZone)));
      }

      if (objApp.window.$Env.showXScale != objApp.dateInfo.xScale && objApp.window.$Env.xScale.indexOf(objApp.dateInfo.xScale) > -1)
      {
        objApp.window.$("#plot_table").trigger("zoom.nictSTARSPlotXSlider", objApp.window.$Env.xScale.indexOf(objApp.dateInfo.xScale), "slider");
      }
    }
/*-----* himawari *-----------------------------------------------------------*/
    else if (objApp.type == "himawari")
    {
      var objAppDate = new Date($.k2goSTARScontroller.getDateInfo(pApp).currentDate);
      var objSynDate = new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0));

      if (objAppDate.getTime() != objSynDate.getTime())
      {
        objApp.window.$.himawari8Image.createTimeline(objSynDate);
      }
    }
/*-----* cesium *-------------------------------------------------------------*/
    else if (objApp.type == "cesium")
    {
      var objAppDate = new Date($.k2goSTARScontroller.getDateInfo(pApp).currentDate);
      var objSynDate = new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0));

      if (objAppDate.getFullYear() != objSynDate.getFullYear()
      ||  objAppDate.getMonth   () != objSynDate.getMonth   ()
      ||  objAppDate.getDate    () != objSynDate.getDate    ())
      {
        var aryEvents = $.k2goSTARScontroller.getEvents("click", objApp.window.$, "#nict_cesium_time_button", "#nict_cesium_time_bottom_button");

        objApp.window.$Env.cesium.selectTimes = [new Date(objSynDate.getTime())];
        objApp.window.$("#nict_cesium_time_button"         ).off    ("click"  , "#nict_cesium_time_bottom_button");
        objApp.window.$("#nict_cesium_date_calendar_button").trigger("click");
        objApp.window.$("#nict_cesium_calendar > table"    ).css    ("display", "none");
        objApp.window.$("#nict_cesium_calendar   .ok"      ).trigger("click");

        setTimeout(function _sleep()
        {
          if (objApp.window.$("#nict_cesium_message").length > 0)
          {
            setTimeout(_sleep, 100);
          }
          else
          {
            objApp.window.$Env.cesium.viewer.animation.viewModel.clockViewModel.currentTime = objApp.window.Cesium.JulianDate.fromDate(objSynDate);
            $.k2goSTARScontroller.setEvents("click", aryEvents, objApp.window.$, "#nict_cesium_time_button", "#nict_cesium_time_bottom_button");
          }
        }, 100);
      }
      else
        objApp.window.$Env.cesium.viewer.animation.viewModel.clockViewModel.currentTime = objApp.window.Cesium.JulianDate.fromDate(objSynDate);
    }
/*-----* hpvt *---------------------------------------------------------------*/
    else if (objApp.type == "hpvt")
    {
      var objSynDate = new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0));
      var $li        = objApp.window.$.nictRaspberryPi.searchNearItem(objApp.window.$("#image_list .group li[date]"), objSynDate);

      if ($li)
      {
        var objAppDate = new Date(parseInt($li.attr("date"), 10));

        if (objApp.window.$("#tab .one_day_video").hasClass("select"))
        {
          if (objAppDate.getFullYear() != objSynDate.getFullYear()
          ||  objAppDate.getMonth   () != objSynDate.getMonth   ()
          ||  objAppDate.getDate    () != objSynDate.getDate    ())
          {
            $li = objApp.window.$.nictRaspberryPi.searchNearItem(objApp.window.$("#image_list > li[date]"), objSynDate, "day_list");
          }
        }
        else
        {
          if (objAppDate.getFullYear() != objSynDate.getFullYear()
          ||  objAppDate.getMonth   () != objSynDate.getMonth   ()
          ||  objAppDate.getDate    () != objSynDate.getDate    ()
          ||  objAppDate.getHours   () != objSynDate.getHours   ())
          {
            $li = objApp.window.$.nictRaspberryPi.searchNearItem(objApp.window.$("#image_list > li[date]"), objSynDate, "hour_list");
          }
        }
      }

      if ($li)
      {
        $li.find(".date").trigger("click");
      }
       else
      {
        objApp.window.$("#date").attr("date", objSynDate.getTime());
        objApp.window.$("#tab .select" ).removeClass("select").trigger("click");
      }
    }
/*-----* harps *--------------------------------------------------------------*/
    else if (objApp.type == "harps")
    {
      var objDate = new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0));

      objApp.window.$.harpsModel.time.setDatestr(objDate);

      objApp.window.$("#date_now"                             ).trigger("update");
      objApp.window.$("#time_controller .time_rail .time_knob").trigger("update");
      objApp.window.$("#time_slider"                          ).trigger("update");
      objApp.window.$("header .date input"                    ).css    ({visibility : ""});

      objApp.window.$.harpsModel.overlayMaps.updateImg  ();
      objApp.window.$.harpsModel.tiles      .updateOther();

      setTimeout(function(){ objApp.window.$(window).scrollTop(0); }, 500);
    }
/*-----* openDataGmapHouseholds *---------------------------------------------*/
    else if (objApp.type == "openDataGmapHouseholds")
    {
      var objDate      = new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0));
      var intDayOfWeek = objDate.getDay  ();
      var intHour      = objDate.getHours();

      if (0 < intDayOfWeek && intDayOfWeek < 6) objApp.window.$("#myday-switch").prop("checked", true ).trigger("change");
      else                                      objApp.window.$("#myday-switch").prop("checked", false).trigger("change");

      objApp.window.$(".center").slick("slickGoTo", intHour);
    }
/*-----* openDataGmapEnergy *-------------------------------------------------*/
    else if (objApp.type == "openDataGmapEnergy")
    {
      var objDate = new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0));
      var intHour = objDate.getHours();

      objApp.window.$("#selectdate").val  ($.k2goSTARScontroller.formatDate(objDate, "%y-%mm-%dd"));
      objApp.window.$(".center"    ).slick("slickGoTo", intHour);
    }
/*-----* other *--------------------------------------------------------------*/
    else if (typeof objApp.window.STARScontroller_setDate == "function")
    {
      var objDataInfo =
      {
        currentDate : new Date(objApp.dateInfo.currentDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0)),
        startDate   : new Date(objApp.dateInfo.  startDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0)),
        endDate     : new Date(objApp.dateInfo.    endDate + (objActiveApp.type.search(/starsTouch/) > -1 ? 1000 * 60 * 60 * 9 : 0))
      };

      objApp.window.STARScontroller_setDate(objDataInfo);
    }
  }
/*-----* error *--------------------------------------------------------------*/
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] setDateInfo Error " + e.toString());
  }
},
/******************************************************************************/
/* k2goSTARScontroller.getPosition                                            */
/******************************************************************************/
getPosition : function(pApp)
{
  try
  {
    var objApp    = $Env.apps[pApp];
    var objResult = { center : { lat : 0, lng : 0 }, north : 0, east : 0, south : 0, west : 0, zoom : 0, direction : 0 };
/*-----* GoogleMap *----------------------------------------------------------*/
    function _getPositionGoogleMap(pMap)
    {
      var objCenter = pMap.getCenter();
      var objBounds = pMap.getBounds();
      var intZoom   = pMap.getZoom  ();

      if (objCenter && objBounds)
      {
        var objSouthWest = objBounds.getSouthWest();
        var objNorthEast = objBounds.getNorthEast();

        objResult.center.lat = objCenter   .lat();
        objResult.center.lng = objCenter   .lng();
        objResult.north      = objNorthEast.lat();
        objResult.east       = objNorthEast.lng();
        objResult.south      = objSouthWest.lat();
        objResult.west       = objSouthWest.lng();
        objResult.zoom       = intZoom;

        return objResult;
      }
      else
        return null;
    }
/*-----* harps *--------------------------------------------------------------*/
    if (objApp.type == "harps")
    {
      return _getPositionGoogleMap(objApp.window.$.harpsModel.map);
    }
/*-----* openDataGmapHouseholds *---------------------------------------------*/
    else if (objApp.type == "openDataGmapHouseholds")
    {
      return _getPositionGoogleMap(objApp.window.map);
    }
/*-----* openDataGmapEnergy *-------------------------------------------------*/
    else if (objApp.type == "openDataGmapEnergy")
    {
      return _getPositionGoogleMap(objApp.window.map);
    }
/*-----* cesium *-------------------------------------------------------------*/
    else if (objApp.type == "cesium")
    {
      var objPosition  = objApp.window.$Env.cesium.viewer.camera.positionCartographic;
      var objRectangle = objApp.window.$Env.cesium.viewer.camera.computeViewRectangle();
      var intDirection = objApp.window.$Env.cesium.viewer.camera.heading;

      if (objPosition && objRectangle)
      {
        objResult.center.lat = objPosition .latitude  * (180 / Math.PI);
        objResult.center.lng = objPosition .longitude * (180 / Math.PI);
        objResult.north      = objRectangle.north     * (180 / Math.PI);
        objResult.east       = objRectangle.east      * (180 / Math.PI);
        objResult.south      = objRectangle.south     * (180 / Math.PI);
        objResult.west       = objRectangle.west      * (180 / Math.PI);
        objResult.direction  = intDirection           * (180 / Math.PI);

        if (typeof objResult.center.lat != "number" || isNaN(objResult.center.lat)
        ||  typeof objResult.center.lng != "number" || isNaN(objResult.center.lng)
        ||  typeof objResult.north      != "number" || isNaN(objResult.north     ) || objResult.north ==   90
        ||  typeof objResult.east       != "number" || isNaN(objResult.east      ) || objResult.east  ==  180
        ||  typeof objResult.south      != "number" || isNaN(objResult.south     ) || objResult.south ==  -90
        ||  typeof objResult.west       != "number" || isNaN(objResult.west      ) || objResult.west  == -180
        ||  typeof objResult.direction  != "number" || isNaN(objResult.direction ))
        {
          return null;
        }

             if (objPosition.height > 1400000) objResult.zoom =  5;
        else if (objPosition.height >  600000) objResult.zoom =  6;
        else if (objPosition.height >  300000) objResult.zoom =  7;
        else if (objPosition.height >  160000) objResult.zoom =  8;
        else if (objPosition.height >   80000) objResult.zoom =  9;
        else if (objPosition.height >   40000) objResult.zoom = 10;
        else if (objPosition.height >   20000) objResult.zoom = 11;
        else if (objPosition.height >   10000) objResult.zoom = 12;
        else if (objPosition.height >    5000) objResult.zoom = 13;
        else                                   objResult.zoom = 14;

        return objResult;
      }
      else
        return null;
    }
/*-----* himawari *--------------------------------------------------------*/
    else if (objApp.type == "himawari")
    {
      objApp.window.$(objApp.window).trigger("unload");

      var objCenterInfo  = objApp.window.$("#view_area").k2goTileViewer("getCenterInfo");
      var objBountdsInfo = objApp.window.$("#view_area").k2goTileViewer("getBoundsInfo");
      var objEnv         = objApp.window.$Env;
      var intScale       = objEnv.image[objEnv.showImage].centerInfo.scale;

      objResult.center.lat = objCenterInfo             .degrees.top;
      objResult.center.lng = objCenterInfo             .degrees.left;
      objResult.north      = objBountdsInfo.leftTop    .degrees.top;
      objResult.west       = objBountdsInfo.leftTop    .degrees.left;
      objResult.south      = objBountdsInfo.rightBottom.degrees.top;
      objResult.east       = objBountdsInfo.rightBottom.degrees.left;

      if (typeof objResult.center.lat != "number" || isNaN(objResult.center.lat)
      ||  typeof objResult.center.lng != "number" || isNaN(objResult.center.lng)
      ||  typeof objResult.north      != "number" || isNaN(objResult.north)
      ||  typeof objResult.west       != "number" || isNaN(objResult.west)
      ||  typeof objResult.south      != "number" || isNaN(objResult.south)
      ||  typeof objResult.east       != "number" || isNaN(objResult.east))
      {
        return null;
      }

      if (objEnv.showImage == "D531107")
      {
             if (intScale <=  3) objResult.zoom = 5;
        else if (intScale <=  5) objResult.zoom = 6;
        else if (intScale <=  7) objResult.zoom = 7;
        else if (intScale <=  8) objResult.zoom = 8;
        else                     objResult.zoom = 9;
      }
      else if (objEnv.showImage == "D531106")
      {
             if (intScale <=  7) objResult.zoom = 5;
        else if (intScale <=  9) objResult.zoom = 6;
        else                     objResult.zoom = 7;
      }
      else if (objEnv.showImage == "FULL_24h")
      {
             if (intScale <=  7) objResult.zoom = 5;
        else                     objResult.zoom = 6;
      }
      else
        return null;

      return objResult;
    }
/*-----* other *--------------------------------------------------------------*/
    else if (typeof objApp.window.STARScontroller_getPosition == "function")
    {
      var objPosition = objApp.window.STARScontroller_getPosition();

      if ("center"    in objPosition && "lat" in objPosition.center) objResult.center.lat = objPosition.center.lat;
      if ("center"    in objPosition && "lng" in objPosition.center) objResult.center.lng = objPosition.center.lng;
      if ("north"     in objPosition                               ) objResult.north      = objPosition.north;
      if ("east"      in objPosition                               ) objResult.east       = objPosition.east;
      if ("south"     in objPosition                               ) objResult.south      = objPosition.south;
      if ("west"      in objPosition                               ) objResult.west       = objPosition.west;
      if ("zoom"      in objPosition                               ) objResult.zoom       = objPosition.zoom;
      if ("direction" in objPosition                               ) objResult.direction  = objPosition.direction;
      if ("pitch"     in objPosition                               ) objResult.pitch      = objPosition.pitch;

      return objResult;
    }
    else
      return null;
  }
/*-----* error *--------------------------------------------------------------*/
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] getPosition Error " + e.toString());
    return null;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.isChangePosition                                       */
/******************************************************************************/
isChangePosition : function(pApp, pActiveApp)
{
  try
  {
    var objApp       = $Env.apps[pApp];
    var objActiveApp = $Env.apps[pActiveApp];

         if (objActiveApp.position == null) return false;
    else if (objApp      .position == null) return true;
    else                                    return objActiveApp.position.center.lat != objApp.position.center.lat
                                            ||     objActiveApp.position.center.lng != objApp.position.center.lng
                                            ||     objActiveApp.position.north      != objApp.position.north
                                            ||     objActiveApp.position.east       != objApp.position.east
                                            ||     objActiveApp.position.south      != objApp.position.south
                                            ||     objActiveApp.position.west       != objApp.position.west
                                            ||     objActiveApp.position.zoom       != objApp.position.zoom
                                            ||     objActiveApp.position.direction  != objApp.position.direction
                                            ||     objActiveApp.position.pitch      != objApp.position.pitch;
  }
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] isChangePosition Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.setPosition                                            */
/******************************************************************************/
setPosition : function(pApp)
{
  try
  {
    var objApp = $Env.apps[pApp];
/*-----* GoogleMap *----------------------------------------------------------*/
    function _setPositionGoogleMap(pMap)
    {
      pMap.setCenter({ lat : objApp.position.center.lat, lng : objApp.position.center.lng });
      pMap.setZoom  (objApp.position.zoom);
    }
/*-----* harps *--------------------------------------------------------------*/
    if (objApp.type == "harps")
    {
      _setPositionGoogleMap(objApp.window.$.harpsModel.map);
    }
/*-----* openDataGmapHouseholds *---------------------------------------------*/
    else if (objApp.type == "openDataGmapHouseholds")
    {
      _setPositionGoogleMap(objApp.window.map);
    }
/*-----* openDataGmapEnergy *-------------------------------------------------*/
    else if (objApp.type == "openDataGmapEnergy")
    {
      _setPositionGoogleMap(objApp.window.map);
    }
/*-----* cesium *-------------------------------------------------------------*/
    else if (objApp.type == "cesium")
    {
      var objRectangle = {};
      var objEnv       = objApp.window.$Env;
      var objCesium    = objApp.window.Cesium;
      var intHeading   = 0;
      var intHeight    = 0;

      objRectangle.north = objApp.position.north     * (Math.PI / 180);
      objRectangle.east  = objApp.position.east      * (Math.PI / 180);
      objRectangle.south = objApp.position.south     * (Math.PI / 180);
      objRectangle.west  = objApp.position.west      * (Math.PI / 180);
      intHeading         = objApp.position.direction * (Math.PI / 180);

           if (objApp.position.zoom <=  5) intHeight = 2200000;
      else if (objApp.position.zoom <=  6) intHeight = 1400000;
      else if (objApp.position.zoom <=  7) intHeight =  600000;
      else if (objApp.position.zoom <=  8) intHeight =  300000;
      else if (objApp.position.zoom <=  9) intHeight =  160000;
      else if (objApp.position.zoom <= 10) intHeight =   80000;
      else if (objApp.position.zoom <= 11) intHeight =   40000;
      else if (objApp.position.zoom <= 12) intHeight =   20000;
      else if (objApp.position.zoom <= 13) intHeight =   10000;
      else                                 intHeight =    5000;

      objEnv.cesium.viewer.camera.flyToBoundingSphere(objCesium.BoundingSphere.fromRectangle3D(new objCesium.Rectangle(objRectangle.west, objRectangle.south, objRectangle.east, objRectangle.north)),
      {
        offset   : new objCesium.HeadingPitchRange(intHeading, objEnv.cesium.camera.position.pitch, intHeight),
        duration : 1,
        complete : function() { objEnv.cesium.camera.position.height = intHeight; },
        cancel   : function() { objEnv.cesium.camera.position.height = intHeight; }
      });
    }
/*-----* himawari *-----------------------------------------------------------*/
    else if (objApp.type == "himawari")
    {
      var objEnv   = objApp.window.$Env;
      var intScale;

      if (objEnv.showImage == "D531107")
      {
             if (objApp.position.zoom <= 3) intScale =  0;
        else if (objApp.position.zoom <= 4) intScale =  1;
        else if (objApp.position.zoom <= 5) intScale =  3;
        else if (objApp.position.zoom <= 6) intScale =  5;
        else if (objApp.position.zoom <= 7) intScale =  7;
        else if (objApp.position.zoom <= 8) intScale =  8;
        else                                intScale = 10;
      }
      else if (objEnv.showImage == "D531106")
      {
             if (objApp.position.zoom <= 1) intScale =  0;
        else if (objApp.position.zoom <= 2) intScale =  1;
        else if (objApp.position.zoom <= 3) intScale =  3;
        else if (objApp.position.zoom <= 4) intScale =  5;
        else if (objApp.position.zoom <= 5) intScale =  7;
        else if (objApp.position.zoom <= 6) intScale =  9;
        else                                intScale = 11;
      }
      else if (objEnv.showImage == "FULL_24h")
      {
             if (objApp.position.zoom <= 1) intScale = 0;
        else if (objApp.position.zoom <= 2) intScale = 1;
        else if (objApp.position.zoom <= 3) intScale = 3;
        else if (objApp.position.zoom <= 4) intScale = 5;
        else if (objApp.position.zoom <= 5) intScale = 7;
        else                                intScale = 9;
      }

      objApp.window.$("#view_area").k2goTileViewer("move", { degrees : { left : objApp.position.center.lng, top : objApp.position.center.lat } }, 300, function()
      {
        objApp.window.$(objApp.window).trigger("unload");

        setTimeout(function _sleep()
        {
          if (typeof objEnv.image[objEnv.showImage].centerInfo == "object" && objEnv.image[objEnv.showImage].centerInfo != null)
          {
            if (objEnv.image[objEnv.showImage].centerInfo.scale != intScale)
            {
              if (!objApp.window.$("#lock_window").hasClass("show"))
              {
                objApp.window.$("#view_area").k2goTileViewer("setOptions", { zoomStart : function() { objApp.window.$("#lock_window").addClass("show"); } });
                objApp.window.$("#view_area").k2goTileViewer("zoom"      , intScale - objEnv.image[objEnv.showImage].centerInfo.scale                      );
              }
              else
                setTimeout(_sleep, 100);
            }
          }
          else
          {
            objApp.window.$(objApp.window).trigger("unload");
            setTimeout(_sleep, 100);
          }
        }, 1);
      });
    }
/*-----* other *--------------------------------------------------------------*/
    else if (typeof objApp.window.STARScontroller_setPosition == "function")
    {
      objApp.window.STARScontroller_setPosition(Object.assign({}, objApp.position));
    }
  }
/*-----* error *--------------------------------------------------------------*/
  catch(e)
  {
    $.k2goSTARScontroller.putLog("[STARScontroller] setPosition Error " + e.toString());
  }
},
/******************************************************************************/
/* k2goSTARScontroller.getEvents                                              */
/******************************************************************************/
getEvents : function(pType, pJQuery, pElement, pSelector)
{
  var objEvents = pJQuery._data(pJQuery(pElement).get(0), "events");

  for (var strKey in objEvents)
  {
    if (strKey == pType)
    {
      if (typeof pSelector == "string") return $.grep(objEvents[strKey], function(pObject, pIndex) { return (pObject.selector == pSelector); });
      else                              return        objEvents[strKey].slice();
    }
  }

  return [];
},
/******************************************************************************/
/* k2goSTARScontroller.setEvents                                              */
/******************************************************************************/
setEvents : function(pType, pEvents, pJQuery, pElement, pSelector)
{
  setTimeout(function()
  {
    pEvents.forEach(function(pEvent)
    {
      if (typeof pSelector == "string") pJQuery(pElement).on(pType, pSelector, pEvent);
      else                              pJQuery(pElement).on(pType,            pEvent);
    });
  }, 5000);
},
/******************************************************************************/
/* k2goSTARScontroller.formatDate                                             */
/******************************************************************************/
formatDate : function(pDate, pFormatString, pTimeZone)
{
  var objDate   = new Date(pDate.getTime());
  var strResult = pFormatString;

  if (typeof pTimeZone == "string")
  {
    if (pTimeZone.indexOf("+") != -1) objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", " " + pTimeZone.replace("+", "-")));
    else                              objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", " " + pTimeZone.replace("-", "+")));
  }

  strResult = strResult.replace(/%y/g ,          objDate.getFullYear    ()      .toString(  ));
  strResult = strResult.replace(/%mm/g, ("0"  + (objDate.getMonth       () + 1)).slice   (-2));
  strResult = strResult.replace(/%m/g ,         (objDate.getMonth       () + 1) .toString(  ));
  strResult = strResult.replace(/%dd/g, ("0"  + (objDate.getDate        ()    )).slice   (-2));
  strResult = strResult.replace(/%d/g ,          objDate.getDate        ()      .toString(  ));
  strResult = strResult.replace(/%H/g , ("0"  +  objDate.getHours       ()     ).slice   (-2));
  strResult = strResult.replace(/%M/g , ("0"  +  objDate.getMinutes     ()     ).slice   (-2));
  strResult = strResult.replace(/%S/g , ("0"  +  objDate.getSeconds     ()     ).slice   (-2));
  strResult = strResult.replace(/%N/g , ("00" +  objDate.getMilliseconds()     ).slice   (-3));

  return strResult;
},
/******************************************************************************/
/* k2goSTARScontroller.putLog                                                 */
/******************************************************************************/
putLog : function(pMessage)
{
  if ($Env.showLogConsole) console.log($.k2goSTARScontroller.formatDate(new Date(), "%y/%mm/%dd %H:%M:%S.%N") + " " + pMessage);
}
};})(jQuery);
