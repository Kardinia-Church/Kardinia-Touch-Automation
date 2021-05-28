/**
 * Command Button
 * Performs a command when the button is pressed
 */

 widgets["acControl"] = {
    set: function(section) {
        //If a array is passed add them. If one item is passed add it
        var sections = [];
        try {
            for(var i = 0; i < section.length; i++) {
                sections.push(section[i]);
            }
        }
        catch(e){sections.push(section);}

        //Loop though all the sections and generate them adding their actions
        for(var i = 0; i < sections.length; i++) {
            section = sections[i];
            var acName = section.getAttribute("acName");
            var acTitle = section.getAttribute("acTitle");
            var acFeatures = section.getAttribute("features").toLowerCase();
            var clearOnRefresh = section.getAttribute("clearOnRefresh").toLowerCase();

            if(acName !== undefined && acName !== null && acFeatures !== undefined && acFeatures !== null) {
                //AC is valid generate it
                acFeatures = acFeatures.split(" ");
                if(acFeatures.length <= 0) {console.log("ERROR: AC " + acName + " has no features so it was not added");}
                else {
                    var title =  acName.charAt(0).toUpperCase() + acName.slice(1).toLowerCase();
                    if(acTitle !== undefined && acTitle !== null){title = acTitle;}

                    section.innerHTML += "<h2>" + title + "</h2>";
                    if(acFeatures.indexOf("temp") != -1) {
                        section.innerHTML += "<h1 name='acValue' clearOnRefresh='" + clearOnRefresh + "' acname='" + acName + "' type='temp'>--</h1>";
                    }
                    if(acFeatures.indexOf("power") != -1) {
                        section.innerHTML += "<button name='acAction' action='power' value='toggle' acname='" + acName + "'>Power</button>";
                    }
                    
                   var tableHTML = "";

                    //Add the ac features
                    for(var j = 0; j < acFeatures.length; j++) {
                        switch(acFeatures[j]) {
                            case "settemp": {
                                tableHTML += "<aside class='splitVert'>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><button name='acAction' action='setTemp' value='down' acname='" + acName + "'>-</button></aside>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><h3>Temperature</h3><h2 name='acValue' type='setTemp' acName='" + acName + "'>--</h2></aside>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><button name='acAction' action='setTemp' value='up' acname='" + acName + "'>+</button></aside>";
                                tableHTML += "</aside>";
                                break;
                            }
                            case "mode": {
                                tableHTML += "<aside class='splitVert'>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><button name='acAction' action='setMode' value='down' acname='" + acName + "'><i class='fas fa-arrow-left'></i></button></aside>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><h3>Mode</h3><h2 name='acValue' type='mode' acName='" + acName + "'>--</h2></aside>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><button name='acAction' action='setMode' value='up' acname='" + acName + "'><i class='fas fa-arrow-right'></i></button></aside>";
                                tableHTML += "</aside>";
                                break;
                            }
                            case "fan": {
                                tableHTML += "<aside class='splitVert'>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><button name='acAction' action='setFan' value='down' acname='" + acName + "'><i class='fas fa-arrow-left'></i></button></aside>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><h3>Fan</h3><h2 name='acValue' type='fan' acName='" + acName + "'>--</h2></aside>";
                                tableHTML += "<aside class='split' style='width: calc(32%)'><button name='acAction' action='setFan' value='up' acname='" + acName + "'><i class='fas fa-arrow-right'></i></button></aside>";
                                tableHTML += "</aside>";
                                break;
                            }
                        }
                    }
                }

                section.innerHTML += tableHTML;
            }
        }
    },
    update: function(section, requiredInformation) {
        //If a array is passed add them. If one item is passed add it
        var sections = [];
        try {
            for(var i = 0; i < section.length; i++) {
                sections.push(section[i]);
            }
        }
        catch(e){sections.push(section);}
    }
};

