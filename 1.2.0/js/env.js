/******************************************************************************/
/* k2go STARScontroller                                                       */
/* version   : 1.2.0                                                          */
/* author    : Inoue Computer Service.                                        */
/* Copyright (c) k2go. All rights reserved.                                   */
/* See License.txt for the license information.                               */
/******************************************************************************/
var $Env = {
  version: "2021092702",
  showLogConsole: true,
  interval: 100,
  mainApp: "himawariJp",
  activeApp: "himawariJp",
  apps: {
    himawariJp: {
      type: "himawariJp",
      url: "/path/to/app/hogehoge.html,
      windowLayout: { left: 0, top: 0, width: 0.495, height: 0.45 },
      windowFeatures:
        "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes",
    },
    himawari01: {
      type: "himawariEn",
      url: "/path/to/app/hogehoge.html,
      windowLayout: { left: 0.25, top: 0.51, width: 0.5, height: 0.395 },
      windowFeatures:
        "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes",
    },
  },
};