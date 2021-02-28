var version = "2.3.1";

var versions = [
    {
        "version": "2.3.1",
        "changes": [
            "Fixed an issue with the progress bar causing IE not to work and slow issues on the touch screens"
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