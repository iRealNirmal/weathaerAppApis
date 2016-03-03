// Let's test this function

asyncTest('Ajax tests', function(){
	expect(1); // we have one async test to run
	
	var xhr = $.ajax({
		type: 'GET',
		url: 	'http://api.openweathermap.org/data/2.5/weather?zip=33548,us&appid=44db6a862fba0b067b1930da0d769e98'
	})
	.always(function(data, status){
		var name = data["name"];;
		equal(name, 'Lutz', 'Name of place should be Lutz');
		if(name=="Lutz"){
			console.log(data);
			$("#result").append(JSON.stringify(data));
		}
	})

});