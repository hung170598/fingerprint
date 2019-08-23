var fingerprintData = {};
var finalData = {};
var actual_JSON;
var permissionsList = [];
var geoFlag = false;
var medFlag1 = false;
var medFlag2 = false;
var notiFlag = false;
var pushFlag = false;
var midiFlag = false;
var geoPermission = 'N/A';
var notifPermission = 'N/A';
var pushPermission = 'N/A';
var midiPermission = 'N/A';
var permissionsListObj = {};

// time stamp of the fingerprint
fingerprintData['timestamp'] = Date.now();

// // global window error handler
// window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
//     var error = {};
//     var d = new Date();
//     var time = d.toDateString() + "," + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
//     error['Timestamp'] = time;
//     error['UserAgent'] = navigator.userAgent;
//     error['Error'] = errorMsg;
//     error['Script'] = url;
//     error['Line'] = lineNumber;
//     error['Column'] = column;
//     error['StackTrace'] = errorObj;
//     console.log("In window.onerror" + error);
//     sendToServer(error);
//   };

// try catch wrapper
var wrap = function(func) {
  return function() {
    try {
      func.apply(this, arguments);
    } catch (error) {
      //console.log(error.message, "from", error.stack);
      var errorD = {};
      var d = new Date();
      var time = d.toDateString() + "," + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      errorD['Timestamp'] = time;
      errorD['UserAgent'] = navigator.userAgent;
      errorD['Error'] = error.stack;
      errorD['ErrorMessage'] = error.message;
      sendToServer(errorD);
      console.log("In wraper" + JSON.stringify(errorD));
    }
  };
};


// webgl vendor and renderer
function getWeglRendererAndVendorInfo() {
  var canvas = document.getElementById('my_Canvas');
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webgl2');
  if (!gl) {
    fingerprintData['webgl_vendor'] = 'N/A';
    fingerprintData['webgl_renderer'] = 'N/A';
    return;
  }

  var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

  if (!debugInfo) {
    fingerprintData['webgl_vendor'] = 'N/A';
    fingerprintData['webgl_renderer'] = 'N/A';
    return;
  }

  var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  fingerprintData['webgl_vendor'] = vendor;
  fingerprintData['webgl_renderer'] = renderer;

}

// media devices
function getMediaDevicesInfo() {
  if (navigator.mediaDevices) {
    var tempStore = [];
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        devices.forEach(function(device) {
          var tempObj = {};
          tempObj['device_kind'] = device.kind;
          tempObj['device_label'] = device.label;
          tempObj['device_id'] = device.deviceId;
          tempObj['device_group_id'] = device.groupId;
          // var devices = device.kind + ": " + device.label +
          //   " id = " + device.deviceId;
          tempStore.push(tempObj);
        });
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });

    fingerprintData['media_devices'] = tempStore;
  } else {
    fingerprintData['media_devices'] = 'N/A';
  }
}

// permission query for webcam and microphone
function getBrowserMediaPermissionsInfo() {

  var deferred = $.Deferred();
  var hasWebRTC = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  if (hasWebRTC) {

    try {
      DetectRTC.load(function() {
        //fingerprintData['is_website_hasWebcam_permissions'] = DetectRTC.isWebsiteHasWebcamPermissions;
        //console.log(DetectRTC.isWebsiteHasWebcamPermissions);
        if (DetectRTC.isWebsiteHasWebcamPermissions) {
          //permissionsList.push('webcam: granted');
          permissionsListObj["webcam"] = 'granted';
        } else if (medFlag1) {
          permissionsListObj["webcam"] = 'granted';
        } else if (medFlag2) {
          permissionsListObj["webcam"] = 'denied';
        } else {
          permissionsListObj["webcam"] = 'denied';
        }
        //fingerprintData['is_website_hasMicrophone_permissions'] = DetectRTC.isWebsiteHasMicrophonePermissions;
        //console.log(DetectRTC.isWebsiteHasMicrophonePermissions);
        if (DetectRTC.isWebsiteHasMicrophonePermissions) {
          permissionsListObj["microphone"] = 'granted';
        } else if (medFlag1) {
          permissionsListObj["microphone"] = 'granted';

        } else if (medFlag2) {
          permissionsListObj["microphone"] = 'denied';
        } else {
          permissionsListObj["microphone"] = 'denied';

        }
        deferred.resolve("In DetectRTC");
      });

    } catch (error) {
      permissionsListObj["webcam"] = 'N/A';
      permissionsListObj["microphone"] = 'N/A';
      //console.log(error.message, "from", error.stack);
      var errorD = {};
      var d = new Date();
      var time = d.toDateString() + "," + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      errorD['Timestamp'] = time;
      errorD['UserAgent'] = navigator.userAgent;
      errorD['Error'] = error.stack;
      errorD['ErrorMessage'] = error.message;
      sendToServer(errorD);
      console.log(JSON.stringify(errorD));
      deferred.resolve(error);

    }

  } else {
    permissionsListObj["webcam"] = 'N/A';
    permissionsListObj["microphone"] = 'N/A';
    return deferred.resolve("webcam and microphone").promise();

  }
  return deferred.promise();
}