widgets["acAction"] = {
    set: function(button) {
        //If a array is passed add them. If one item is passed add it
        var buttons = [];
        try {
            for(var i = 0; i < button.length; i++) {
                buttons.push(button[i]);
            }
        }
        catch(e){buttons.push(button);}

        //Loop though all the buttons and add their actions
        for(var i = 0; i < buttons.length; i++) {
            button = buttons[i];
            button.onclick = function() {
                // //When clicked send the command
                var button = this;

                var action = button.getAttribute("action");
                var value = button.getAttribute("value");
                var acName = button.getAttribute("acname");

                if(action !== undefined && action !== null && value !== undefined && value !== null && acName !== undefined && acName !== null) {
                    var acNames = acName.split(" ");
                    
                    var ask = button.getAttribute("ask");
                    var askText = button.getAttribute("askText");
                    var passwordRequired = button.getAttribute("passwordRequired");
                    var request = [];

                    //Generate command
                    for(var j = 0; j < acNames.length; j++) {
                        if(action.split(" ").length == value.split(" ").length) {
                            for(var k = 0; k < action.split(" ").length; k++) {
                                var req = {
                                    "command": "acAction",
                                    "value": {
                                        "acName": acNames[j],
                                        "action": action.split(" ")[k],
                                        "value": undefined
                                    }
                                }

                                //Decide the action based
                                switch(action.split(" ")[k]){ 
                                    case "power": {
                                        if(value.split(" ")[k] == "toggle") {
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));
                                                if(acs[acNames[j]].power == "on" || acs[acNames[j]].power == true) {
                                                    req.value.value = "off";
                                                }
                                                else {
                                                    req.value.value = "on";
                                                }
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else {
                                            req.value.value = value.split(" ")[k];
                                        }
                                        break;
                                    }
                                    case "setTemp": {
                                        //Attempt to increment the temp by 1
                                        if(value.split(" ")[k] == "up") {
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));
                                                req.value.value = parseInt(acs[acNames[j]].setTemp) + 1;
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else if(value.split(" ")[k] == "down") {
                                            //Attempt to lower the temp by 1
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));
                                                req.value.value = parseInt(acs[acNames[j]].setTemp) - 1;
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else {
                                            req.value.value = value.split(" ")[k];
                                        }
                                        break;
                                    }
                                    case "setMode": {
                                        //Attempt to increment the mode
                                        if(value.split(" ")[k] == "up") {
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));

                                                //Attempt to find the current mode
                                                for(var l = 0; l < acs[acNames[j]].features.modes.length; l++) {
                                                    if(acs[acNames[j]].features.modes[l] == acs[acNames[j]].mode) {
                                                        if(l >= acs[acNames[j]].features.modes.length - 1) {l = -1;}
                                                        req.value.value = acs[acNames[j]].features.modes[l + 1];
                                                        break;
                                                    }
                                                }
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else if(value.split(" ")[k] == "down") {
                                            //Attempt to lower the mode
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));

                                                //Attempt to find the current mode
                                                for(var l = 0; l < acs[acNames[j]].features.modes.length; l++) {
                                                    if(acs[acNames[j]].features.modes[l] == acs[acNames[j]].mode) {
                                                        if(l - 1 < 0) {l = acs[acNames[j]].features.modes.length;}
                                                        req.value.value = acs[acNames[j]].features.modes[l - 1];
                                                        break;
                                                    }
                                                }
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else {
                                            req.value.value = value.split(" ")[k];
                                        }
                                        break;
                                    }
                                    case "setFan": {
                                        //Attempt to increment the mode
                                        if(value.split(" ")[k] == "up") {
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));

                                                //Attempt to find the current mode
                                                for(var l = 0; l < acs[acNames[j]].features.fans.length; l++) {
                                                    if(acs[acNames[j]].features.fans[l] == acs[acNames[j]].fan) {
                                                        if(l >= acs[acNames[j]].features.fans.length - 1) {l = -1;}
                                                        req.value.value = acs[acNames[j]].features.fans[l + 1];
                                                        break;
                                                    }
                                                }
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else if(value.split(" ")[k] == "down") {
                                            //Attempt to lower the mode
                                            var acs;
                                            try {
                                                acs = JSON.parse(sessionStorage.getItem("acValues"));

                                                //Attempt to find the current mode
                                                for(var l = 0; l < acs[acNames[j]].features.fans.length; l++) {
                                                    if(acs[acNames[j]].features.fans[l] == acs[acNames[j]].fan) {
                                                        if(l - 1 < 0) {l = acs[acNames[j]].features.fans.length;}
                                                        req.value.value = acs[acNames[j]].features.fans[l - 1];
                                                        break;
                                                    }
                                                }
                                            }
                                            catch(e) {
                                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                                requestStatus("acValues");
                                            }
                                        }
                                        else {
                                            req.value.value = value.split(" ")[k];
                                        }
                                        break;
                                    }
                                    default: {
                                        req.value.value = value.split(" ")[k];
                                        break;
                                    }
                                }

                                request.push(req);
                            }
                        }
                        else{console.log("Error: Invalid AC action, the actions and values need to line up");}
                    }

                    if(passwordRequired == "yes") {
                        sendRequest(request, true);
                    }
                    else if(ask == "yes") {
                        sendRequest(request, false, true, askText);
                    }
                    else {
                        sendRequest(request);
                    }
                }

                //Should the button flash?
                if(button.getAttribute("flash") != "no") {
                    flashButton(button);
                }
            }
        }
    },
    update: function(section, requiredInformation) {}
};

