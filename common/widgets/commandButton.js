/**
 * Command Button
 * Performs a command when the button is pressed
 */

widgets["commandButton"] = {
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
                //When clicked send the command
                var command = this.getAttribute("command");
                var value = this.getAttribute("value");
                var button = this;

                //If the requied parameters are set
                if(command !== undefined && command !== null && value !== undefined && value !== null) {
                    var ask = button.getAttribute("ask");
                    var askText = button.getAttribute("askText");
                    var passwordRequired = button.getAttribute("passwordRequired");

                    //If we should ask before performing a command
                    if(passwordRequired == "yes") {
                        sendRequest({"command": command, "value": value}, true);
                    }
                    else if(ask == "yes") {
                        sendRequest({"command": command, "value": value}, false, true, askText);
                    }
                    else {
                        sendRequest({"command": command, "value": value});
                    }

                    if(button.getAttribute("flash") == "yes") {
                        flashButton(button);
                    }
                }
            }
        }
    },
    update: function(button, requiredInformation) {
        //If a array is passed add them. If one item is passed add it
        var buttons = [];
        try {
            for(var i = 0; i < button.length; i++) {
                buttons.push(button[i]);
            }
        }
        catch(e){buttons.push(button);}


        //Loop though all the buttons and update them
        for(var i = 0; i < buttons.length; i++) {
            button = buttons[i];

            //If a reply is not required from this button skip it
            if(button.getAttribute("replyNotRequired") != "yes") {
                //Add the command to the listener for incomplete data
                if(button.getAttribute("replyNotRequired") != "yes") {
                    addRequiredInformation(button.getAttribute("command"), requiredInformation);
                }

                //Set the colour based on if it's command is set to it's value
                var value = sessionStorage.getItem(button.getAttribute("command"));
                if(button.getAttribute("value") == value) {
                    button.classList.remove("offColor");
                    button.classList.add("onColor");
                }
                else {
                    button.classList.remove("onColor");
                    button.classList.add("offColor");
                }
            }
        }
    }
};