$(function() {
/******************************************************************************/
/* k2go STARScontroller                                                       */
/* version   : 1.2.0                                                          */
/* author    : Inoue Computer Service.                                        */
/* Copyright (c) k2go. All rights reserved.                                   */
/* See License.txt for the license information.                               */
/******************************************************************************/
/******************************************************************************/
/* mainWindow.load                                                            */
/******************************************************************************/
$("#mainWindow").on("load", function()
{
/*-----* get user window position *-------------------------------------------*/
  if (typeof localStorage != "undefined")
  {
    var objLocalStorage = JSON.parse(localStorage.getItem(location.pathname));

    if (objLocalStorage && objLocalStorage.version && objLocalStorage.version == $Env.version)
    {
      for (var strApp in $Env.apps)
      {
        if (objLocalStorage.apps[strApp] && objLocalStorage.apps[strApp].windowLayout)
        {
          if (typeof objLocalStorage.apps[strApp].windowLayout.left   == "number") $Env.apps[strApp].windowLayout.left   = objLocalStorage.apps[strApp].windowLayout.left;
          if (typeof objLocalStorage.apps[strApp].windowLayout.top    == "number") $Env.apps[strApp].windowLayout.top    = objLocalStorage.apps[strApp].windowLayout.top;
          if (typeof objLocalStorage.apps[strApp].windowLayout.width  == "number") $Env.apps[strApp].windowLayout.width  = objLocalStorage.apps[strApp].windowLayout.width;
          if (typeof objLocalStorage.apps[strApp].windowLayout.height == "number") $Env.apps[strApp].windowLayout.height = objLocalStorage.apps[strApp].windowLayout.height;
        }
      }
    }
  }
/*-----* open window *--------------------------------------------------------*/
  for (var strApp in $Env.apps)
  {
    $Env.apps[strApp].dateInfo = null;
    $Env.apps[strApp].position = null;

    if (strApp == $Env.mainApp) continue;

    var objLayout =
    {
      left   : screen.width  * $Env.apps[strApp].windowLayout.left,
      top    : screen.height * $Env.apps[strApp].windowLayout.top,
      width  : screen.width  * $Env.apps[strApp].windowLayout.width,
      height : screen.height * $Env.apps[strApp].windowLayout.height
    };

    $Env.apps[strApp].window = window.open($Env.apps[strApp].url, strApp, $Env.apps[strApp].windowFeatures + ",left=" + objLayout.left + ",top=" + objLayout.top + ",width=" + objLayout.width + ",height=" + objLayout.height);

    $($Env.apps[strApp].window).on("unload", function()
    {
      for (var strApp in $Env.apps)
      {
        if ($Env.apps[strApp].window == this)
        {
          $Env.apps[strApp].windowLayout.left   = this.screenX     / screen.width;
          $Env.apps[strApp].windowLayout.top    = this.screenY     / screen.height;
          $Env.apps[strApp].windowLayout.width  = this.innerWidth  / screen.width;
          $Env.apps[strApp].windowLayout.height = this.innerHeight / screen.height;
          break;
        }
      }
    });
  }
/*-----* wait open window *---------------------------------------------------*/
  setTimeout(function _sleep1()
  {
    var flgStatus = true;

    $.k2goSTARScontroller.putLog("[STARScontroller] wait open window...");

    for (var strApp in $Env.apps)
    {
      if (strApp == $Env.mainApp                ) continue;
      if (!$.k2goSTARScontroller.isAlive(strApp)) continue;
      if (!$.k2goSTARScontroller.isReady(strApp)) { flgStatus = false; break; }
    }
/*-----* wait for default active window info *--------------------------------*/
    if (flgStatus)
    {
      setTimeout(function _sleep2()
      {
        var strActiveApp = $Env.activeApp;
        var flgStatus    = false;

        $.k2goSTARScontroller.putLog("[STARScontroller] wait for default active window (" + strActiveApp + ") getting info...");

        if (!$.k2goSTARScontroller.isAlive(strActiveApp)) return;
        if ( $.k2goSTARScontroller.isReady(strActiveApp))
        {
          if ($Env.apps[strActiveApp].dateInfo == null) $Env.apps[strActiveApp].dateInfo = $.k2goSTARScontroller.getDateInfo(strActiveApp);
        }
        else
        {
          setTimeout(_sleep2, 1000);
          return;
        }

        if (!$.k2goSTARScontroller.isAlive(strActiveApp)) return;
        if ( $.k2goSTARScontroller.isReady(strActiveApp))
        {
          if ($Env.apps[strActiveApp].position == null) $Env.apps[strActiveApp].position = $.k2goSTARScontroller.getPosition(strActiveApp);
        }
        else
        {
          setTimeout(_sleep2, 1000);
          return;
        }
/*-----* wait for first sync *------------------------------------------------*/
        if ($Env.apps[strActiveApp].type == "starsTouch" || $Env.apps[strActiveApp].type == "hpvt")
        {
          flgStatus = $Env.apps[strActiveApp].dateInfo != null;
        }
        else if ($Env.apps[strActiveApp].type == "himawari" || $Env.apps[strActiveApp].type == "cesium" || $Env.apps[strActiveApp].type == "harps" || $Env.apps[strActiveApp].type == "openDataGmapHouseholds" || $Env.apps[strActiveApp].type == "openDataGmapEnergy")
        {
          flgStatus = $Env.apps[strActiveApp].dateInfo != null && $Env.apps[strActiveApp].position != null;
        }
        else
        {
               if (typeof $Env.apps[strActiveApp].window.STARScontroller_getDate == "function" && typeof $Env.apps[strActiveApp].window.STARScontroller_getPosition == "function") flgStatus = $Env.apps[strActiveApp].dateInfo != null && $Env.apps[strActiveApp].position != null;
          else if (typeof $Env.apps[strActiveApp].window.STARScontroller_getDate == "function"                                                                                   ) flgStatus = $Env.apps[strActiveApp].dateInfo != null;
          else if (                                                                               typeof $Env.apps[strActiveApp].window.STARScontroller_getPosition == "function") flgStatus =                                             $Env.apps[strActiveApp].position != null;
        }

        if (flgStatus)
        {
          function _sync(pApp, pActiveApp)
          {
            $.k2goSTARScontroller.putLog("[STARScontroller] wait for first sync " + pApp + "...");

            if (!$.k2goSTARScontroller.isAlive(pApp)) return;

            if ($.k2goSTARScontroller.isReady(pApp))
            {
              if ($.k2goSTARScontroller.isChangeDateInfo(pApp, pActiveApp))
              {
                $Env.apps[pApp].dateInfo = Object.assign({}, $Env.apps[pActiveApp].dateInfo);
                $.k2goSTARScontroller.setDateInfo(pApp, pActiveApp);
              }
            }
            else
            {
              setTimeout(function() { _sync(pApp, pActiveApp); }, 1000);
              return;
            }

            if (!$.k2goSTARScontroller.isAlive(pApp)) return;

            if ($.k2goSTARScontroller.isReady(pApp))
            {
              if ($.k2goSTARScontroller.isChangePosition(pApp, pActiveApp))
              {
                $Env.apps[pApp].position = Object.assign({}, $Env.apps[pActiveApp].position);
                $.k2goSTARScontroller.setPosition(pApp);
              }
            }
            else
              setTimeout(function() { _sync(pApp, pActiveApp); }, 1000);
          }

          for (var strApp in $Env.apps)
          {
            if (strApp != strActiveApp && $Env.apps[strApp].type != "dummy") _sync(strApp, strActiveApp);
          }
/*-----* start sync *---------------------------------------------------------*/
          setTimeout(function _sleep3()
          {
            var strActiveApp = $Env.activeApp;
            var flgStatus    = true;

            for (var strApp in $Env.apps)
            {
              if (strApp                 == strActiveApp                       ) continue;
              if ($Env.apps[strApp].type == "dummy"                            ) continue;
              if (!$.k2goSTARScontroller.isAlive         (strApp              )) continue;
              if (!$.k2goSTARScontroller.isReady         (strApp              )) { flgStatus = false; break; }
              if ( $.k2goSTARScontroller.isChangeDateInfo(strApp, strActiveApp)) { flgStatus = false; break; }
              if ( $.k2goSTARScontroller.isChangePosition(strApp, strActiveApp)) { flgStatus = false; break; }
            }

            if (flgStatus)
            {
              for (var strApp in $Env.apps)
              {
                if ($Env.apps[strApp].type != "dummy")
                {
                  $.k2goSTARScontroller.putLog("[STARScontroller] " + strApp + " start sync");
                  $Env.apps[strApp].window.$("title").text("[STARScontroller] " + $Env.apps[strApp].window.$("title").text());
                  syncApp(strApp);
                }
              }
            }
            else
              setTimeout(_sleep3, 1000);
          }, 1);
        }
        else
          setTimeout(_sleep2, 1000);
      }, 1);
    }
    else
      setTimeout(_sleep1, 1000);
  }, 1);
});

$Env.apps[$Env.mainApp].window = $("#mainWindow").attr("src", $Env.apps[$Env.mainApp].url).get(0).contentWindow;
/******************************************************************************/
/* syncApp                                                                    */
/******************************************************************************/
function syncApp(pApp)
{
/*-----* active window *------------------------------------------------------*/
  if (!$.k2goSTARScontroller.isAlive(pApp)) return;

  if ((                window.document.hasFocus() && pApp == $Env.mainApp)
  ||  ($Env.apps[pApp].window.document.hasFocus()))
  {
    if ( $.k2goSTARScontroller.isReady(pApp)) $Env.apps[pApp].dateInfo = $.k2goSTARScontroller.getDateInfo(pApp);
    if (!$.k2goSTARScontroller.isAlive(pApp)) return;
    if ( $.k2goSTARScontroller.isReady(pApp)) $Env.apps[pApp].position = $.k2goSTARScontroller.getPosition(pApp);

    $Env.activeApp = pApp;
  }
/*-----* sync date *----------------------------------------------------------*/
  else
  {
    var strActiveApp = $Env.activeApp;

    if ($.k2goSTARScontroller.isReady(pApp))
    {
      if ($.k2goSTARScontroller.isChangeDateInfo(pApp, strActiveApp))
      {
        $.k2goSTARScontroller.putLog("[STARScontroller] change time " + pApp + $.k2goSTARScontroller.formatDate(new Date($Env.apps[strActiveApp].dateInfo.currentDate), " {current:%y/%mm/%dd %H:%M:%S,") + $.k2goSTARScontroller.formatDate(new Date($Env.apps[strActiveApp].dateInfo.startDate), " start:%y/%mm/%dd %H:%M:%S,") + $.k2goSTARScontroller.formatDate(new Date($Env.apps[strActiveApp].dateInfo.endDate), " end:%y/%mm/%dd %H:%M:%S, xScale:") + $Env.apps[strActiveApp].dateInfo.xScale + "}");
        $Env.apps[pApp].dateInfo = Object.assign({}, $Env.apps[strActiveApp].dateInfo);
        $.k2goSTARScontroller.setDateInfo(pApp, strActiveApp);
      }
    }
/*-----* sync position *------------------------------------------------------*/
    if (!$.k2goSTARScontroller.isAlive(pApp)) return;

    if ($.k2goSTARScontroller.isReady(pApp))
    {
      if ($.k2goSTARScontroller.isChangePosition(pApp, strActiveApp))
      {
        $.k2goSTARScontroller.putLog("[STARScontroller] change position " + pApp + " " + JSON.stringify($Env.apps[strActiveApp].position));
        $Env.apps[pApp].position = Object.assign({}, $Env.apps[strActiveApp].position);
        $.k2goSTARScontroller.setPosition(pApp);
      }
    }
  }

  setTimeout(function() { syncApp(pApp); }, $Env.interval);
}
/******************************************************************************/
/* window.unload                                                              */
/******************************************************************************/
$(window).on("unload", function()
{
  for (var strApp in $Env.apps)
  {
    if (strApp != $Env.mainApp && $.k2goSTARScontroller.isAlive(strApp))
    {
      $Env.apps[strApp].windowLayout.left   = $Env.apps[strApp].window.screenX     / screen.width;
      $Env.apps[strApp].windowLayout.top    = $Env.apps[strApp].window.screenY     / screen.height;
      $Env.apps[strApp].windowLayout.width  = $Env.apps[strApp].window.innerWidth  / screen.width;
      $Env.apps[strApp].windowLayout.height = $Env.apps[strApp].window.innerHeight / screen.height;

      $Env.apps[strApp].window.close();
    }

    delete $Env.apps[strApp].window;
    delete $Env.apps[strApp].dateInfo;
    delete $Env.apps[strApp].position;
  }

  if (typeof localStorage != "undefined")
  {
    try      { localStorage.setItem(location.pathname, JSON.stringify($Env)); }
    catch(e) { /* DO NOTHING (For Local Browsing) */ }
  }
});
});