// from Fingerprint2
function getFingerprint2LibraryInfo() {
  var fp = new Fingerprint2();
  var tempObj = {};
  fp.get(function(result, components) {
    for (var index in components) {
      var obj = components[index];
      var value = obj.value;
      var key = obj.key;
      fingerprintData[key] = value.toString();
      tempObj[key] = value;
    }
    // fingerprintData['user_agent'] = tempObj['user_agent'];
    // fingerprintData['preferred_language'] = tempObj['language'];
    // fingerprintData['color_depth'] = tempObj['color_depth'];
    // fingerprintData['pixel_ratio'] = tempObj['pixel_ratio'];
    // fingerprintData['hardware_concurrency'] = tempObj['hardware_concurrency'];
    // fingerprintData['screen_resolution'] = tempObj['resolution'];
    // fingerprintData['available_screen_resolution'] = tempObj['available_resolution'];
    // fingerprintData['timezone_offset'] = tempObj['timezone_offset'];
    // fingerprintData['session_storage'] = tempObj['session_storage'];
    // fingerprintData['local_storage'] = tempObj['local_storage'];
    // fingerprintData['indexed_db'] = tempObj['indexed_db'];
    // fingerprintData['open_database'] = tempObj['open_database'];
    // fingerprintData['cpu_class'] = tempObj['cpu_class'];
    // fingerprintData['navigator_platform'] = tempObj['navigator_platform'];

    // if (tempObj['do_not_track'] == 1) {
    //   fingerprintData['do_not_track'] = true;
    // } else {
    //   fingerprintData['do_not_track'] = false;
    // }

    // if (tempObj['plugins'].length > 0) {
    //   //console.log(tempObj['regular_plugins']);
    //   fingerprintData['plugins'] = tempObj['plugins'];
    // } else {

    //   fingerprintData['plugins'] = 'N/A';
    // }

    // fingerprintData['canvas_fonts'] = tempObj['js_fonts'];
    // fingerprintData['canvas'] = tempObj['canvas'];
    // fingerprintData['webgl'] = tempObj['webgl'];
    // fingerprintData['adblock'] = tempObj['adblock'];
    // fingerprintData['has_lied_languages'] = tempObj['has_lied_languages'];
    // fingerprintData['has_lied_resolution'] = tempObj['has_lied_resolution'];
    // fingerprintData['has_lied_os'] = tempObj['has_lied_os'];
    // fingerprintData['has_lied_browser'] = tempObj['has_lied_browser'];
    // fingerprintData['touch_support'] = tempObj['touch_support'];
  });



}

