
var tempObj ={};
Fingerprint2.get(function(components) {
    for (var index in components) {
        var obj = components[index];
        var value = obj.value;
        var key = obj.key;
        tempObj[key] = value;
    }
    console.log(tempObj);
});
console.log(tempObj);
for(var key in tempObj){
    console.log(tempObj[key]);
}