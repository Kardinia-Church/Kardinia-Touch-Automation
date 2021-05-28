var version = "2.3.2";

var versions = [
    {
        "version": "2.3.1",
        "changes": [
            "Fixed an issue with the progress bar causing IE not to work and slow issues on the touch screens"
        ]
    },
    {
        "version": "2.3.2",
        "changes": [
            "Fixed a compatibility issue with the wallpanels (IE) and the array includes method. This fixed an issue where the sound channels would not appear"
        ]
    },
    {
        "version": "2.4.0",
        "changes": [
            "Updated AC interface"
        ]
    }
];

function getVersion() {
    var latest = versions[versions.length - 1];
    return latest.version;
}

function getChanges() {
    var latest = versions[versions.length - 1];
    return latest.changes;
}