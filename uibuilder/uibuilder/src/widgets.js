
/**
 * The widgets file containing all the widgets avaliabile to the HTML
 * 
 * Version 1.0 Alpha
 */

var widgets = {
    "commandButton": {
        //Set the widget
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

        //Update the widget based on values
        update(button, requiredInformation) {
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
                    if(requiredInformation.includes(button.getAttribute("command")) == false && button.getAttribute("replyNotRequired") != "yes") {
                        requiredInformation.push(button.getAttribute("command"));
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
    },
    "changePageButton": {
        //Set the widget
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

                //When the button is clicked
                button.onclick = function (){
                    button = this;
                    if(button.getAttribute("passwordRequired") === "yes") {
                        showPassword(sessionStorage.getItem("password"), function(success, action) {
                            if(success == true) {
                                changePage(action);
                            }
                        }, button.getAttribute("page"));
                    }
                    else if(button.getAttribute("ask") === "yes") {
                        ask(button.getAttribute("askText"), function(success, action) {
                            if(success == true) {
                                changePage(action);
                            }
                        }, button.getAttribute("page"));
                    }
                    else {
                        changePage(button.getAttribute("page"));
                    }
                }
            }
        },

        //Update the widget
        update: function(button) {
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
                if(button.getAttribute("page") == sessionStorage.getItem("page")) {
                    button.classList.add("onColor");
                    button.classList.remove("offColor");
                }
                else {
                    button.classList.add("offColor");
                    button.classList.remove("onColor");
                }
            }
        }
    },

    "actionButton": {
        //Set the widget
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
                var process = function(success, action) {
                    if(success != true){return;}
                    try {                      
                        switch(action.toLowerCase()) {
                            case "lock": {
                                lock(true);
                                break;
                            }
                            case "unlock": {
                                lock(false);
                                break;
                            }
                            case "tempunlock": {
                                lock("temp");
                                break;
                            }
                            default: {
                                console.log(new Error("Misunderstood Button Action: " + action));
                            }
                        }
                    }catch(e){}
                }

                //When the button is clicked
                button.onclick = function (){
                    var button = this;
                    if(button.getAttribute("passwordRequired") === "yes") {
                        showPassword(sessionStorage.getItem("password"), process, button.getAttribute("action"));
                    }
                    else if(button.getAttribute("ask") === "yes") {
                        ask(button.getAttribute("askText"), process, button.getAttribute("action"));
                    }
                    else {
                        process(true, button.getAttribute("action"));
                        flashButton(button);   
                    }
                } 
            }
        },

        //Update the widget
        update: function(button) {
        }
    },

    "macroButton": {
        //Set the widget
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
                    var macro = this.getAttribute("macro");
                    var button = this;
            
                    //If the requied parameters are set
                    if(macro !== undefined && macro !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");
            
                        //If we should ask before performing a command
                        if(passwordRequired == "yes") {
                            sendRequest({"command": "atemMacroAction", "value": {"macroId": macro, "type": "run"}}, true);
                        }
                        else if(ask == "yes") {
                            sendRequest({"command": "atemMacroAction", "value": {"macroId": macro, "type": "run"}}, false, true, askText);
                        }
                        else {
                            sendRequest({"command": "atemMacroAction", "value": {"macroId": macro, "type": "run"}});
                        }
            
                        if(button.getAttribute("flash") != "no") {
                            flashButton(button);
                        }
                    }
                }
            }
        },

        //Update the widget based on values
        update(button, requiredInformation) {
           //If a array is passed add them. If one item is passed add it
           var buttons = [];
           try {
               for(var i = 0; i < button.length; i++) {
                   buttons.push(button[i]);
               }
           }
           catch(e){buttons.push(button);}


           //Loop though all the buttons and update them
           var requestMacroNames = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var macro = button.getAttribute("macro");
                var macroName = null;
                try{macroName = JSON.parse(sessionStorage.getItem("atemMacros"))[macro]["name"];}catch(e){}
            
                //Set the button text to the macro name
                if(macroName === null) {
                    button.innerHTML = "Macro " + macro;
                    requestMacroNames = true;
                }
                else {
                    button.innerHTML = macroName;
                }
           }

            //Add the command to the listener for incomplete data
            if(requestMacroNames == true) {
                requiredInformation.push("atemMacros");
            }
        }
    },

    "keyerButton": {
        //Set the widget
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
                var buttonHeldDown = false;

                //If the user holds the button set the value to its first default value
                button.onmousedown = function() {
                    button = this;
                    pressHoldButton(true, function() {
                        buttonHeldDown = true;
                        flashButton(button, 500);
                    });
                }

                button.onmouseup = function() {
                    pressHoldButton(false);
                }

                button.onclick = function() {
                    //When clicked send the command
                    var keyerType = this.getAttribute("keyerType");
                    var keyer = this.getAttribute("keyer");
                    var me = this.getAttribute("me");
                    var button = this;
            
                    //If the requied parameters are set
                    if(keyerType !== undefined && keyerType !== null || keyer !== undefined && keyer !== null || me !== undefined && me !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");
                        var value = undefined;
                        try{value = JSON.parse(sessionStorage.getItem("atemKeyers"))[keyerType][me][keyer];}catch(e){}
                        var json = {"command": "atemKeyers", "value": undefined};
                        if(buttonHeldDown == true) {
                            json.value = {"keyerType":keyerType, "keyer": keyer, "me": me, "value": 0}
                            buttonHeldDown = false;
                        }
                        else {
                            json.value = {"keyerType":keyerType, "keyer": keyer, "me": me, "value": !value};
                        }

                        if(json.value.value != undefined && json.value.value != null) {
                            //If we should ask before performing a command
                            if(passwordRequired == "yes") {
                                sendRequest(json, true);
                            }
                            else if(ask == "yes") {
                                sendRequest(json, false, true, askText);
                            }
                            else {
                                sendRequest(json);
                            }
                        }
                        else {
                            displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                            requestStatus("atemKeyers");
                        }
                    }
                }
            }
        },

        //Update the widget based on values
        update(button, requiredInformation) {
           //If a array is passed add them. If one item is passed add it
           var buttons = [];
           try {
               for(var i = 0; i < button.length; i++) {
                   buttons.push(button[i]);
               }
           }
           catch(e){buttons.push(button);}


           //Loop though all the buttons and update them
           var requestKeyers = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var keyerType = button.getAttribute("keyerType");
                var keyer = button.getAttribute("keyer");
                var me = button.getAttribute("me");
                
                //Set the colour based on if it's command is set to it's value
                var value = JSON.parse(sessionStorage.getItem("atemKeyers"));
                try{value = value[keyerType][me][keyer];}catch(e){value = undefined;}
                if(value !== undefined && value !== null) {
                    if(value == true || value == 1) {
                        button.classList.remove("offColor");
                        button.classList.add("onColor");
                    }
                    else {
                        button.classList.remove("onColor");
                        button.classList.add("offColor");
                    }
                }
                else {
                    requestKeyers = true;
                }
           }

            //Add the command to the listener for incomplete data
            if(requestKeyers == true) {
                requiredInformation.push("atemKeyers");
            }
        }
    },

    "programInputButton": {
        //Set the widget
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
                    var input = this.getAttribute("input");
                    var me = this.getAttribute("me");
                    var button = this;
                    //If the requied parameters are set
                    if(input !== undefined && input !== null && me !== undefined && me !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");
            
                        //If we should ask before performing a command
                        if(passwordRequired == "yes") {
                            sendRequest({"command": "atemProgramInputs", "value": {"meId": me, "inputId": input}}, true);
                        }
                        else if(ask == "yes") {
                            sendRequest({"command": "atemProgramInputs", "value": {"meId": me, "inputId": input}}, false, true, askText);
                        }
                        else {
                            sendRequest({"command": "atemProgramInputs", "value": {"meId": me, "inputId": input}});
                        }
                    } else {console.error("There must be a input, and me defined.", this);}
                }
            }
        },

        //Update the widget based on values
        update(button, requiredInformation) {
           //If a array is passed add them. If one item is passed add it
           var buttons = [];
           try {
               for(var i = 0; i < button.length; i++) {
                   buttons.push(button[i]);
               }
           }
           catch(e){buttons.push(button);}


           //Loop though all the buttons and update them
           var requestProgramInputs = false;
           var requestInputNames = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var input = button.getAttribute("input");
                var me = button.getAttribute("me");

                //If a reply is not required from this button skip it
                if(button.getAttribute("replyNotRequired") != "yes") {
                    //Set the colour based on if it's command is set to it's value
                    var value = undefined;
                    try{value = JSON.parse(sessionStorage.getItem("atemProgramInputs"))[me];}catch(e){}
                    if(value !== undefined) {
                        if(input == value) {
                            button.classList.remove("offColor");
                            button.classList.add("onColor");
                        }
                        else {
                            button.classList.remove("onColor");
                            button.classList.add("offColor");
                        }
                    }
                    else {
                        requestProgramInputs = true;
                    }
                }

                //Set the button text if known
                var name = null;
                try{name = JSON.parse(sessionStorage.getItem("atemInputs"))[input]["name"];}catch(e){}
            
                //Set the button text to the macro name
                if(name === null) {
                    button.innerHTML = "Input " + input;
                    requestInputNames = true;
                }
                else {
                    button.innerHTML = name;
                }
            }

            //Add the command to the listener for incomplete data
            if(requestInputNames == true) {
                requiredInformation.push("atemInputs");
            }
           
            //Add the command to the listener for incomplete data
            if(requestProgramInputs == true) {
                requiredInformation.push("atemProgramInputs");
            }
        }
    },

    "previewInputButton": {
        //Set the widget
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
                    var input = this.getAttribute("input");
                    var me = this.getAttribute("me");
                    var button = this;
                    //If the requied parameters are set
                    if(input !== undefined && input !== null && me !== undefined && me !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");
            
                        //If we should ask before performing a command
                        if(passwordRequired == "yes") {
                            sendRequest({"command": "atemPreviewInputs", "value": {"meId": me, "inputId": input}}, true);
                        }
                        else if(ask == "yes") {
                            sendRequest({"command": "atemPreviewInputs", "value": {"meId": me, "inputId": input}}, false, true, askText);
                        }
                        else {
                            sendRequest({"command": "atemPreviewInputs", "value": {"meId": me, "inputId": input}});
                        }
                    } else {console.error("There must be a input, and me defined.", this);}
                }
            }
        },

        //Update the widget based on values
        update(button, requiredInformation) {
           //If a array is passed add them. If one item is passed add it
           var buttons = [];
           try {
               for(var i = 0; i < button.length; i++) {
                   buttons.push(button[i]);
               }
           }
           catch(e){buttons.push(button);}


           //Loop though all the buttons and update them
           var requestProgramInputs = false;
           var requestInputNames = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var input = button.getAttribute("input");
                var me = button.getAttribute("me");

                //If a reply is not required from this button skip it
                if(button.getAttribute("replyNotRequired") != "yes") {
                    //Set the colour based on if it's command is set to it's value
                    var value = undefined;
                    try{value = JSON.parse(sessionStorage.getItem("atemPreviewInputs"))[me];}catch(e){}
                    if(value !== undefined) {
                        if(input == value) {
                            button.classList.remove("offColor");
                            button.classList.add("onColor");
                        }
                        else {
                            button.classList.remove("onColor");
                            button.classList.add("offColor");
                        }
                    }
                    else {
                        requestProgramInputs = true;
                    }
                }

                //Set the button text if known
                var name = null;
                try{name = JSON.parse(sessionStorage.getItem("atemInputs"))[input]["name"];}catch(e){}
            
                //Set the button text to the macro name
                if(name === null) {
                    button.innerHTML = "Input " + input;
                    requestInputNames = true;
                }
                else {
                    button.innerHTML = name;
                }
            }

            //Add the command to the listener for incomplete data
            if(requestInputNames == true) {
                requiredInformation.push("atemInputs");
            }
           
            //Add the command to the listener for incomplete data
            if(requestProgramInputs == true) {
                requiredInformation.push("atemPreviewInputs");
            }
        }
    },

    "auxInputButton": {
        //Set the widget
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
                    var input = this.getAttribute("input");
                    var aux = this.getAttribute("aux");
                    var button = this;
                    //If the requied parameters are set
                    if(input !== undefined && input !== null && aux !== undefined && aux !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");
            
                        //If we should ask before performing a command
                        if(passwordRequired == "yes") {
                            sendRequest({"command": "atemAuxInput", "value": {"auxId": aux, "inputId": input}}, true);
                        }
                        else if(ask == "yes") {
                            sendRequest({"command": "atemAuxInput", "value": {"auxId": aux, "inputId": input}}, false, true, askText);
                        }
                        else {
                            sendRequest({"command": "atemAuxInput", "value": {"auxId": aux, "inputId": input}});
                        }
                    } else {console.error("There must be a input, and aux defined.", this);}
                }
            }
        },

        //Update the widget based on values
        update(button, requiredInformation) {
           //If a array is passed add them. If one item is passed add it
           var buttons = [];
           try {
               for(var i = 0; i < button.length; i++) {
                   buttons.push(button[i]);
               }
           }
           catch(e){buttons.push(button);}


           //Loop though all the buttons and update them
           var requestProgramInputs = false;
           var requestInputNames = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var input = button.getAttribute("input");
                var aux = button.getAttribute("aux");

                //If a reply is not required from this button skip it
                if(button.getAttribute("replyNotRequired") != "yes") {
                    //Set the colour based on if it's command is set to it's value
                    var value = undefined;
                    try{value = JSON.parse(sessionStorage.getItem("atemAuxInputs"))[aux];}catch(e){}
                    if(value !== undefined) {
                        if(input == value["inputId"]) {
                            button.classList.remove("offColor");
                            button.classList.add("onColor");
                        }
                        else {
                            button.classList.remove("onColor");
                            button.classList.add("offColor");
                        }
                    }
                    else {
                        requestProgramInputs = true;
                    }
                }

                //Set the button text if known
                var name = null;
                try{name = JSON.parse(sessionStorage.getItem("atemInputs"))[input]["name"];}catch(e){}
            
                //Set the button text to the macro name
                if(name === null) {
                    button.innerHTML = "Input " + input;
                    requestInputNames = true;
                }
                else {
                    button.innerHTML = name;
                }
            }

            //Add the command to the listener for incomplete data
            if(requestInputNames == true) {
                requiredInformation.push("atemInputs");
            }
           
            //Add the command to the listener for incomplete data
            if(requestProgramInputs == true) {
                requiredInformation.push("atemAuxInputs");
            }
        }
    },

    "toggleCommandButton": {
        //Set the widget
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
                var buttonHeldDown = false;

                //If the user holds the button set the value to its first default value
                button.onmousedown = function() {
                    button = this;
                    pressHoldButton(true, function() {
                        buttonHeldDown = true;
                        flashButton(button, 500);
                    });
                }

                button.onmouseup = function() {
                    pressHoldButton(false);
                }

                button.onclick = function() {
                    button = this;

                    //When clicked send the command
                    var command = button.getAttribute("command");
                    var values = button.getAttribute("values");
                    var colors = button.getAttribute("colors");
            
                    //If the requied parameters are set
                    if(command !== undefined && command !== null && values !== undefined && values !== null && colors !== undefined && colors !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");
                        values = values.replace(/\s/g,'').split(",");
                        colors = colors.replace(/\s/g,'').split(",");
                        var json = {
                            "command": command,
                            "value": undefined
                        };

                        var error = false;
                        if(buttonHeldDown == false) {
                            //Decide what we should send
                            var currentValue = sessionStorage.getItem(command);
                            if(currentValue == undefined || currentValue == null) {
                                displayInformation("Sorry could not do that because it's current state is unknown. Please try again", "warning");
                                requestStatus(command);
                                error = true;
                            }
                            else {
                                //Search for the current index
                                var currentIndex = -1;
                                for(var j = 0; j < values.length; j++) {
                                    if(values[j] == currentValue) {
                                        currentIndex = j;
                                        break;
                                    }
                                }
                                if(currentIndex == -1) {
                                    displayInformation("Sorry could not do that because the current state is not understood. Please try again", "error");
                                    requestStatus(command);
                                    error = true;
                                }
                                else {
                                    //The current value is defined increment it!
                                    if(currentIndex + 1 >= values.length) {currentIndex = -1;}
                                    json.value = values[currentIndex + 1];
                                }
                            }
                        }
                        else {
                            json.value = values[0];
                            buttonHeldDown = false;
                        }
                    
                        //If there was no error send it!
                        if(error == false) {
                            if(passwordRequired == "yes") {
                                sendRequest(json, true);
                            }
                            else if(ask == "yes") {
                                sendRequest(json, false, true, askText);
                            }
                            else {
                                sendRequest(json);
                            }
                        }
                    }
                }
            }
        },

        //Update the widget based on values
        update(button, requiredInformation) {
           //If a array is passed add them. If one item is passed add it
           var buttons = [];
           try {
               for(var i = 0; i < button.length; i++) {
                   buttons.push(button[i]);
               }
           }
           catch(e){buttons.push(button);}

            //Loop though all the buttons and set their colours
            for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var command = button.getAttribute("command");
                var values = button.getAttribute("values");
                var colors = button.getAttribute("colors");
        
                //If the requied parameters are set
                if(command !== undefined && command !== null && values !== undefined && values !== null && colors !== undefined && colors !== null) {
                    values = values.replace(/\s/g,'').split(",");
                    colors = colors.replace(/\s/g,'').split(",");
                    var currentValue = sessionStorage.getItem(command);
                    if(currentValue == undefined || currentValue == null) {
                        requiredInformation.push(command);
                    }
                    else {
                        //Find the index
                        var index = 0;
                        for(var j = 0; j < values.length; j++) {
                            if(values[j] == currentValue) {
                                index = j;
                                break;
                            }
                        }
                        button.style.backgroundColor = colors[index];
                    }
                }
            }
        }
    },
}