// get browser information
function getBrowserInfo() {

  if (window.navigator.appName) {
    //AddRowToInfo ("Name of the browser (appName)", window.navigator.appName);
    fingerprintData['browser_name'] = window.navigator.appName;
  }

  if (window.navigator.vendor) {
    //AddRowToInfo ("Name of the browser vendor (vendor)", window.navigator.vendor);
    fingerprintData['browser_vendor'] = window.navigator.vendor;
  }
  if (window.navigator.appCodeName) {
    //AddRowToInfo ("Code name of the browser (appCodeName)", window.navigator.appCodeName);
    fingerprintData['browser_code_name'] = window.navigator.appCodeName;
  }
  if (window.navigator.product) {
    //AddRowToInfo ("Engine of the browser (product)", window.navigator.product);
    fingerprintData['browser_engine'] = window.navigator.product;
  }
  if (window.navigator.productSub) {
    //AddRowToInfo ("Build number of the browser engine (productSub)", window.navigator.productSub);
    fingerprintData['browser_engine_build_number'] = window.navigator.productSub;
  }


  if (window.opera) {
    //AddRowToInfo ("Build number of the browser (buildNumber)", window.opera.buildNumber ());
    fingerprintData['browser_build_number'] = window.opera.buildNumber();
    //AddRowToInfo ("Version number of the browser (version)", window.opera.version ());
    fingerprintData['browser_version_number'] = window.opera.version();

  }
  if (window.navigator.appVersion) {
    //AddRowToInfo ("Version and platform of the browser (appVersion)", window.navigator.appVersion);
    fingerprintData['browser_version_and_platform'] = window.navigator.appVersion;
  }
  if (window.navigator.vendorSub) {
    //AddRowToInfo ("Version of the browser given by the vendor (vendorSub)", window.navigator.vendorSub);
    fingerprintData['browser_vendor_version'] = window.navigator.vendorSub;
  }
  if (window.navigator.appMinorVersion) {
    //AddRowToInfo ("Minor version of the browser (appMinorVersion)", window.navigator.appMinorVersion);
    fingerprintData['browser_minor_version'] = window.navigator.appMinorVersion;
  }
  if (window.navigator.buildID) {
    //AddRowToInfo ("Build identifier of the browser (buildID)", window.navigator.buildID);
    fingerprintData['browser_buildID'] = window.navigator.buildID;
  }
  if (window.navigator.systemLanguage) {
    //AddRowToInfo ("Language of the installed operating system (systemLanguage)", window.navigator.systemLanguage);
    fingerprintData['operating system_language'] = window.navigator.systemLanguage;
  }
  if (window.navigator.oscpu) {
    //AddRowToInfo ("Information about the OS and CPU (oscpu)", window.navigator.oscpu);
    fingerprintData['os_and_cpu'] = window.navigator.oscpu;
  }
  //AddRowToInfo ("Cookies are enabled (cookieEnabled)", window.navigator.cookieEnabled);
  fingerprintData['cookies_enabled'] = window.navigator.cookieEnabled;

}

// from DetectRTC
function getDetectRtcLibraryInfo() {
  DetectRTC.load(function() {
    fingerprintData['has_web_cam'] = DetectRTC.hasWebcam;
    fingerprintData['has_microphone'] = DetectRTC.hasMicrophone;
    fingerprintData['has_speakers'] = DetectRTC.hasSpeakers;
    fingerprintData['audio_input_devices'] = DetectRTC.audioInputDevices;
    fingerprintData['audio_output_devices'] = DetectRTC.audioOutputDevices;
    //console.log("Drtc" + DetectRTC.audioOutputDevices);
    fingerprintData['video_input_devices'] = DetectRTC.videoInputDevices;
    fingerprintData['os_name'] = DetectRTC.osName;
    fingerprintData['os_version'] = DetectRTC.osVersion;
    fingerprintData['is_private_browsing'] = DetectRTC.browser.isPrivateBrowsing;
  });
}

