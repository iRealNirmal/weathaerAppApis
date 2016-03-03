var weather = [];
$(document).ready(function(e){
	getLocation();
	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition,showError);
	    } else {
	        alert("Geolocation is not supported by this browser.");
	    }
	}
	function showPosition(position) {
	   console.log(position.coords.latitude + ","+ position.coords.longitude); 
	   parseApi("",true,position.coords.latitude,position.coords.longitude);
	};
	$("#postcode").on("submit",function(e){
		e.preventDefault();
		parseApi($("#zip").val(),"zip");
	});
	$("#location").on("submit",function(e){
		e.preventDefault();
		parseApi($("#q").val(),"loc");
	})
	function showError(error){
		switch(error.code) 
		    {
		    case error.PERMISSION_DENIED:
		      console.log("User denied the request for Geolocation.");
		      $("#manual").slideDown();
		      break;
		    case error.POSITION_UNAVAILABLE:
		      console.log("Location information is unavailable.");
		      break;
		    case error.TIMEOUT:
		      console.log("The request to get user location timed out.");
		      break;
		    case error.UNKNOWN_ERROR:
		      console.log("An unknown error occurred.");
		      break;
		}
	}
	function parseApi(a,b,c,d){
		var API = "http://api.openweathermap.org/data/2.5/weather";
		if(b==true){
		    $.getJSON( API, {
			    lat: c,
			    lon: d,
			    appid: "44db6a862fba0b067b1930da0d769e98",
			    format: "json"
		    }).done(function( data ) {
		    	parseData(data);
		    }).fail(function( jqxhr, textStatus, error ) {
			    var err = textStatus + ", " + error;
			    console.log( "Request Failed: " + err );
		    });
		}else{
			if(b=="zip"){
			    $.getJSON( API, {
				    zip: a,
				    appid: "44db6a862fba0b067b1930da0d769e98",
				    format: "json"
			    }).done(function( data ) {
			    	if(data["cod"]=="404"){
			    		alert("No City Found");
			    	}else if(data["cod"]=="200"){
			    		$("#weather-info").empty();
			    		parseData(data);
			    	}else{
			    		alert("Somthing mischevious gone");
			    	}
			    }).fail(function( jqxhr, textStatus, error ) {
				    var err = textStatus + ", " + error;
				    console.log( "Request Failed: " + err );
			    });
			}else{
				$.getJSON( API, {
				    q: a,
				    appid: "44db6a862fba0b067b1930da0d769e98",
				    format: "json"
			    }).done(function( data ) {
			    	if(data["cod"]=="404"){
			    		alert("No City Found");
			    	}else if(data["cod"]=="200"){
			    		$("#weather-info").empty();
			    		parseData(data);
			    	}else{
			    		alert("Somthing mischevious gone");
			    	}
			    }).fail(function( jqxhr, textStatus, error ) {
				    var err = textStatus + ", " + error;
				    console.log( "Request Failed: " + err );
			    });
			}
		}
		
	}
	function parseData(data){
		weather["sky"] = data["weather"][0]["description"];
    	weather["icon"] = data["weather"][0]["icon"];
    	weather["pressure"] = data["main"]["pressure"];
    	weather["humidity"] = data["main"]["humidity"];
    	weather["temp"] = toCelsius(data["main"]["temp"]);
    	weather["temp_min"] = toCelsius(data["main"]["temp_min"]);
    	weather["temp_max"] = toCelsius(data["main"]["temp_max"]);
    	weather["speed"] = data["wind"]["speed"];
    	weather["direction"] = DegreeToDirection(data["wind"]["deg"]);
    	weather["date"] = UtcToDate(data["dt"]);
    	weather["country"] = data["sys"]["country"];
    	weather["location"] = data["name"];
    	weather["sunrise"] = UtcToTime(data["sys"]["sunrise"]);
    	weather["sunset"] = UtcToTime(data["sys"]["sunset"]);
    	$("#weather-info").append("<div class='col-xs-12 col-sm-6 col-md-4'>Location : "+weather["location"]+", " +weather["country"], + "<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Temperature: <img alt='"+weather["temp"]+"' src='http://openweathermap.org/img/w/"+weather["icon"]+".png'/> "+weather["temp"]+" c<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Temperature Min: "+weather["temp_min"]+" c<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Temperature Max: "+weather["temp_max"]+" c<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Humidity: "+weather["humidity"]+" %<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Wind Speed: "+weather["speed"]+" meter/sec<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Wind Direction: "+weather["direction"]+"<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Wind Pressure: "+weather["pressure"]+"<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Date: "+weather["date"]+"<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Sunrise Time: "+weather["sunrise"]+"<div>")
    	.append("<div class='col-xs-12 col-sm-6 col-md-4'>Sunset Time: "+weather["sunset"]+"<div>");
	}
	function UtcToDate(a,b){
		// Convert unix timestamp to date
		var date = new Date(a*1000);
		if(b){
			return date;
		}else{
			return (date.getDate().toString()+"-"+date.getMonth().toString()+"-"+date.getFullYear().toString());
		}
		
	}
	function UtcToTime(a){
		var date = UtcToDate(a,true);
		// Hour part from the timestamp
		var hours = date.getHours();
		// Minutes part from the timestamp
		var minutes = "0" + date.getMinutes();
		// Seconds part from the timestamp
		var seconds = "0" + date.getSeconds();
		return(hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
	}
	function toCelsius(f) {
	    return ((f-273.15).toFixed(2));
	}
	function DegreeToDirection(degr){
		var deg = parseInt(degr);
		var dir;
		if (deg >= 0 && deg <= 11.25) {
		 dir = "N";
		} else if (deg > 348.75 && deg <= 360) {
		 dir = "N";
		}else if (deg > 11.25 && deg <= 33.75) {
		 dir = "NNE";
		}else if (deg > 33.75 && deg <= 56.25) {
		 dir = "NE";
		}else if (deg > 56.25 && deg <= 78.75) {
		 dir = "ENE";
		}else if (deg > 78.75 && deg <= 101.25) {
		 dir = "E";
		}else if (deg > 101.25 && deg <= 123.75) {
		 dir = "ESE";
		}else if (deg > 123.75 && deg <= 146.25) {
		 dir = "SE";
		}else if (deg > 146.25 && deg <= 168.75) {
		 dir = "SSE";
		}else if (deg > 168.75 && deg <= 191.25) {
		 dir = "S";
		}else if (deg > 191.25 && deg <= 213.75) {
		 dir = "SSW";
		}else if (deg > 213.75 && deg <= 236.25) {
		 dir = "SW";
		}else if (deg > 236.25 && deg <= 258.75) {
		 dir = "WSW";
		}else if (deg > 258.75 && deg <= 281.25) {
		 dir = "W";
		}else if (deg > 281.25 && deg <= 303.75) {
		 dir = "WNW";
		}else if (deg > 303.75 && deg <= 326.25) {
		 dir = "NW";
		}else if (deg > 326.25 && deg <= 348.75) {
		 dir = "NNW";
		}else if (deg < 0 || dir > 360) {
		 alert("Something crazy thing has happened to world");
		}
		return dir;
	}
});