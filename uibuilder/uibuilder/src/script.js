/**
 * Main script file managing all global functionality of the outer website
 * 
 * Version 1.1
 */

var connectionState = true;
var waitingForResponse = {
    "request": undefined,
    "status": false
}
var thisPanelName = "";
var loadedContentCheck = undefined;
var isFullyPanel = false;
var thisPanelName = undefined;
var requiredInformation = [];

window.onload = function() {
    //Check if this is a fully panel, if it is get the panels information
    try {
        isFullyPanel = fully !== undefined;
        thisPanelName = fully.getDeviceId();
    }
    catch(e){
        thisPanelName = "web" + Math.floor(Math.random() * 1000);
    }

    //Check for compatibility
    if(sessionStorage === undefined || sessionStorage === null) {
        displayInformation("Browser not Suported!", "error", true);
        console.log("Critical Error: Browser does not support sessionStorage!");
    }

    setWidgets();

    //Start with a clean plate clear out the storage
    var page = sessionStorage.getItem("page");
    var globalPage = sessionStorage.getItem("globalPage");
    var mode = sessionStorage.getItem("mode");
    var locked = sessionStorage.getItem("locked");
    sessionStorage.clear();
    localStorage.clear();

    if(mode !== undefined && mode !== null) {
        sessionStorage.setItem("mode", mode);
    }
    else {
        sessionStorage.setItem("mode", "unknown");
    }

    if(page !== undefined && page !== null) {
        changePage(page);
    }
    else {
        changePage("home");
    }

    if(locked !== undefined && locked !== null) {
        lock(locked);
    }
    else {
        lock("false");
    }

    //Check if a requested page was passed via the url and goto it otherwise default
    var params = window.location.search.substring(1).split("&");
    for(var i in params) {
        if(params[i].split('=')[0] == "page") {
            sessionStorage.setItem("globalPage", params[i].split('=')[1]);
        }
    }

    //If there was a global page set goto that page otherwise we will wait for a mode to come in
    if(sessionStorage.getItem("globalPage") !== undefined && sessionStorage.getItem("globalPage") !== null) {
        changePage(sessionStorage.getItem("globalPage"));
    }

    //Add the listeners on the session storage to detect page updates
    window.addEventListener("storage", function(e) {
        switch(e.storageArea) {
            case sessionStorage: {
                switch(e.key) {
                    case "page": {
                        changePage(this.sessionStorage.getItem(e.key));
                        break;
                    }
                    case "loading": {
                        isLoading(sessionStorage.getItem(e.key), true);
                        break;
                    }
                    case "locked": {
                        lock(sessionStorage.getItem(e.key));
                        break;
                    }
                }
                break;
            }
            case localStorage: {
                //Local storage is used to store messages that need to be sent from the internal page             
                for(i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i).toString();
                    var value = localStorage.getItem(localStorage.key(i));

                    switch(key) {
                        case "status": {
                            requestStatus(JSON.parse(localStorage.getItem("status")));
                            this.localStorage.removeItem("status");
                            break;
                        }
                        case "request": {
                            sendRequest(JSON.parse(localStorage.getItem("request")));
                            this.localStorage.removeItem("request");
                            break;
                        }
                        case "askRequest": {
                            var payload = JSON.parse(localStorage.getItem("askRequest"))
                            sendRequest(JSON.parse(payload.value), false, true, payload.askText);
                            this.localStorage.removeItem("askRequest");
                            break;
                        }
                        case "passwordRequest": {
                            sendRequest(JSON.parse(localStorage.getItem("passwordRequest")), true);
                            this.localStorage.removeItem("passwordRequest");
                            break;
                        }
                        case "showPassword": {
                            var payload = JSON.parse(this.localStorage.getItem("showPassword"));
                            showPassword(payload.password, eval("(" + payload.callback + ")"), payload.returnParam1);
                            this.localStorage.removeItem("showPassword");
                            break;
                        }
                        case "ask": {
                            var payload = JSON.parse(this.localStorage.getItem("ask"));
                            showAreYouSure(payload.askText, eval("(" + payload.callback + ")"), payload.returnParam1);
                            this.localStorage.removeItem("ask");
                            break;
                        }
                        case "displayInformation": {
                            var payload = JSON.parse(this.localStorage.getItem("displayInformation"));
                            displayInformation(payload.message, payload.type, payload.keepOpen);
                            this.localStorage.removeItem("displayInformation");
                            break;
                        }
                        case "clearInformation": {
                            clearInformation();
                            break;
                        }
                        case "loading": {
                            isLoading(value);
                            this.localStorage.removeItem("loading");
                            break;
                        }
                        default: {
                            this.console.log("Misunderstood Local Storage Update");
                            this.console.log("Key: " + key);
                            this.console.log("Value: " + value);
                            break;
                        }
                    }
                }
            }
        }
    });

    //Setup UIBuilder
    uibuilder.start(); //Needed in later versions
    

    //Our connection state has changed with node red
    uibuilder.onChange('ioConnected', function(state) {
        if(state == true) {
            if(connectionState == false) {
                console.log("Reloading cause connection state changed");
                location.reload();
            }
        }
        else {
            displayInformation("Disconnected from Server! Attempting to Get it Back.", "error", true);
            connectionState = false;
        }
    });

    //Incoming message from node red
    uibuilder.onChange('msg', function(msg) {
        //If there is a device field and we are not that device don't process it
        if(msg.device !== undefined && msg.device !== null) {if(msg.device != thisPanelName){return;}}
        switch(msg.topic) {
            case "status": { 
                for(var key in msg.payload) {
                    if(msg.payload.hasOwnProperty(key)) {

                        //Update values
                        if(key == "mode") {
                            //If its a mode change change it and refresh
                            if(sessionStorage.getItem("mode") !== msg.payload[key]) {
                                sessionStorage.setItem(key, msg.payload[key]);
                                sessionStorage.setItem("page", "home");

                                //Update page elements
                                isLoading("yes");
                                setElementsVisibility();
                                setTimeout(function(){updatePage();}, 500);
                            }
                        }
                        else if(key != ""){
                            //Set the value in the storage
                            var item = msg.payload[key];
                            try{item = JSON.stringify(item);}catch(e){}
                            sessionStorage.setItem(key, item);
                        }
                    }
                }
                clearTimeout(waitingForResponse.status);
                waitingForResponse.request = undefined;

                break;
            }
            case "request": {
                for(var key in msg.payload) {
                    if(msg.payload.hasOwnProperty(key)) {
                        sessionStorage.setItem(key, msg.payload[key]);
                    }
                }
                clearTimeout(waitingForResponse.request);
                waitingForResponse.request = undefined;
                
                break;
            }
            case "information": {
                displayInformation(msg.payload["message"], msg.payload["type"]);
                break;
            }
            //Panel lockouts
            case "lock": {
                if(msg.payload[thisPanelName] !== undefined && msg.payload[thisPanelName] !== null) {
                    lock(msg.payload[thisPanelName]);
                }
                else if(msg.payload["state"] !== undefined && msg.payload["state"] !== null && isFullyPanel) {
                    lock(msg.payload["state"]);
                }
            }
        }
        console.log(msg);
    });

    //Request startup information
    requestStatus(["mode", "password", "lock"]);

    setTimeout(function(){
        if(connectionState == true && (sessionStorage.getItem("mode") == "unknown" || sessionStorage.getItem("mode") === undefined || sessionStorage.getItem("mode") === null)) {
            displayInformation("Failed to Get Information From Server", "error", true); 
            setTimeout(function(){console.log("Reloading cause mode was not obtained"); location.reload();}, 10000);
        }
    }, 5000);

    setElementsVisibility();
    updatePage();

    //Write information to console for debugging
    console.log("Device Information\nIs Fully Panel: " + isFullyPanel + "\nPanel Name: " + thisPanelName);
}