widgets["acValue"] = {
    set: function(element) {
        //If a array is passed add them. If one item is passed add it
        var elements = [];
        try {
            for(var i = 0; i < element.length; i++) {
                elements.push(element[i]);
            }
        }
        catch(e){elements.push(element);}

        //Set default values
        for(var i = 0; i < elements.length; i++) {
            var acName = elements[i].getAttribute("acname");
            var type = elements[i].getAttribute("type");

            if(acName !== undefined && acName !== null && type !== undefined && type !== null) { 
                elements[i].innerHTML = "-";
            }

            //If the clearOnRefresh flag is set clear the memory for this ac
            if(elements[i].getAttribute("clearOnRefresh") == "yes") {
                if(sessionStorage.getItem("acValues") !== undefined && sessionStorage.getItem("acValues") !== null) {
                    //var acs = JSON.parse(sessionStorage.getItem("acValues"));
                    //delete acs[acName];
                    //sessionStorage.setItem("acValues", JSON.stringify(acs));
                    sessionStorage.removeItem("acValues"); //A bit of a hack all ACs will need to be re-requested but it'll take too long to implement
                }
            }
        }
    },
    update: function(element, requiredInformation) {
        //If a array is passed add them. If one item is passed add it
        var elements = [];
        try {
            for(var i = 0; i < element.length; i++) {
                elements.push(element[i]);
            }
        }
        catch(e){elements.push(element);}

        //Set default values
        for(var i = 0; i < elements.length; i++) {
            var acName = elements[i].getAttribute("acname");
            var type = elements[i].getAttribute("type");

            if(acName !== undefined && acName !== null && type !== undefined && type !== null) {

                //Attempt to get the values from storage
                var acs = undefined;
                var temp = "-";
                var setTemp = "-";
                var mode = "-";
                var fan = "-";
                var power = "-";
                try{
                    acs = JSON.parse(sessionStorage.getItem("acValues"));
                    if(acName.split(" ").length > 1) {
                        //Loop though all the acs and check if the values are the same and set the value accordingly
                        var isSame = true;
                        var avgValue = 0;

                        //Temp
                        avgValue = 0;
                        for(var j = 0; j < acName.split(" ").length; j++) {
                            avgValue += acs[acName.split(" ")[j]].temp;
                        }
                        temp = (avgValue / acName.split(" ").length);  

                        //Set temp
                        isSame = true;
                        for(var j = 1; j < acName.split(" ").length; j++) {
                            if(acs[acName.split(" ")[j - 1]].setTemp != acs[acName.split(" ")[j]].setTemp){isSame = false; break;}
                        }
                        if(isSame == true){setTemp = acs[acName.split(" ")[j - 1]].setTemp;}else{setTemp = "~";}
                        
                        //Mode
                        isSame = true;
                        for(var j = 1; j < acName.split(" ").length; j++) {
                            if(acs[acName.split(" ")[j - 1]].mode != acs[acName.split(" ")[j]].mode){isSame = false; break;}
                        }
                        if(isSame == true){mode = acs[acName.split(" ")[j - 1]].mode;}else{mode = "Varies";}
                        
                        //Fan
                        isSame = true;
                        for(var j = 1; j < acName.split(" ").length; j++) {
                            if(acs[acName.split(" ")[j - 1]].fan != acs[acName.split(" ")[j]].fan){isSame = false; break;}
                        }
                        if(isSame == true){fan = acs[acName.split(" ")[j - 1]].fan;}else{fan = "Varies";}
                        
                    }
                    else {
                        //We only have one ac just set the values
                        temp = acs[acName.split(" ")].temp;
                        setTemp = acs[acName.split(" ")].setTemp;
                        mode = acs[acName.split(" ")].mode;
                        fan = acs[acName.split(" ")].fan;
                        power = acs[acName.split(" ")].power;
                    }
                }
                catch(e){addRequiredInformation("acValues", requiredInformation);};

                
                switch(type.toLowerCase()) {
                    case "temp": {
                        if(temp != "-") {
                            elements[i].innerHTML = temp + "&#176;C";
                        } else {elements[i].innerHTML = "-";}
                        if(power == "off") {
                            elements[i].innerHTML = "Off";
                        }
                        break;
                    }
                    case "settemp": {
                        if(setTemp != "-") {
                            elements[i].innerHTML = setTemp + "&#176;C";
                        } else {elements[i].innerHTML = "-";}
                        if(power == "off") {
                            elements[i].innerHTML = "-";
                        }
                        break;
                    }
                    case "mode": {
                        if(mode != "-") {
                            elements[i].innerHTML = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
                        } else {elements[i].innerHTML = "-";}
                        if(power == "off") {
                            elements[i].innerHTML = "-";
                        }
                        break;
                    }
                    case "fan": {
                        if(fan != "-") {
                            elements[i].innerHTML = fan.charAt(0).toUpperCase() + fan.slice(1).toLowerCase();
                        } else {elements[i].innerHTML = "-";}
                        if(power == "off") {
                            elements[i].innerHTML = "-";
                        }
                        break;
                    }
                    case "power": {
                        if(power != "-") {
                            elements[i].innerHTML = power.charAt(0).toUpperCase() + power.slice(1).toLowerCase();
                        } else {elements[i].innerHTML = "-";}
                        break;
                    }
                }
            }
        }
    }
};
