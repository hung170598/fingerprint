if (window.requestIdleCallback) {
    requestIdleCallback(function () {
        Fingerprint2.get(function (components) {
    		var values = components.map(function (component) { return component.value })
    		var murmur = Fingerprint2.x64hash128(values.join(''), 31)
    		console.log(murmur)
    		console.log(components)
		})
    })
} else {
    setTimeout(function () {
       Fingerprint2.get(function (components) {
    		var values = components.map(function (component) { return component.value })
    		var murmur = Fingerprint2.x64hash128(values.join(''), 31)
    		console.log(murmur)
    		console.log(components)
		})  
    }, 50)
}
function getFingerprint2LibraryInfo(){
  var tempObj = getFingerprint2Object();
  console.log(tempObj);
  var tempObj2 = {};
  for(var index in tempObj)
    tempObj2[tempObj[index].key] = tempObj[index].value;
  console.log(tempObj2);
}