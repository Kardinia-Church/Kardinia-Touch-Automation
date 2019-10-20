/**
 * Utility Methods
 * Where functions that are referenced thoughout the site are defined
 * 
 * Version 1.0 Alpha
 */

//Flash a button when clicked
function flashButton(button, period=500) {
    var backgroundColor = button.style.backgroundColor;
    button.style.backgroundColor = "";
    button.classList.remove("offColor");
    button.classList.add("pressedColor");
    setTimeout(function(){
        button.classList.remove("pressedColor");
        button.classList.add("offColor");
        if(backgroundColor !== null && backgroundColor !== undefined) {
            button.style.backgroundColor = backgroundColor;
        }
    }, 100);
}

//Loop though the widgets and set them
function setWidgets() {
    try {
        for(var key in widgets) {
            widgets[key].set(document.getElementsByName(key));
        }
    }
    catch(e) {console.log("Error: Widgets file not included in HTML or other error: " + e);}
}

//Loop through the widgets and update them
function updateWidgets() {
    for(var key in widgets) {
        widgets[key].update(document.getElementsByName(key), requiredInformation);
    }  
}

//Go though all the elements and set their visibilty based on mode and lock status
function setElementsVisibility() {
    for(var i = 0; i < document.body.getElementsByTagName("*").length; i++) {
        var element = document.body.getElementsByTagName("*")[i];
        var mode = element.getAttribute("mode");
        var showWhileLocked = element.getAttribute("showWhileLocked");
        var showElement = true;

        //If we shouldn't ignore this element process it
        if((mode != undefined && mode != null) || (showWhileLocked != undefined && showWhileLocked != null)) {
            //Check mode status
            if(mode !== undefined && mode !== null) {
                switch(mode) {
                    case "all": {
                        break;
                    }
                    case "none": {
                        showElement = false;
                        break;
                    }
                    default: {
                        if(mode.includes(" ") == true) {
                            var modeIncluded = false;
                            //There are multiple modes defined by " "
                            for(var j = 0; j < mode.split(' ').length; j++) {
                                if(sessionStorage.getItem("mode") == mode.split(' ')[j]) {
                                    modeIncluded = true;
                                }
                            }
                            if(modeIncluded == false){showElement = false;}
                        }
                        else {
                            if(mode != sessionStorage.getItem("mode")){showElement = false;}
                        }
                        break;
                    }
                }
            }

            //Check lock status
            if(showWhileLocked !== undefined && showWhileLocked !== null) {
                if(showWhileLocked.toLowerCase() != "yes" && showWhileLocked.toLowerCase() != "only" && sessionStorage.getItem("locked") == "true") {
                    showElement = false;
                }
                else if(showWhileLocked.toLowerCase() == "only") {
                    if(sessionStorage.getItem("locked") != "true") {
                        showElement = false;
                    }
                }
            }

            //Hide / Show element
            if(showElement == false) {
                element.style.opacity = 0;
                element.classList.add("hidden");
            }
            else {
                element.classList.remove("hidden");
                element.style.opacity = 1;
            }
        }
    }
}

//Hide / show a element with fading
var clearHideShowElementTimeout = undefined;
function hideShowElement(element, state, period=500) {
    clearTimeout(clearHideShowElementTimeout);
    element.style.transition = "opacity linear " + period + "ms";
    if(state == true) {
        element.style.opacity = 0;
        clearHideShowElementTimeout = setTimeout(function(){element.classList.add("hidden");}, period + 100);
    }
    else {
        element.classList.remove("hidden");
        element.style.opacity = 1;
    }
}

//Loading has completed on the page, removes the loading screen
function loadComplete(success) {
    isLoading("no");
    if(success == false) {
        displayInformation("Sorry some information was missed", "warning");
    }
}

//Check if we have all the required information from the server
var checkInformationInterval = undefined;
var checkInformationRetries = 0;
var allInformationPopulated = true;
function checkInformation(loadedCallback) {
    var askForInformation = [];
    var allInformationPopulated = true;
    //Check that all the required information is populated
    for(var i = 0; i < requiredInformation.length; i++) {
        if(sessionStorage.getItem(requiredInformation[i]) === undefined || sessionStorage.getItem(requiredInformation[i]) === null) {
            allInformationPopulated = false;
            askForInformation.push(requiredInformation[i]);
        }
    }
    if(allInformationPopulated) {
        loadedCallback(true);
        clearInterval(checkInformationInterval);
    }
    else {
        //Ask twice during the checks
        if(checkInformationRetries%10 == 0) {
            requestStatus(askForInformation);
        } 

        if(checkInformationInterval === undefined) {
            checkInformationInterval = setInterval(function() {
                checkInformationRetries++;
                checkInformation(loadedCallback);
            }, 100);
        }
        else if(checkInformationRetries > 20){
            checkInformationRetries = 0;
            clearInterval(checkInformationInterval);
            checkInformationInterval = undefined;
            loadedCallback(false);
        }
    }
}

//Detect if the user is holding a button
var buttonHeld = false;
var buttonHeldTimeout = undefined;
function pressHoldButton(buttonDown, callback, time=1000) {
    if(callback == undefined || callback == null) {
        buttonHeld = buttonDown;
        if(buttonHeld == false){clearTimeout(buttonHeldTimeout);}
    }
    else {
        buttonHeld = true;
        buttonHeldTimeout = setTimeout(function() {
            //Check if the button is still down
            if(buttonHeld == true) {callback();}
        }, time);
    }
}

//Change a internal page
function changeInnerPage(event, page) {
    for(var i = 0; i < document.getElementsByName("innerPage").length; i++) {
        if(document.getElementsByName("innerPage")[i].getAttribute("page").toLowerCase() == page.toLowerCase()) {
            document.getElementsByName("innerPage")[i].classList.remove("hidden");
        }
        else {
            document.getElementsByName("innerPage")[i].classList.add("hidden");
        }
    }

    for(var i = 0; i < document.getElementsByName("changeInnerPageButton").length; i++) {
        document.getElementsByName("changeInnerPageButton")[i].classList.remove("onColor");
        document.getElementsByName("changeInnerPageButton")[i].classList.add("offColor");
    }

    event.currentTarget.classList.remove("offColor");
    event.currentTarget.classList.add("onColor");
}