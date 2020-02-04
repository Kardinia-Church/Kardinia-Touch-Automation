function checkVersion() {
    //Global script
    try{console.log("Global script version: " + globalScriptVersion);}
    catch(e){console.log("ERROR: Global script is missing!");}

    //Widgets script
    try{console.log("Widgets version: " + widgetsVersion);}
    catch(e){console.log("ERROR: Widgets is missing!");}

    //Utility script
    try{console.log("Utility version: " + utilityVersion);}
    catch(e){console.log("ERROR: Utility is missing!");}

    //Internal script
    try{console.log("Internal script version: " + internalScriptVersion);}
    catch(e){console.log("ERROR: Internal script is missing!");}
}

function getVersion() {
    
}