// AudioContext fingerprint
function audioFingerprintInfo() {
  var audioContext = window.AudioContext || window.webkitAudioContext;
  if ("function" !== typeof audioContext)
    fingerprintData['web_audio_fingerprint_oscillator'] = 'N/A';
  else {

    var cc_output = [];
    var audioCtx = new(window.AudioContext || window.webkitAudioContext),
      oscillator = audioCtx.createOscillator(),
      analyser = audioCtx.createAnalyser(),
      gain = audioCtx.createGain(),
      scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

    gain.gain.value = 0; // Disable volume
    oscillator.type = "triangle"; // Set oscillator to output triangle wave
    oscillator.connect(analyser); // Connect oscillator output to analyser input
    analyser.connect(scriptProcessor); // Connect analyser output to scriptProcessor input
    scriptProcessor.connect(gain); // Connect scriptProcessor output to gain input
    gain.connect(audioCtx.destination); // Connect gain output to audiocontext destination

    scriptProcessor.onaudioprocess = function(bins) {
      bins = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(bins);
      for (var i = 0; i < bins.length; i = i + 1) {
        cc_output.push(bins[i]);
      }
      analyser.disconnect();
      scriptProcessor.disconnect();
      gain.disconnect();
      fingerprintData['web_audio_fingerprint_oscillator'] = cc_output.slice(0, 30);
    };

    oscillator.start(0);
    oscillator.stop(audioCtx.currentTime + 5);

  }

}

// AudioContext properties:
// Performs fingerprint as found in some versions of http://metrics.nt.vc/metrics.js
function a(a, b, c) {
  for (var d in b) "dopplerFactor" === d || "speedOfSound" === d || "currentTime" ===
    d || "number" !== typeof b[d] && "string" !== typeof b[d] || (a[(c ? c : "") + d] = b[d]);
  return a
}

var nt_vc_output;

function audioContextPropertiesInfo() {
  //var tempArry = [];
  try {
    var nt_vc_context = window.AudioContext || window.webkitAudioContext;
    if ("function" !== typeof nt_vc_context)
      nt_vc_output = "N/A";
    else {
      var f = new nt_vc_context,
        d = f.createAnalyser();
      nt_vc_output = a({}, f, "ac_");
      nt_vc_output = a(nt_vc_output, f.destination, "ac_");
      nt_vc_output = a(nt_vc_output, f.listener, "ac_");
      nt_vc_output = a(nt_vc_output, d, "an_");
      //nt_vc_output = window.JSON.stringify(nt_vc_output, undefined, 2);
    }
  } catch (g) {
    nt_vc_output = 0
  }
  //set_result(nt_vc_output, 'nt_vc_result')
  //tempArry.push(nt_vc_output)
  fingerprintData['audio_context_properties'] = nt_vc_output;
}

// Fingerprint using hybrid of OscillatorNode/DynamicsCompressor method:
var hybrid_output = [];

function audioScillatorCompressorInfo() {

  var audioContext = window.AudioContext || window.webkitAudioContext;
  if ("function" !== typeof audioContext)
    fingerprintData['web_audio_fingerprint_oscillator_and_dynamicsCompressor'] = 'N/A';
  else {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext),
      oscillator = audioCtx.createOscillator(),
      analyser = audioCtx.createAnalyser(),
      gain = audioCtx.createGain(),
      scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

    // Create and configure compressor
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold && (compressor.threshold.value = -50);
    compressor.knee && (compressor.knee.value = 40);
    compressor.ratio && (compressor.ratio.value = 12);
    compressor.reduction && (compressor.reduction.value = -20);
    compressor.attack && (compressor.attack.value = 0);
    compressor.release && (compressor.release.value = .25);

    gain.gain.value = 0; // Disable volume
    oscillator.type = "triangle"; // Set oscillator to output triangle wave
    oscillator.connect(compressor); // Connect oscillator output to dynamic compressor
    compressor.connect(analyser); // Connect compressor to analyser
    analyser.connect(scriptProcessor); // Connect analyser output to scriptProcessor input
    scriptProcessor.connect(gain); // Connect scriptProcessor output to gain input
    gain.connect(audioCtx.destination); // Connect gain output to audiocontext destination

    scriptProcessor.onaudioprocess = function(bins) {
      bins = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(bins);
      for (var i = 0; i < bins.length; i = i + 1) {
        hybrid_output.push(bins[i]);
      }
      analyser.disconnect();
      scriptProcessor.disconnect();
      gain.disconnect();
      fingerprintData['web_audio_fingerprint_oscillator_and_dynamicsCompressor'] = hybrid_output.slice(0, 30);
      //set_result(hybrid_output.slice(0,30), 'hybrid_result');
      //draw_fp(bins);
    };

    oscillator.start(0);
    oscillator.stop(audioCtx.currentTime + 5);

  }


}

