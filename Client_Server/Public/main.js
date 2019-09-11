function sendToServer(data){
	$.post("localhost:3030/post", data = data, dataType = "json");
	console.log("Posted");
}

sendToServer("Posted");
console.log("Finish!");