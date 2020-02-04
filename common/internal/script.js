/**
 * Main global script file for the inner website
 * 
 * Version 1.1
 */

var internalScriptVersion = "1.1"; 

var requiredInformation;

function processGlobal() {
    requiredInformation = [];
    setWidgets();
    updatePage();

    //When we have completed loading
    checkInformation(function(loaded) {
        window.addEventListener("storage", function(e) {
            if(e.storageArea == this.sessionStorage) {
                updatePage();
            }
        });

        updatePage();
        setTimeout(function(){loadComplete(loaded)}, 0);
    });
}


//Update the elements on the page
function updatePage() {
    setElementsVisibility();
    updateWidgets();
}

/**
 *  Global methods
 */

//Change the current page
function changePage(page) {
    sessionStorage.setItem("page", page);
}

//Set the page to loading or not
function isLoading(loading) {
    sessionStorage.setItem("loading", loading);
}

//Lock the external page
function lock(lock) {
    sessionStorage.setItem("locked", lock);
}

//Show password
function showPassword(password, callback, returnParam1) {
    localStorage.setItem("showPassword", JSON.stringify({"password": password, "callback": callback.toString(), "returnParam1": returnParam1}));
}

//Clear the information dialog
function clearInformation() {
    localStorage.setItem("clearInformation", "");
}

//Show ask dialog
function ask(askText, callback, returnParam1) {
    localStorage.setItem("ask", JSON.stringify({"askText": askText, "callback": callback.toString(), "returnParam1": returnParam1}));
}

//Send a request to the server as {"command": "", "request", ""}, can be an array
function sendRequest(json, passwordRequired, ask, askText) {
    //If we have not been passed an array make it one
       if(Array.isArray(json) == false) {
        json = [json];
    }

    //Grab the status as an array
    var request = localStorage.getItem("request");
    if(request === undefined || request === null){request = [];}
    else {request = JSON.parse(request);}

    //Add our value(s)
    for(var i = 0; i < json.length; i++) {
        request.push(json[i]);
    }
    
    //If we should ask the user first
    if(ask == true) {
        if(askText == undefined || askText == null){askText = "";}
        localStorage.setItem("askRequest", JSON.stringify({"askText": askText, "value": JSON.stringify(request)}));
    }
    else if(passwordRequired == true) {
        localStorage.setItem("passwordRequest", JSON.stringify(request));
    }
    else {
        localStorage.setItem("request", JSON.stringify(request));
    }    
}

//Request for a status update from the server, can be an array
function requestStatus(type) {
    //If we have not been passed an array make it one
    if(Array.isArray(type) == false) {
        type = [type];
    }

    //Grab the status as an array
    var status = localStorage.getItem("status");
    if(status === undefined || status === null){status = [];}
    else {status = JSON.parse(status);}

    //Add our value(s)
    for(var i = 0; i < type.length; i++) {
        status.push(type[i]);
    }

    localStorage.setItem("status", JSON.stringify(status));
}

//Display a information bar
function displayInformation(message, type, keepOpen) {
    localStorage.setItem("displayInformation", JSON.stringify({"message": message, "type": type, "keepOpen": keepOpen}));
}

//Returns the fully kiosk information as a html string
function getFullyInformation() {
    //First check if this is a fully kiosk instance
    if(typeof fully === typeof undefined) {
        //Nope
        document.getElementById("fullyInformation").innerHTML = "<h1>Advanced Configuration</h1><p><b>Type: </b>Not fully panel</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Mode: </b>" + sessionStorage.getItem("mode") + "</p>";
    }
    else {
        //We have a fully kiosk instance
        document.getElementById("fullyInformation").innerHTML = "<h1>Advanced Configuration</h1><p><b>Type: </b>Fully Panel</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Mode: </b>" + sessionStorage.getItem("mode") + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>ipv4: </b>" + fully.getIp4Address() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>ipv6: </b>" + fully.getIp6Address() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Hostname ipv4: </b>" + fully.getHostname() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Hostname ipv6: </b>" + fully.getHostname6() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Mac Address: </b>" + fully.getMacAddress() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Serial Number: </b>" + fully.getSerialNumber() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Device ID: </b>" + fully.getDeviceId() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Fully Version: </b>" + fully.getFullyVersion() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Web View Version: </b>" + fully.getWebviewVersion() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Android Version: </b>" + fully.getAndroidVersion() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Android SDK: </b>" + fully.getAndroidSdk() + "</p>";
        document.getElementById("fullyInformation").innerHTML += "<p><b>Device Model: </b>" + fully.getDeviceModel() + "</p>";

        document.getElementById("fullyInformation").innerHTML += "<button onclick='fully.loadStartUrl();'>Load Start URL</button>";
        document.getElementById("fullyInformation").innerHTML += "<button onclick='fully.restartApp();'>Restart Fully</button>";
        document.getElementById("fullyInformation").innerHTML += "<button onclick='fully.clearCache();'>Clear Cache</button>";
        document.getElementById("fullyInformation").innerHTML += "<button onclick='fully.exit();'>Exit Fully</button>";
    }
}