//
function enabledPluginInfo() {
  var temp = [];

  if (typeof navigator.mimeTypes != "undefined" && navigator.mimeTypes.length > 0) {

    for (var x = 0; x < navigator.mimeTypes.length; x++) {
      if (navigator.mimeTypes[x].enabledPlugin) {
          var temp2 = {};
          temp2["name'"] = navigator.mimeTypes[x].enabledPlugin.name;
          temp2["description"] = navigator.mimeTypes[x].enabledPlugin.description;
          temp.push(temp2);
      }
    }
    console.log("enabledPluginInfo" + temp);
    fingerprintData['enabled_plugin'] = temp;
  } else {
    fingerprintData['enabled_plugin'] = 'N/A';
  }

}

// MediaRecorder API
function mimeTypeInfo() {
  var mimeData = [];
  if (typeof navigator.mimeTypes != "undefined" && navigator.mimeTypes.length > 0) {
    for (var x = 0; x < navigator.mimeTypes.length; x++) {
      var temp2 = {};
     // if (typeof navigator.mimeTypes[x].type != "undefined" && navigator.mimeTypes[x].type != "") {
          temp2["type"] = navigator.mimeTypes[x].type;
          temp2["description"] = navigator.mimeTypes[x].description;
     // }
        if (navigator.mimeTypes[x].enabledPlugin) {
          temp2["plugin_name'"] = navigator.mimeTypes[x].enabledPlugin.name;
          temp2["plugin_description"] = navigator.mimeTypes[x].enabledPlugin.description;
        } else {
           temp2["plugin_name'"] = "N/A";
          temp2["plugin_description"] = "N/A";
        }
        mimeData.push(temp2);
        console.log("mimeTypeInfo" + mimeData);

    }
    fingerprintData['browser_mime_types'] = mimeData;
  } else {
    fingerprintData['browser_mime_types'] = 'N/A';
  }

}

// Audio mimetype
function mediaRecorderVideoInfo() {
  var temp = [];

  if (typeof MediaRecorder !== 'undefined') {

    var videoTypes = [
      "video/webm",
      'video/webm; codecs=vp9',
      "video/webm; codecs=vp9,opus",
      'video/webm; codecs=opus',
      "video/mpeg",
      "video/webm\;codecs=vp8",
      "video/webm\;codecs=daala",
      "video/webm\;codecs=h264",
      "video/ogg",
      "video/mp4"
    ];
    for (var i in videoTypes) {
      if (MediaRecorder.isTypeSupported(videoTypes[i])) {
        temp.push(videoTypes[i]);
      }
    }

    fingerprintData['media_recorder_video_mime_types'] = temp;

  } else {
    fingerprintData['media_recorder_video_mime_types'] = 'N/A';
  }
}


// Audio mimetype
function mediaRecorderAudioInfo() {
  var temp = [];
  if (typeof MediaRecorder !== 'undefined') {
    var audioTypes = [
      "audio/vnd.wave",
      "audio/wave",
      "audio/wav",
      "audio/x-wav",
      "audio/webm",
      "audio/webm\;codecs=opus",
      "audio/mpeg",
      "audio/ogg",
      "audio/vorbis",
      "audio/x-pn-wav",
      "audio/vorbis-config",
      "application/ogg",
      "audio/MPA",
      "audio/mpa-robust",
      "audio/aac",
      "audio/aacp",
      "audio/3gpp",
      "audio/3gpp2",
      "audio/mp4",
      "audio/mp4a-latm",
      "audio/mpeg4-generic",
      "audio/opus",
      "audio/flac",
      "audio/x-flac"
    ];

    for (var i in audioTypes) {
      //var mimeData = {};
      if (MediaRecorder.isTypeSupported(audioTypes[i])) {
        temp.push(audioTypes[i]);
      }
    }

    fingerprintData['media_recorder_audio_mime_types'] = temp;

  } else {
    fingerprintData['media_recorder_audio_mime_types'] = 'N/A';

  }
}

