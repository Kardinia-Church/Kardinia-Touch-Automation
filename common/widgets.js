
/**
 * The widgets file containing all the widgets avaliabile to the HTML
 */

var widgets = {
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
                addRequiredInformation("atemMacros", requiredInformation);
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
                        var type = "";
                        if(keyerType == "downstream") {type = "atemDownstreamKeyers";}
                        else {type = "atemUpstreamKeyers";}
                        try{value = JSON.parse(sessionStorage.getItem(type))[parseInt(me)*10 + parseInt(keyer)];}catch(e){}

                        if(value !== undefined && value !== null) {
                            var json = {"command": type, "value": undefined};
                            if(buttonHeldDown == true) {
                                json.value = {"keyer": keyer, "me": me, "value": 0}
                                buttonHeldDown = false;
                            }
                            else {
                                json.value = {"keyer": keyer, "me": me, "value": !value.state};
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

                //Set button text
                var keyerType = button.getAttribute("keyerType");
                var keyer = button.getAttribute("keyer");
                var me = button.getAttribute("me");
                var displayMe = button.getAttribute("displayMeInName");
                if(keyerType == "downstream") {button.innerHTML = "DS";}
                else {button.innerHTML = "US";}
                button.innerHTML +=(parseInt(keyer) + 1);
                if(displayMe == "yes") {button.innerHTML += " ME" + (parseInt(me) + 1);}
            }
        },

        //Update the widget based on values
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
           var requestKeyers = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var keyerType = button.getAttribute("keyerType");
                var keyer = button.getAttribute("keyer");
                var me = button.getAttribute("me");
                
                //Set the colour based on if it's command is set to it's value
                var type = "";
                if(keyerType == "downstream") {type = "atemDownstreamKeyers";}
                else {type = "atemUpstreamKeyers";}
                var value = null;
                try{
                    value = JSON.parse(sessionStorage.getItem(type));
                    value = value[(parseInt(me)*10) + parseInt(keyer)];
                }catch(e){value = undefined;}

                if(value !== undefined && value !== null) {
                    if(value.state == true || value.state == 1) {
                        button.classList.remove("offColor");
                        button.classList.add("liveColor");
                    }
                    else {
                        button.classList.remove("liveColor");
                        button.classList.add("offColor");
                    }
                }
                else {
                    requestKeyers = true;
                }
           }

            //Add the command to the listener for incomplete data
            if(requestKeyers == true) {
                addRequiredInformation(type, requiredInformation);
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
        update: function(button, requiredInformation) {
            var atemProgramInputs = undefined;
            var inputs = undefined;
            try{atemProgramInputs = JSON.parse(sessionStorage.getItem("atemProgramInputs"));}catch(e){}
            try{inputs = JSON.parse(sessionStorage.getItem("atemInputs"));}catch(e){}

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
                    try{value = atemProgramInputs[me]["inputNumber"];}catch(e){}
                    if(value !== undefined) {
                        if(parseInt(input) == parseInt(value)) {
                            button.classList.remove("offColor");
                            button.classList.add("liveColor");
                        }
                        else {
                            button.classList.remove("liveColor");
                            button.classList.add("offColor");
                        }
                    }
                    else {
                        requestProgramInputs = true;
                    }
                }

                //Set the button text if known
                var name = null;

                switch(button.getAttribute("nameType")) {
                    default: {
                        try{name = inputs[input]["longName"];}catch(e){}
                        break;
                    }
                    case "short": {
                        try{name = inputs[input]["shortName"];}catch(e){}
                        break;
                    }
                    case "id" :{
                        name = input;
                        break;
                    }
                    case "none": {
                        name = button.innerHTML;
                        break;
                    }
                }   
            
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
                addRequiredInformation("atemInputs", requiredInformation);
            }
           
            //Add the command to the listener for incomplete data
            if(requestProgramInputs == true) {
                addRequiredInformation("atemProgramInputs", requiredInformation);
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
        update: function(button, requiredInformation) {
            var atemPreviewInputs = undefined;
            try{atemPreviewInputs = JSON.parse(sessionStorage.getItem("atemPreviewInputs"));}catch(e){}

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
                    try{value = atemPreviewInputs[me];}catch(e){}
                    if(value !== undefined) {
                        if(input == value) {
                            button.classList.remove("offColor");
                            button.classList.add("prevColor");
                        }
                        else {
                            button.classList.remove("prevColor");
                            button.classList.add("offColor");
                        }
                    }
                    else {
                        requestProgramInputs = true;
                    }
                }

                //Set the button text if known
                var name = null;
                switch(button.getAttribute("nameType")) {
                    default: {
                        try{name = JSON.parse(sessionStorage.getItem("atemInputs"))[input]["longName"];}catch(e){}
                        break;
                    }
                    case "short": {
                        try{name = JSON.parse(sessionStorage.getItem("atemInputs"))[input]["shortName"];}catch(e){}
                        break;
                    }
                    case "id" :{
                        name = input;
                        break;
                    }
                    case "none": {
                        name = button.innerHTML;
                        break;
                    }
                }  
            
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
                addRequiredInformation("atemInputs", requiredInformation);
            }
           
            //Add the command to the listener for incomplete data
            if(requestProgramInputs == true) {
                addRequiredInformation("atemPreviewInputs", requiredInformation);
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
                    var auxs = this.getAttribute("aux").replace(/\s/g, '').split(",");

                    var button = this;
                    //If the requied parameters are set
                    if(input !== undefined && input !== null && auxs !== undefined && auxs !== null) {
                        var ask = button.getAttribute("ask");
                        var askText = button.getAttribute("askText");
                        var passwordRequired = button.getAttribute("passwordRequired");

                        //Send for all set auxs
                        for(var key in auxs) {
                            var aux = auxs[key];

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
                        }
                    } else {console.error("There must be a input, and aux defined.", this);}
                }
            }
        },

        //Update the widget based on values
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
           var requestProgramInputs = false;
           var requestInputNames = false;
           for(var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                var input = button.getAttribute("input");
                var auxs = button.getAttribute("aux").replace(/\s/g, '').split(",");

                //If a reply is not required from this button skip it
                if(button.getAttribute("replyNotRequired") != "yes") {
                    //Set the colour based on if it's command is set to it's value
                    var value = undefined;
                    var isSame = true;
                    //Loop though the auxs and check if their the same
                    
                    for(var key in auxs) {
                        var aux = auxs[key];
                        try {
                            if(value === undefined) {
                                value = JSON.parse(sessionStorage.getItem("atemAuxInputs"))[aux]["inputNumber"];
                            }
                            else if(value != JSON.parse(sessionStorage.getItem("atemAuxInputs"))[aux]["inputNumber"]) {
                                isSame = false;
                            }
                        }
                        catch(e){}
                    }

                    if(value !== undefined) {
                        if(parseInt(input) == parseInt(value) && isSame == true) {
                            button.classList.remove("offColor");
                            button.classList.add("liveColor");
                        }
                        else {
                            button.classList.remove("liveColor");
                            button.classList.add("offColor");
                        }
                    }
                    else {
                        requestProgramInputs = true;
                    }
                }

                //Set the button text if known
                var name = null;
                try{name = JSON.parse(sessionStorage.getItem("atemInputs"))[input]["longName"];}catch(e){}
            
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
                addRequiredInformation("atemInputs", requiredInformation);
            }
           
            //Add the command to the listener for incomplete data
            if(requestProgramInputs == true) {
                addRequiredInformation("atemAuxInputs", requiredInformation);
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
        update: function(button, requiredInformation) {
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
                        addRequiredInformation(command, requiredInformation);
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
    
    "soundChannel": {
        //Set the widget
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

                var channels = section.getAttribute("channel");
                var channelName = section.getAttribute("channelName");
                var features = section.getAttribute("features").toLowerCase();
                var type = section.getAttribute("type");

                if(isValid(channels) && isValid(features) && isValid(type)) {
                    var channels = channels.replace(/ /g,'').split(",");
                    var features = features.replace(/ /g,'').split(",");
                    var generatedContent = "<section class='split' mode='all' showWhileLocked='no'>";

                    //Set the channel name
                    if(isValid(channelName)) {
                        generatedContent += "<h2>" + channelName + "</h2>";
                    }
                    else {
                        if(channels.length > 1) {
                            generatedContent += "<h2>Channels ";
                            for(var j = 0; j < channels.length; j++) {
                                generatedContent += channels[j] + ", ";
                            }
                            generatedContent = generatedContent.slice(0, generatedContent.length - 2);
                            generatedContent += "</h2>";
                        }
                        else {
                            generatedContent += "<h2>Channel " + channels[0] + "</h2>";
                        }
                    }

                    //Set features
                    generatedContent += "<aside class='split'>";
                    if(features.indexOf("bar") >= 0) {
                        generatedContent += "<aside class='volumeBar' style='background-color: #66ff66;'></aside>";
                        generatedContent += "<aside class='volumeBar' style='background-color:gray; margin-top: -39vh;'></aside>";
                    }
                    generatedContent += "</aside><aside class='split'>";

                    if(features.indexOf("plus") >= 0) {
                        if(type.toLowerCase() == "passive") { 
                            generatedContent += "<button name='commandButton' command='channel" + channels + "Volume' value='up' style='background-color: white' replyNotRequired='yes' flash='yes'>+</button>";
                        }
                        else {
                            generatedContent += "<button name='commandButton' command='channel" + channels + "Volume' style='background-color: white' value='invalid' flash='yes'>+</button>";
                        }     
                    }

                    if(features.indexOf("minus") >= 0) {
                        if(type.toLowerCase() == "passive") { 
                            generatedContent += "<button name='commandButton' command='channel" + channels + "Volume' style='background-color: white' value='down' replyNotRequired='yes' flash='yes'>-</button>";
                        }
                        else {
                            generatedContent += "<button name='commandButton' command='channel" + channels + "Volume' style='background-color: white' value='invalid' flash='yes'>-</button>";
                        }     
                    }

                    //Mute button
                    if(features.indexOf("mute") >= 0) {
                        if(type.toLowerCase() == "passive") {
                            generatedContent += "<button name='commandButton' command='channel" + channels + "Mute' value='toggle' replyNotRequired='yes' flash='yes'>Mute</button>";
                        }
                        else {
                            generatedContent += "<button name='toggleCommandButton' command='channel" + channels + "Mute' values='on, off' colors='white, #ED4337'>Mute</button>";
                        }
                    }
                    generatedContent += "</aside>";
                    
  
                    generatedContent += "</section>"
                    section.innerHTML = generatedContent;

                    //Set the internal widgets
                    setWidgets(section);
                }
                else {console.log("ERROR: soundChannel" + channels + " has invalid parameters and cannot be generated");}
            }
        },

        //Update the widget based on values
        update: function(section, requiredInformation) {
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

                
                var channels = section.getAttribute("channel");
                var features = section.getAttribute("features").toLowerCase();
                var type = section.getAttribute("type");

                var checkSoundLevel = false;
                if(isValid(channels) && isValid(features)) {
                    if(features.indexOf("plus") >= 0 || features.indexOf("minus") >= 0 || features.indexOf("bar") >= 0) {
                        if(type.toLowerCase() == "active") { 
                            if(isValid(sessionStorage.getItem("channel" + channels + "Volume")) == false) {
                                addRequiredInformation("channel" + channels + "Volume", requiredInformation);    
                            }
                            else {
                                var volumeBarHeightVH = 38;
                                var volume =  parseInt(sessionStorage.getItem("channel" + channels + "Volume"));
                                var volumeBar = section.getElementsByClassName("volumeBar")[1];
                                volumeBar.style.height = (37 * (100 - volume) / 100) + "vh";

                                //Update the plus and minus buttons
                                for(var button in section.getElementsByTagName("button")) {
                                    switch(section.getElementsByTagName("button")[button].innerHTML) {
                                        case "+": {
                                            var setVol = volume + 3;
                                            if(setVol > 100){setVol = 100;}
                                            if(setVol < 0){setVol = 0;}
                                            section.getElementsByTagName("button")[button].setAttribute("value", setVol);
                                            break;
                                        }
                                        case "-": {
                                            var setVol = volume - 3;
                                            if(setVol > 100){setVol = 100;}
                                            if(setVol < 0){setVol = 0;}
                                            section.getElementsByTagName("button")[button].setAttribute("value", setVol);
                                            break;
                                        }
                                    }
                                }
                            }
                        }     
                    }
                }
            }
        }
    },
    "projectorInformation": {
        //Set the widget
        set: function(element) {
            //If a array is passed add them. If one item is passed add it
            var elements = [];
            try {
                for(var i = 0; i < element.length; i++) {
                    elements.push(element[i]);
                }
            }
            catch(e){elements.push(element);}

            //Loop though all the buttons and add their actions
            for(var i = 0; i < elements.length; i++) {
                element = elements[i]; 
            }
        },

        //Update the widget
        update: function(element) {
            //If a array is passed add them. If one item is passed add it
            var elements = [];
            try {
                for(var i = 0; i < element.length; i++) {
                    elements.push(element[i]);
                }
            }
            catch(e){elements.push(element);}

            //Loop though all the buttons and add their actions
            for(var i = 0; i < elements.length; i++) {
                element = elements[i]; 
                var title = element.getAttribute("friendlyname") === null ? element.getAttribute("id") : element.getAttribute("friendlyname");
                var currHours = sessionStorage.getItem("projectorHours" + element.getAttribute("id"));
                var totalHours = sessionStorage.getItem("projectorTotalHours" + element.getAttribute("id"));

                element.innerHTML = "";
                element.innerHTML += "<h2>" + title + "</h2>";

                if(currHours !== null && totalHours !== null) {
                    if(parseInt(currHours) >= totalHours) {
                        element.innerHTML += "<h3 style='background-color: red'>Lamp Hours - " + currHours + "/" + totalHours + "</h3>";
                    }
                    else {
                        element.innerHTML += "<h3>Lamp Hours - " + currHours + "/" + totalHours + "</h3>";
                    }
                }
                else {
                    element.innerHTML += "<h3>Lamp Hours - Unknown";
                    addRequiredInformation("projectorHours" + element.getAttribute("id"), requiredInformation); 
                }
            }
        }
    },
}

//Load in our widgets
var widgetFiles = ["commandButton.js", "AC.js"];
for(var i in widgetFiles) {
    var script = document.createElement('script');
    script.setAttribute("type","text/javascript");
    script.onload = function(element) {
        console.log("Loaded widget " + element.path[0].src);
    };
    script.onerror = function(element) {
        console.log("Failed to load widget: " + element.path[0].src);
    }
    script.src = "../../uibuilder/common/widgets/" + widgetFiles[i];
    document.head.appendChild(script);
}