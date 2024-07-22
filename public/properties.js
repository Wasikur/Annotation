// envType = "local" for development purposes;
// envType = "prod"  for production purposes;
var envType = "local";

function getHost() {
    if (envType == "local") {
        return "https://" + window.location.hostname + "/annotation/annotate/comments/";
    } else {
        return window.location.origin;
    }
}
var Configs = {
    host: getHost(),
    loggedIn: false
}
var intervalDelay = 30000;

