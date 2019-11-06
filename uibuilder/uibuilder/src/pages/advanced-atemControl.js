window.onload = function() {
    var programMEs = sessionStorage.getItem("atemProgramInputs");
    var downstreamKeyers = sessionStorage.getItem("atemDownstreamKeyers");
    var upstreamKeyers = sessionStorage.getItem("atemUpstreamKeyers");
    var auxInputs = sessionStorage.getItem("atemAuxInputs");
    var inputs = sessionStorage.getItem("atemInputs"); 
    var html = "";
    var inputsToShow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20];

    try {
        programMEs = JSON.parse(programMEs);
        auxInputs = JSON.parse(auxInputs);
        downstreamKeyers = JSON.parse(downstreamKeyers);
        upstreamKeyers = JSON.parse(upstreamKeyers);
        inputs = JSON.parse(inputs);

        //Draw the MEs
        var programMELength = -1;
        for(var key in programMEs) {programMELength++;}

        //Add the ME selection buttons
        html += "<div class='tab'>";
        for(var i = 0; i <= programMELength; i++) {
            html += "<button id='button" + i + "' class='tablinks' onclick='changeME(event, " + i + ")'>ME " + (parseInt(i)  + 1) + "</button>";       
        }
        html += "</div>";

        //Add the pages for each ME
        for(var i = 0; i <= programMELength; i++) {
            html += "<div id='" + i + "' class='tabcontent' style='display: none'><div></div>";
            
            //Add the program buttons
            var j = 0;
            for(var key in inputs) {
                if(inputsToShow.includes(parseInt(key))) {
                    html += "<button name='programInputButton' nameType='short' me='" + i + "' input='" + key + "'>" + inputs[key].name + "</button>";
                    if(j >= 9){html+="<br />"; j=0;}else{j++;}
                }
            }

            //Add the keyer buttons
            for(var key in downstreamKeyers) {
                if(key < (10 + i*10) && key >= 10*i) {
                    html += "<button name='keyerButton' keyerType='downstream' keyer='" + (parseInt(key) - (10*i)) + "' me='" + i + "'></button>";
                }
            }
            for(var key in upstreamKeyers) {
                if(key < (10 + i*10) && key >= 10*i) {
                    html += "<button name='keyerButton' keyerType='upstream' keyer='" + (parseInt(key) - (10*i)) + "' me='" + i + "'></button>";
                }
            }

            html += "</div>"
        }

        if(programMELength != -1){
            document.getElementById("generatedAtemSwitcherContent").innerHTML = html;
            document.getElementById("0").style.display = "block";
            document.getElementById("button0").className += " onColor";
            setWidgets();
            updatePage();

            window.addEventListener("storage", function(e) {
                if(e.storageArea == this.sessionStorage) {
                    updatePage();
                }
            });
        }
        else {
            requestStatus(["atemProgramInputs", "atemKeyers", "atemAuxInputs", "atemInputs"]);
            setTimeout(function() {location.reload();}, 1000);
        }
    }
    catch(e) {
        console.log(e);
    }
}

function updatePage() {
    updateWidgets();
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
      tablinks[i].className = tablinks[i].className.replace(" onColor", "");
    }
  
    document.getElementById(me).style.display = "block";
    evt.currentTarget.className += " onColor";
  }