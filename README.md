# Kardinia Church Touch Automation
Development of the Kardinia Church touch screen interface for use with UIBuilder and NodeRed

# Widgets

## General

### Global parameters
Parameters that can be set to elements if supported
- mode will set what mode(s) the element should be shown in
- showWhileLocked (yes/no) shows/hides the element when in a locked state
- passwordRequired (yes/no) should the user enter a password to perform the action?
- ask should the user be asked if they are sure (yes/no)
- askText the text to display to the user when the ask dialog is open
- flash (yes/no) should the button flash when clicked

### commandButton
A button to perform a command directly to nodered
```<button name="commandButton" command="example" value="value"></button>```
- command is the command to be passed
- value is the value of that command to be passed

### toggleCommandButton
A command button that toggles a value, useful for on/off situations
```<button name="toggleCommandButton" command="example" values="0, 1, 2" colors="white, blue, silver></button>```
- command is the command to execute
- values are the values that are possible separated by a ,
- colors are the colors to set the button to for each value

If the state above is 0 the color will be white, 1 will be blue, and 2 will be silver

Note if the state is unknown the command will not be executed and will error. Holding the button for 3 seconds will cause the button to flash and set the value to the first value, 0 above.

### changePageButton
A button to change the current page on the panel
```<button name="changePageButton" page="example"></button>```
- page is the page to navigate to

### actionButton
A button to perform an action to the panel
```<button name="actionButton" action="lock"></button>```
- action is the action to perform

Supported actions are:
- lock locks the panel
- unlock unlocks the panel
- tempunlock will unlock the panel for a short period of time before relocking

## AC

### acControl
An auto generated ac panel
```<section name="acControl" acName="auditorium cafe" acTitle="All ACs" features="temp setTemp mode fan power"></section>```
- acName is the acNames to control can be multiple with a space between
- acTitle is the title that will be displayed on the UI (not required)
- features is the features supported by the ac (temp, setTemp, mode, fan, power)

### acAction
A button to perform an action on a ac(s)
```<button name="acAction" action="setTemp" value="21" acName="auditorium cafe"></button>```
- action is the action to perform (power, setTemp, setMode, setFan)
- value is the value for the action can either be a temp value or up/down/toggle to switch

It is also valid to do multiple actions across multiple acs shown below. Make sure that the action and values line up with spaces
```<button name="acAction" acName="auditorium cafe" action="power setTemp setMode setFan" value="on 21 auto auto">Set ACs</button>```

## acValue
Sets a ac value to a element
```<h1 name="acValue" type="temp" acname="auditorium"></h1>```
- type is the type to display (temp, setTemp, mode, fan, power)
- acname is the ac name (supports multiple)

## ATEM

### programInputButton / previewInputButton
Sets a ATEM ME program/preview input to a input
```<button name="programInputButton" me="0" input="1" nameType="short"></button>```
```<button name="previewInputButton" me="0" input="1" nameType="short"></button>```
- me is the me number to switch
- input is the input number to switch to
- nameType is the type of name to display (none = do not set, short, long, id)

### keyerButton
Sets a keyer on/off on the ATEM
```<button name="keyerButton" keyerType="downstream" keyer="0" me="0" displayMeInName="yes">```
- keyerType is the type of keyer upstream/downstream
- keyer is the keyer id
- me is the me number
- displayMeInName should the me number be displayed in the name eg DS1 ME1 or DS1

### macroButton
A performs a macro run
```<button name="macroButton" macro="1"></button>```
- macro is the macro id to be ran

### auxInputButton
Will change an aux input when clicked
```<button name="auxInputButton" aux="1" inputId="0"></button>```
- aux is the aux id to be changed
- inputId is the input id to set that aux to

## Sound

### soundChannel
Allows for control of volume of a sound channel (Multipule channels are not supported at the moment)
```<section name="soundChannel" type="active" channel="0" channelName="Mics" features="bar plus minus mute"></section>```

- channel is the channel to effect
- channelName is the title shown on the user side
- features is what features to support (bar, plus, minus, mute)
- type is what type this is active (will set the value according to the local value) / passive (will just send a up/down)

Sends to/from node red
- channel[channelName]Mute = ("on"/"off") is the mute command
- channel[channelName]Volume = 0 - 100 (%) is the volume level if the bar is enabled
- channel[channelName]Volume = "up/down" is the volume level if the bar is disabled