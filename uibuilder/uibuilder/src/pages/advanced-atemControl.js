window.onload = function() {
    var programMEs = sessionStorage.getItem("atemProgramInputs");
    var previewMEs = sessionStorage.getItem("atemPreviewInputs");
    var auxInputs = sessionStorage.getItem("atemAuxInputs");
    var keyers = sessionStorage.getItem("atemKeyers");
    var inputs = sessionStorage.getItem("atemInputs"); 
    var html = "";

    try {
        programMEs = JSON.parse(programMEs);
        previewMEs = JSON.parse(previewMEs);
        auxInputs = JSON.parse(auxInputs);
        keyers = JSON.parse(keyers);
        inputs = JSON.parse(inputs);

        //Draw the MEs
        var programMELength = -1;
        var previewMELength = -1;
        for(var key in programMEs) {programMELength++;}
        for(var key in previewMEs) {previewMELength++;}
        var meLength = previewMELength;
        if(programMELength > previewMELength){meLength = programMELength;}

        //Add the pages for each ME
        for(var i = 0; i <= meLength; i++) {
            html += "<div id='" + i + "' class='tabcontent' style='display: none'><div></div>";
            
            //Add the program buttons
            for(var key in inputs) {
                html += "<button name='programInputButton' me='" + i + "' input='" + key + "'>" + inputs[key].name + "</button>";
            }

            //Add the preview buttons
            for(var key in inputs) {
                html += "<button name='previewInputButton' me='" + i + "' input='" + key + "'>" + inputs[key].name + "</button>";
            }




            html += "</div>"
        }




        //Add the ME selection buttons
        html += "<div class='tab'>";
        for(var i = 0; i <= meLength; i++) {
            html += "<button id='button" + i + "' class='tablinks' onclick='changeME(event, " + i + ")'>ME " + (parseInt(i)  + 1) + "</button>";       
        }
        html += "</div>";








        if(programMELength == -1 && previewMELength == -1){throw "missing MEs";}
        document.getElementById("generatedAtemSwitcherContent").innerHTML = html;
        document.getElementById("0").style.display = "block";
        document.getElementById("button0").className += " active";
        setWidgets();
        loadComplete();
    }
    catch(e) {
        console.log(e);
        setTimeout(function() {
            requestStatus(["atemProgramInputs", "atemPreviewInputs", "atemAuxInputs", "atemKeyers", "atemInputs"]);
            location.reload();
        }, 1000);
    }
}

//Change the selected ME
function changeME(evt, me) {
    me = me.toString();
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(me).style.display = "block";
    evt.currentTarget.className += " active";
  }