//Shows the are you sure screen. Calls the callback with true being yes and false being no
function showAreYouSure(text, callback, returnParam1) {
    document.getElementById("areYouSureText").innerHTML = text;

    var responseHandler = function(response) {
        clearInterval(countDownInterval);
        document.getElementById("areYouSureYes").onclick = undefined;
        document.getElementById("areYouSureNo").onclick = undefined;
        callback(response, returnParam1);
        document.getElementById("areYouSure").style.opacity = 0;
        setTimeout(function(){
            document.getElementById("areYouSure").classList.add("hidden");
        }, 500);
    }

    document.getElementById("areYouSure").classList.remove("hidden");
    document.getElementById("areYouSure").style.opacity = 1;
    var timeLeft = 9;
    var countDownInterval = setInterval(function() {
        if(timeLeft < 0) {responseHandler(false);}
        else {
            document.getElementById("areYouSureCountdown").innerHTML = "Will Automatically Select No in " + timeLeft + " Seconds"
            timeLeft -= 1;
        }
    }, 1000);
    
    document.getElementById("areYouSureYes").onclick = function() {
        responseHandler(true);
    }
    document.getElementById("areYouSureNo").onclick = function() {
        responseHandler(false);
    }
}

//Will show the password screen if correct will call the callback with true else false
function showPassword(password, callback, returnParam1) {
    //If there wasn't a password passed we are missing information reload
    if(password === undefined || password === null || password == "") {
        sessionStorage.clear();
        console.log("Reloading cause a password was not sent from the server");
        location.reload();
    }

    var timeLeft = 30;
    var countDownInterval = setInterval(function(){
        if(timeLeft < 0){
            currentPassword = "";
            document.getElementById("passwordEntry").innerHTML = "";
            document.getElementById("password").style.opacity = 0;
            setTimeout(function(){document.getElementById("passwordSuccess").style.opacity = 0;}, 500);
            setTimeout(function(){document.getElementById("password").classList.add("hidden");}, 500);
            setTimeout(function(){document.getElementById("passwordEntry").classList.add("hidden");}, 1000);
            clearInterval(countDownInterval);
            callback(false, returnParam1);
        }
        timeLeft -= 1;
    }, 1000);

    var responseHandler = function(response) {
        if(response == true) {
            clearInterval(countDownInterval);
            document.getElementById("passwordSuccessText").innerHTML = "<i class='far fa-check-circle'></i>";
            document.getElementById("passwordSuccessText").className = "foregroundGreen";
            document.getElementById("passwordSuccess").classList.remove("hidden");
            document.getElementById("passwordSuccess").style.opacity = 1;
            currentPassword = "";
            document.getElementById("passwordEntry").innerHTML = ""; 
            callback(response, returnParam1);


            //Close
            setTimeout(function() {
                document.getElementById("password").style.opacity = 0;
                setTimeout(function(){document.getElementById("passwordSuccess").style.opacity = 0;}, 500);
                setTimeout(function(){
                    document.getElementById("password").classList.add("hidden");
                }, 500);
                setTimeout(function(){
                    document.getElementById("passwordSuccess").classList.add("hidden");
                }, 1000);
            }, 1000);

        }
        else {
            timeLeft = 30;
            document.getElementById("passwordSuccessText").innerHTML = "<i class='far fa-times-circle'></i>";
            document.getElementById("passwordSuccessText").className = "foregroundRed";
            document.getElementById("passwordSuccess").classList.remove("hidden");
            document.getElementById("passwordSuccess").style.opacity = 1;

            //Close
            setTimeout(function() {
                currentPassword = "";
                document.getElementById("passwordEntry").innerHTML = "";
                setTimeout(function(){document.getElementById("passwordSuccess").style.opacity = 0;}, 500);
                setTimeout(function(){
                    document.getElementById("passwordSuccess").classList.add("hidden");
                }, 1000);
            }, 1000);
        }
    }

    var checkPassword = function() {
        if(currentPassword.length == password.length) {
            responseHandler(currentPassword == password);
        }
    }
    var currentPassword = "";

    //Go though the buttons and add their value
    for(var i = 0; i < document.getElementsByClassName("passwordButton").length; i++) {
        document.getElementsByClassName("passwordButton")[i].onclick = function() {
            if(this.innerHTML.toLowerCase() == "back") {
                clearInterval(countDownInterval);
                currentPassword = "";
                document.getElementById("passwordEntry").innerHTML = "";
                document.getElementById("password").style.opacity = 0;
                setTimeout(function(){
                    document.getElementById("password").classList.add("hidden");
                }, 500);
            }
            else {
                currentPassword += this.innerHTML;
                document.getElementById("passwordEntry").innerHTML += "&#11044;";
                checkPassword();
            }
        }
    }

    document.getElementById("password").classList.remove("hidden");
    document.getElementById("password").style.opacity = 1;
}

