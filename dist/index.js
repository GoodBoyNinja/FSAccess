var makePalette = function (validator, grantedCallback, options) {
    if (!validator) {
        throw new Error("Validator instance is required");
    }
    var isMacOS = function () {
        var currentSystemOS = String($.os).toLowerCase();
        return currentSystemOS.indexOf("mac") != -1;
    };
    options = options === undefined ? {} : options;
    var title = options.title || options.toolName || "Allow Scripts to Write Files and Access Network";
    var osMenuName = isMacOS() ? "After Effects" : "Edit";
    var name = options.toolName || "this tool";
    var intro = options.intro || "For " + name + " to work properly, it needs to be able to write files and reach the internet.";
    var webAccessPalette = new Window("palette", undefined, undefined, {
        closeButton: true,
        resizeable: false,
    });
    webAccessPalette.text = title;
    webAccessPalette.orientation = "column";
    webAccessPalette.alignChildren = ["center", "center"];
    webAccessPalette.spacing = 30;
    webAccessPalette.margins = 42;
    var sortingGroup = webAccessPalette.add("group", undefined, {
        name: "sortingGroup",
    });
    sortingGroup.orientation = "row";
    sortingGroup.alignChildren = ["center", "center"];
    sortingGroup.spacing = 8;
    sortingGroup.margins = 0;
    var textGroup = sortingGroup.add("group");
    textGroup.orientation = "column";
    textGroup.alignChildren = ["center", "center"];
    textGroup.spacing = 5;
    textGroup.add("statictext", undefined, intro, {
        name: "statictext2",
    });
    var row1 = textGroup.add("group");
    row1.orientation = "row";
    row1.alignChildren = ["center", "center"];
    row1.spacing = 5;
    var row2 = textGroup.add("group");
    row2.orientation = "row";
    row2.alignChildren = ["center", "center"];
    row2.spacing = 5;
    var row3 = textGroup.add("group");
    row3.orientation = "row";
    row3.alignChildren = ["center", "center"];
    row3.spacing = 5;
    row1.add("statictext", undefined, "Please go to: ", {
        name: "statictext2",
    });
    var highlightedText = row1.add("statictext", undefined, osMenuName + " -> Preferences -> Scripting & Expressions -> Allow Scripts to Write Files and Access Network ", {
        name: "statictext2",
    });
    row3.add("statictext", undefined, "Then click 'Check Again'", {
        name: "statictext2",
    });
    var dimPen = webAccessPalette.graphics.newPen(webAccessPalette.graphics.PenType.SOLID_COLOR, [1, 1, 1, 0.3], 2);
    var orangePen = webAccessPalette.graphics.newPen(webAccessPalette.graphics.PenType.SOLID_COLOR, [1, 0.4, 0, 1], 2);
    var whitePen = webAccessPalette.graphics.newPen(webAccessPalette.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
    textGroup.graphics.foregroundColor = dimPen;
    highlightedText.graphics.foregroundColor = whitePen;
    var notYetTextAdded = false;
    var checkAgainButton = webAccessPalette.add("button", undefined, undefined, {
        name: "checkAgainButton",
    });
    checkAgainButton.text = "Check Again";
    checkAgainButton.onClick = function () {
        var hasAccess = validator.hasAccessToFilesAndNetwork();
        if (hasAccess) {
            if (grantedCallback && typeof grantedCallback == "function") {
                grantedCallback();
            }
            webAccessPalette.close();
            return true;
        }
        if (!notYetTextAdded) {
            var notYetText = webAccessPalette.add("statictext", undefined, "You have not yet granted access. Please try again ", {
                name: "notyetText",
            });
            notYetText.graphics.foregroundColor = dimPen;
            notYetTextAdded = true;
            webAccessPalette.layout.layout(true);
        }
        return;
    };
    webAccessPalette.layout.layout(true);
    webAccessPalette.layout.resize();
    webAccessPalette.center();
    webAccessPalette.show();
};
var $FSAccessValidator = function (options) {
    this.conditionWithPalette = function (grantedCallback, options) {
        if (this.hasAccessToFilesAndNetwork()) {
            if (grantedCallback && typeof grantedCallback == "function") {
                grantedCallback();
            }
            return true;
        }
        makePalette(this, grantedCallback, options);
    };
    this.hasAccessToFilesAndNetwork = function () {
        try {
            var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
            return securitySetting == 1;
        }
        catch (e) {
            return false;
        }
    };
};