// Network Information API
function connectionTypeInfo() {
  var isConnectionSupported = 'connection' in navigator;
  var tempObj = {};
  if (isConnectionSupported) {
    tempObj['connection_type'] = navigator.connection.type;
    tempObj['max_downlink'] = navigator.connection.downlinkMax;
    fingerprintData['network_information'] = tempObj;

  } else {

    fingerprintData['network_information'] = "N/A";
  }
}


function sortObj(obj, order) {
  "use strict";

  var key,
    tempArry = [],
    i,
    tempObj = {};

  for (key in obj) {
    tempArry.push(key);
  }

  tempArry.sort(
    function(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
  );

  if (order === 'desc') {
    for (i = tempArry.length - 1; i >= 0; i--) {
      tempObj[tempArry[i]] = obj[tempArry[i]];
    }
  } else {
    for (i = 0; i < tempArry.length; i++) {
      tempObj[tempArry[i]] = obj[tempArry[i]];
    }
  }

  return tempObj;
}

// clean data
function cleanData() {

  //console.log('In cleanData fingerprintData' +  JSON.stringify(fingerprintData));
  for (var key in fingerprintData) {
    if (fingerprintData.hasOwnProperty(key)) {
      if (fingerprintData[key] == undefined || fingerprintData[key].length == 0) {
        //console.log('In cleanData fingerprintData' + key +  fingerprintData[key]);
        fingerprintData[key] = "N/A";
      }
    }

  }

  //console.log('In cleanData in actual_JSON' + JSON.stringify(actual_JSON));
  for (var key in actual_JSON) {
    if (actual_JSON.hasOwnProperty(key)) {
      if (fingerprintData[key] == undefined) {
        //console.log('In cleanData in actual_JSON' + key +  fingerprintData[key]);
        fingerprintData[key] = "N/A";
      }

      finalData[key] = fingerprintData[key];
      finalData = sortObj(finalData, 'asc');
    }


  }

}

// load json file
function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'data/variables.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

// print on screen
function printOnScreen() {
  var output = document.getElementById("out");
  output.innerHTML = "<table class='table table-striped' " + " id='table_div'> " +
    "<tbody> </tbody></table>";
  //fingerprintData = sortObj(fingerprintData, 'asc');

  for (var key in fingerprintData) {

    var value = JSON.stringify(fingerprintData[key]);
    if (value.length > 250) {

      $("#table_div").append("<tr data-toggle='collapse' data-target='#" + key + "' class='accordion-toggle' ><td class='col-md-2'>" + key + "</td> <td class='col-md-6'>" + value.substring(0, 100) + "<button type='button'> More >> </button>" + " </td></tr>" +
        "<tr><td colspan='3' class='hiddenRow'> <div class='accordion-body collapse' id='" + key + "'>" + value.substring(0, 1000) + "</div> </td></tr>");

    } else if (fingerprintData[key] instanceof Array) {

      $("#table_div").append("<tr><td class='col-md-2'>" + key + "</td> <td class='col-md-6'>" + value + "</td></tr>");

    } else if ((typeof fingerprintData[key] === 'function') || (typeof fingerprintData[key] === 'object')) {
      $("#table_div").append("<tr><td class='col-md-2'>" + key + "</td> <td class='col-md-6'>" + value + "</td></tr>");

    } else {
      $("#table_div").append("<tr><td class='col-md-2'>" + key + "</td> <td class='col-md-6'>" + fingerprintData[key] + "</td></tr>");

    }


  }
}

getWeglRendererAndVendorInfo();
getMediaDevicesInfo();
getBrowserMediaPermissionsInfo();
getFingerprint2LibraryInfo();
getBrowserInfo();
getDetectRtcLibraryInfo();
audioFingerprintInfo();
enabledPluginInfo();
mimeTypeInfo();
mediaRecorderVideoInfo();
mediaRecorderAudioInfo();
printOnScreen();
console.log(fingerprintData);