//Display a information message at the top of the page
var informationMessageShown = false;
function displayInformation(message, type, keepOpen) {
    if(informationMessageShown == false) {
        informationMessageShown = true;
        switch(type) {
            case "error": {
                document.getElementById("informationText").innerHTML = "<i class='fas fa-times'></i> " + message;
                document.getElementById("informationBar").classList.add("backgroundRed");
                break;
            }
            case "warning": {
                document.getElementById("informationText").innerHTML = "<i class='fas fa-exclamation-triangle'></i> " + message;
                document.getElementById("informationBar").classList.add("backgroundYellow");
                break;
            }
            case "information": {
                document.getElementById("informationText").innerHTML = "<i class='fas fa-info'></i> " + message;
                document.getElementById("informationBar").classList.add("backgroundGreen");
                break;
            }
            default: {
                document.getElementById("informationText").innerHTML = "<i class='fas fa-times'></i> " + message;
                document.getElementById("informationBar").classList.add("backgroundRed");
                break;
            }
        }

        //Show the bar and close if after a bit
        hideShowElement(document.getElementById("informationBar"), false, 1000);

        //Close after a while
        if(keepOpen == undefined) {
            setTimeout(function() {
                clearInformation();
            }, 5000);
        }
    }
}

//Clears whats displayed on the information bar
function clearInformation() {
    hideShowElement(document.getElementById("informationBar"), true, 1000);
    setTimeout(function(){
        document.getElementById("informationText").innerHTML = "";
        informationMessageShown = false;
        document.getElementById("informationBar").classList.remove("backgroundRed");
        document.getElementById("informationBar").classList.remove("backgroundYellow");
        document.getElementById("informationBar").classList.remove("backgroundGreen");
    },1000);   
}

