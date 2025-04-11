/// <reference types="types-for-adobe/AfterEffects/23.0"/>
/// <reference types="../types.ts"/>

let makePalette = function (validator, grantedCallback: () => any, options: Options) {
	if (!validator) {
		throw new Error("Validator instance is required");
	}

	let isMacOS = function () {
		let currentSystemOS = String($.os).toLowerCase();
		return currentSystemOS.indexOf("mac") != -1;
	};

	// options
	options = options === undefined ? {} : options;
	let title = options.title || options.toolName || "Allow Scripts to Write Files and Access Network";
	let osMenuName = isMacOS() ? "After Effects" : "Edit";
	let name = options.toolName || "this tool";
	let intro = options.intro || "For " + name + " to work properly, it needs to be able to write files and reach the internet.";

	// palette and groups
	let webAccessPalette = new Window("palette", undefined, undefined, {
		closeButton: true,
		resizeable: false,
	});
	webAccessPalette.text = title;
	webAccessPalette.orientation = "column";
	webAccessPalette.alignChildren = ["center", "center"];
	webAccessPalette.spacing = 30;
	webAccessPalette.margins = 42;

	let sortingGroup = webAccessPalette.add("group", undefined, {
		name: "sortingGroup",
	});
	sortingGroup.orientation = "row";
	sortingGroup.alignChildren = ["center", "center"];
	sortingGroup.spacing = 8;
	sortingGroup.margins = 0;

	let textGroup = sortingGroup.add("group");
	textGroup.orientation = "column";
	textGroup.alignChildren = ["center", "center"];
	textGroup.spacing = 5;

	// Add the text (fragmented in favor of colorizing the text)
	textGroup.add("statictext", undefined, intro, {
		name: "statictext2",
	});

	let row1 = textGroup.add("group");
	row1.orientation = "row";
	row1.alignChildren = ["center", "center"];
	row1.spacing = 5;

	let row2 = textGroup.add("group");
	row2.orientation = "row";
	row2.alignChildren = ["center", "center"];
	row2.spacing = 5;

	let row3 = textGroup.add("group");
	row3.orientation = "row";
	row3.alignChildren = ["center", "center"];
	row3.spacing = 5;

	row1.add("statictext", undefined, "Please go to: ", {
		name: "statictext2",
	});
	let highlightedText = row1.add("statictext", undefined, osMenuName + " -> Preferences -> Scripting & Expressions -> Allow Scripts to Write Files and Access Network ", {
		name: "statictext2",
	});
	row3.add("statictext", undefined, "Then click 'Check Again'", {
		name: "statictext2",
	});

	// colorize the text

	// @ts-ignore
	let dimPen = webAccessPalette.graphics.newPen(webAccessPalette.graphics.PenType.SOLID_COLOR, [1, 1, 1, 0.3], 2);
	// @ts-ignore
	let orangePen = webAccessPalette.graphics.newPen(webAccessPalette.graphics.PenType.SOLID_COLOR, [1, 0.4, 0, 1], 2);
	// @ts-ignore
	let whitePen = webAccessPalette.graphics.newPen(webAccessPalette.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
	textGroup.graphics.foregroundColor = dimPen;
	highlightedText.graphics.foregroundColor = whitePen;

	//  add the button and dictate what it does
	let notYetTextAdded = false;
	let checkAgainButton = webAccessPalette.add("button", undefined, undefined, {
		name: "checkAgainButton",
	});
	checkAgainButton.text = "Check Again";
	checkAgainButton.onClick = function () {
		let hasAccess = validator.hasAccessToFilesAndNetwork();
		if (hasAccess) {
			if (grantedCallback && typeof grantedCallback == "function") {
				grantedCallback();
			}
			webAccessPalette.close();
			return true;
		}

		if (!notYetTextAdded) {
			let notYetText = webAccessPalette.add("statictext", undefined, "You have not yet granted access. Please try again ", {
				name: "notyetText",
			});
			notYetText.graphics.foregroundColor = dimPen;

			notYetTextAdded = true;
			webAccessPalette.layout.layout(true);
		}

		return;
	};

	//  show the palette
	webAccessPalette.layout.layout(true);
	webAccessPalette.layout.resize();
	webAccessPalette.center();
	webAccessPalette.show();
};
