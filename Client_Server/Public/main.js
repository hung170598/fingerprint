function sendToServer(data){
	$.ajax({
		type: "POST",
		url: 'localhost:3030/post',
		data: JSON.stringify(data),
    	contentType: "application/json",
    	success: function(suc) {
      		console.log(suc);
    	},
    	error: function(err) {
      		console.log(err);
    	}
	})
}

sendToServer("Hello Server!");
console.log("Finish!");