/**
 * Global Methods
 */

//Change the current shown page
function changePage(page) {
    isLoading("yes");
    sessionStorage.setItem("page", page);
    updatePage();
}

//Update the inner page
var pageTimeout = undefined;
function updatePage() {
    //Check if the set page is valid otherwise error
    if(sessionStorage.getItem("page") === null || sessionStorage.getItem("page") === undefined) {
        sessionStorage.setItem("page", "error");
    }

    updateWidgets();

    //Add a small delay for the webpage to be ready
    clearTimeout(pageTimeout);
    pageTimeout = setTimeout(function() {
        document.getElementById("innerPageContent").innerHTML = "";
        document.getElementById("innerPageContent").setAttribute("data", "./pages/" + sessionStorage.getItem("page") + ".html");
    
        //Check if it's possible to load the page
        var pageLoaded = false;
        document.getElementById("innerPageContent").onload = function() {pageLoaded = true;}
        clearTimeout(loadedContentCheck);
        loadedContentCheck = setTimeout(function(){
            if(pageLoaded == false){
                displayInformation("An error occured loading the page. Please try again", "error", true);
                setTimeout(function(){sessionStorage.clear(); console.log("Reloading because an error occured loading the page"); location.reload();}, 2000);
            }
        }, 5000);
    }, 500);
}

//Set the loading
var loadingTimeout = undefined;
function isLoading(loading, forceSet) {
    if(forceSet === undefined || forceSet === null){forceSet=false;}
    if(sessionStorage.getItem("loading") != loading || forceSet == true) {
        sessionStorage.setItem("loading", loading);
        if(loading == "yes") {
            hideShowElement(document.getElementById("loading"), false);
    
            //Timeout after a while if we are still loading
            clearTimeout(loadingTimeout);
            loadingTimeout = setTimeout(function() {
                if(sessionStorage.getItem("loading") == "yes") {
                    displayInformation("Timed out while loading", "warning");
                    isLoading("no");
                }
            }, 5000);
        }
        else if(loading == "no") {
            clearTimeout(loadingTimeout);
            loadingTimeout = setTimeout(function(){hideShowElement(document.getElementById("loading"), true, 300);}, 500);
        }
    }
}

//Change the lock status of the panel
function lock(state) {
    //If the state if a temp unlock, unlock for 30 seconds
    if(state == "temp") {
        changePage("home");
        sessionStorage.setItem("locked", "temp");
        clearInformation();
        setElementsVisibility();
        setTimeout(function() {
            if(sessionStorage.getItem("locked") == "temp") {
                changePage("home");
                lock("true");
            }
        }, 30000);
        return;
    }

    //We should lock
    if(sessionStorage.getItem("locked") != state) {
        sessionStorage.setItem("locked", state);
        if(state == true || state == "true" || state=="yes") {
            changePage("home");
            displayInformation("This panel is locked. Your actions have been limited.", "warning", true);
            setElementsVisibility();
        }
        else {
            changePage("home");
            clearInformation();
            setElementsVisibility();
        }
    }
}

//Send a request to the server in form {"command": "", "value": ""}, can be an array
function sendRequest(request, passwordRequired, ask, askText) {
    //Send the command
    var process = function() {
        //If we have not been passed an array make it one
        if(Array.isArray(request) == false) {
            request = [request];
        }

        var msg = {
            "topic": "request",
            "payload": request
        }
        uibuilder.send(msg);

        clearTimeout(waitingForResponse.request);
        waitingForResponse.request = setTimeout(function(){
            
            
            displayInformation("Sorry mistakes were made attempting to do that. Please try again later", "error");
            
            
            
            clearTimeout(waitingForResponse.request);
            waitingForResponse.request = undefined;
        }, 5000);
    }

    //If a password is required
    if(passwordRequired == true) {
        showPassword(sessionStorage.getItem("password"), function(success) {
            if(success == true) {
                process();
            }
        });
    }
    
    //If we should ask them if they're sure
    else if(ask == true) {
        showAreYouSure(askText, function(success) {
            if(success == true) {
                process();
            }
        });
    }
    else {process();}
}

//Request for a status update from the server, can be an array
function requestStatus(type) {
    //If we have not been passed an array make it one
    if(Array.isArray(type) == false) {
        type = [type];
    }

    //Build the payload
    var msg = {
        "topic": "status",
        "device": thisPanelName,
        "payload": type
    }
    uibuilder.send(msg);

    clearTimeout(waitingForResponse.status);
    waitingForResponse.status = setTimeout(function(){
        displayInformation("Sorry some information was missed..", "warning");
        clearTimeout(waitingForResponse.status);
        waitingForResponse.status = undefined;
    }, 5000);
}