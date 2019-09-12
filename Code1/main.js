var fingerprintData = {};
var finalData = {};

//timestamp
fingerprintData['timestamp'] = Date.now();

//try catch wrapper
var wrap = function(func){
	return function(){
		try{
			func.apply(this, arguments);
		} catch(error){
			console.log("In wrapper" + func.name);
		}
	};
};

var getWeglRendererAndVendorInfoR = wrap(getWeglRendererAndVendorInfo);
var getFingerprint2InfoR = wrap(getFingerprint2Info);
var getBrowserInfoR = wrap(getBrowserInfo);
var enabledPluginInfoR = wrap(enabledPluginInfo);
var mimeTypeInfoR = wrap(mimeTypeInfo);
var mediaRecorderVideoInfoR = wrap(mediaRecorderVideoInfo);
var mediaRecorderAudioInfoR = wrap(mediaRecorderAudioInfo);
var getDetectRTCInfoR = wrap(getDetectRTCInfo);
var printOnScreenR = wrap(printOnScreen);
var getMediaDevicesInfoR = wrap(getMediaDevicesInfo);
var functionCallFacadeR = wrap(functionCallFacade);
var mainEntryFunctionR = wrap(mainEntryFunction);

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

//get Fingerprint2 Info
function getFingerprint2Info() {
  var tempObj = {}, components;
  Fingerprint2.get(function(components) {
    for (var index in components) {
      var obj = components[index];
      var value = obj.value;
      var key = obj.key;
      tempObj[key] = value;
    }
    
    fingerprintData['adBlock'] = tempObj['adBlock'];
    fingerprintData['addBehavior'] = tempObj['addBehavior'];
    fingerprintData['audio'] = tempObj['audio'];
    fingerprintData['availableScreenResolution'] = tempObj['availableScreenResolution'];
    fingerprintData['canvas'] = tempObj['canvas']; 
    fingerprintData['colorDepth'] = tempObj['colorDepth'];
    fingerprintData['deviceMemory'] = tempObj['deviceMemory'];
    fingerprintData['fonts'] = tempObj['fonts'];
    fingerprintData['indexedDb'] = tempObj['indexedDb'];
    fingerprintData['hasLiedBrowser'] = tempObj['hasLiedBrowser'];
    fingerprintData['hasLiedLanguages'] = tempObj['hasLiedLanguages'];
    fingerprintData['hasLiedOs'] = tempObj['hasLiedOs'];
    fingerprintData['hardwareConcurrency'] = tempObj['hardwareConcurrency'];
    fingerprintData['language'] = tempObj['language'];
    fingerprintData['localStorage'] = tempObj['localStorage'];
    fingerprintData['openDatabase'] = tempObj['openDatabase'];
    fingerprintData['plugins'] = tempObj['plugins'];
    fingerprintData['screenResolution'] = tempObj['screenResolution'];
    fingerprintData['sessionStorage'] = tempObj['sessionStorage'];
    fingerprintData['timezone'] = tempObj['timezone'];
    fingerprintData['timezoneOffset'] = tempObj['timezoneOffset'];
    fingerprintData['touchSupport'] = tempObj['touchSupport'];
    fingerprintData['userAgent'] = tempObj['userAgent'];
    fingerprintData['webdriver'] = tempObj['webdriver'];
    fingerprintData['webgl'] = tempObj['webgl'];
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

//get enable Plugin Info
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
    //console.log("enabledPluginInfo" + temp);
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
        //console.log("mimeTypeInfo" + mimeData);

    }
    fingerprintData['browser_mime_types'] = mimeData;
  } else {
    fingerprintData['browser_mime_types'] = 'N/A';
  }
}

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

//get DetectRTC Info
function getDetectRTCInfo(){
	DetectRTC.load(function(){
	  	fingerprintData['audio_input_devices'] = DetectRTC.audioInputDevices;
	  	fingerprintData['audio_output_devices'] = DetectRTC.audioOutputDevices;
	  	fingerprintData['video_input_devices'] = DetectRTC.videoInputDevices;
	  	fingerprintData['os_name'] = DetectRTC.osName;
	  	fingerprintData['os_version'] = DetectRTC.osVersion;
	  	function detectIpAddress(stream){
	    	DetectRTC.DetectLocalIPAddress(function(ipAddress, isPublic, isIpv4){
	      	if(!ipAddress) return;
          console.log(ipAddress);
	      	if(ipAddress.indexOf('Local') !== -1){
	      	  fingerprintData["Local IP"] = ipAddress;
	      	}else  {
	     	     fingerprintData["Public IP"] = ipAddress;
	     	   }
	     	 if(!stream) return;

	     	 stream.getTracks().forEach(function(track) {
	     	   track.stop();
	     	 });

	     	 stream = null;
	    	}, stream);
	 	}
	  	if(DetectRTC.browser.name === "Edge") {
	  	  navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
	   	   detectIpAddresses(stream);
	   	});
	  	} else{
	   	 detectIpAddress();
	  	}
	});
}

//print on screen
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

function functionCallFacade(){
	getWeglRendererAndVendorInfoR();
	getBrowserInfoR();
	getMediaDevicesInfoR();
	getFingerprint2InfoR();
	getDetectRTCInfo();
	enabledPluginInfoR();
	mimeTypeInfoR();
	mediaRecorderAudioInfoR();
	mediaRecorderVideoInfoR();
	setTimeout(function(){
		printOnScreen();
		console.log(fingerprintData);
	}, 500);
}

function mainEntryFunction(){
	var d = jQuery.Deferred(), p = d.promise();
	p.then(function(value){
		console.log(value);
		functionCallFacadeR();
		});
	d.resolve();
}

mainEntryFunctionR();
console.log(navigator.connection);