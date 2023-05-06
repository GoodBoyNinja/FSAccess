// asks the user to turn on "Allow Scripts to Write Files and Access Network" in Ae settings

var $FSAccessValidator = function(options) {
    #include './UI/window.jsx';

    this.conditionWithPalette = function(grantedCallback, options) {
        if (this.hasAccessToFilesAndNetwork()) {
            if (grantedCallback && typeof grantedCallback == "function") {
                grantedCallback();
            }
            return true;
        }

        makePalette(this, grantedCallback, options);
    }
    this.hasAccessToFilesAndNetwork = function() {
        try {
            var securitySetting = app.preferences.getPrefAsLong(
                "Main Pref Section",
                "Pref_SCRIPTING_FILE_NETWORK_SECURITY"
            );
            return securitySetting == 1;
        } catch (e) {
            return false;
        }
    }


}