# Widgets

## acControl
An auto generated ac panel
```<section name="acControl" acName="auditorium cafe" acTitle="All ACs" features="temp setTemp mode fan power" class="split" mode="all" showWhileLocked="no"></section>```
- acName is the acNames to control can be multiple with a space between
- acTitle is the title that will be displayed on the UI (not required)
- features is the features supported by the ac (temp, setTemp, mode, fan, power)
- mode is what modes this will be displayed on
- showWhileLocked is if it should be shown when the panel is locked (yes/no)

## acAction
A button to perform an action on a ac(s)
```<button name="acAction" action="setTemp" value="21" acName="auditorium cafe" ask="no" askText="example" passwordRequired="no" flash="yes"></button>```
- action is the action to perform (power, setTemp, setMode, setFan)
- value is the value for the action can either be a temp value or up/down/toggle to switch
- ask should the user be asked if they're sure (yes/no)
- askText the text to display the user when the ask dialog is open
- passwordRequired should a password be entered to perform the action (yes/no)
- flash should the button flash when clicked (yes/no)

It is also valid to do multiple actions across multiple acs shown below. Make sure that the action and values line up with spaces
```<button name="acAction" acName="auditorium cafe" action="power setTemp setMode setFan" value="on 21 auto auto">Set ACs</button>```

## acValue
Sets a ac value to a element
```<h1 name="acValue" type="temp" acname="auditorium"></h1>```
- type is the type to display (temp, setTemp, mode, fan, power)
- acname is the ac name (supports multiple)

## programInputButton / previewInputButton
Sets a ATEM ME program/preview input to a input
```<button name="programInputButton" me="0" input="1" nameType="short"></button>```
```<button name="previewInputButton" me="0" input="1" nameType="short"></button>```
- me is the me number to switch
- input is the input number to switch to
- nameType is the type of name to display (none = do not set, short, long, id)
- ask should the user be asked if they're sure (yes/no)
- askText the text to display the user when the ask dialog is open
- passwordRequired should a password be entered to perform the action (yes/no)

## keyerButton
Sets a keyer on/off on the ATEM
```<button name="keyerButton" keyerType="downstream" keyer="0" me="0" displayMeInName="yes">```
- keyerType is the type of keyer upstream/downstream
- keyer is the keyer id
- me is the me number
- ask should the user be asked if they're sure (yes/no)
- askText the text to display the user when the ask dialog is open
- passwordRequired should a password be entered to perform the action (yes/no)
- displayMeInName should the me number be displayed in the name eg DS1 ME1 or DS1