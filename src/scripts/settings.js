import { libWrapper } from "./shim.js";
import { BorderFrame } from "./BorderControl.js";
let possibleSystems = ["dnd5e", "symbaroum", "pf2e", "pf1", "swade"];

let fontFamilies = {};
CONFIG.fontFamilies.forEach((i) => (fontFamilies[`${i}`] = i));

Hooks.once("init", async function () {
	game.settings.register("Border-Control", "removeBorders", {
		name: "Remove Borders",
		hint: "Remove the border from specific tokens",
		scope: "world",
		type: String,
		choices: {
			0: "None",
			1: "Non Owned",
			2: "All"
		},
		default: "0",
		config: true
	});

	game.settings.register("Border-Control", "permanentBorder", {
		name: "Permanent Border",
		hint: "Permanently shows token borders unless directly hidden, selected tokens have double width borders",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register("Border-Control", "healthGradient", {
		name: "HP Gradient",
		hint: "Only works for: DnD5e, PF1e, PF2e, Symbaroum and SWADE",
		scope: "world",
		type: Boolean,
		default: false,
		config: possibleSystems.includes(game.system.id)
	});
	game.settings.register("Border-Control", "tempHPgradient", {
		name: "Gradient TempHP Enable",
		scope: "world",
		type: Boolean,
		default: false,
		config: possibleSystems.includes(game.system.id)
	});
	game.settings.register("Border-Control", "healthGradientA", {
		name: "HP Gradient Start",
		scope: "world",
		type: String,
		default: "#1b9421",
		config: possibleSystems.includes(game.system.id)
	});
	game.settings.register("Border-Control", "healthGradientB", {
		name: "HP Gradient End",
		scope: "world",
		type: String,
		default: "#c9240a",
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register("Border-Control", "healthGradientC", {
		name: "HP Gradient TempHP",
		scope: "world",
		type: String,
		default: "#22e3dd",
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register("Border-Control", "stepLevel", {
		name: "Gradient Step Level",
		hint: "How many individual colors are part of the gradient",
		scope: "world",
		type: Number,
		default: 10,
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register("Border-Control", "borderWidth", {
		name: "Border Width",
		hint: "Override border width in pixels",
		scope: "client",
		type: Number,
		default: 4,
		config: true
	});

	game.settings.register("Border-Control", "borderGridScale", {
		name: "Grid Scaling",
		hint: "Scale border width to grid size, based on 100px grid",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register("Border-Control", "borderOffset", {
		name: "Border Offset",
		hint: "Customize border offset in pixels",
		scope: "client",
		type: Number,
		default: 0,
		config: true
	});
	game.settings.register("Border-Control", "targetSize", {
		name: "Target Size Multiplier",
		scope: "client",
		type: Number,
		default: 1,
		config: true
	});
	game.settings.register("Border-Control", "internatTarget", {
		name: "Internal Target",
		hint: "Target reticule inside  token borders",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register("Border-Control", "circleBorders", {
		name: "Circular Borders",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register("Border-Control", "scaleBorder", {
		name: "Scale Borders",
		hint: "Scales token border according to the 'scale' token setting",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register("Border-Control", "enableHud", {
		name: "Border HUD element",
		hint: "Add Token HUD element to disable/enable borders",
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});
	game.settings.register("Border-Control", "hudPos", {
		name: "Border Control HUD Position",
		scope: "world",
		type: String,
		default: ".right",
		choices: {
			".right": "Right",
			".left": "Left"
		},
		config: true
	});

	game.settings.register("Border-Control", "circularNameplate", {
		name: "Circular Nameplates",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register("Border-Control", "circularNameplateRadius", {
		name: "Circular Nameplates Radius",
		hint: "Requires a refresh",
		scope: "world",
		type: Number,
		default: 0,
		config: true
	});
	game.settings.register("Border-Control", "nameplateColor", {
		name: "Nameplate Color",
		scope: "client",
		type: String,
		default: "#FFFFFF",
		config: true
	});
	game.settings.register("Border-Control", "nameplateColorGM", {
		name: "Nameplate Color for GM only view",
		hint: "Nameplate color used when only the GM can see the nameplate",
		scope: "client",
		type: String,
		default: "#FFFFFF",
		config: true
	});
	game.settings.register("Border-Control", "nameplateOffset", {
		name: "Nameplate Y Offset",
		hint: "Y axis offset in pixels",
		scope: "world",
		type: Number,
		default: 0,
		config: true
	});

	game.settings.register("Border-Control", "plateFont", {
		name: "Nameplate Font",
		hint: "Requires a refresh",
		scope: "world",
		type: String,
		choices: fontFamilies,
		default: "signika",
		config: true
	});
	game.settings.register("Border-Control", "sizeMultiplier", {
		name: "Nameplate Font Size",
		hint: "Requires a refresh",
		scope: "world",
		type: Number,
		default: 1,
		config: true
	});
	game.settings.register("Border-Control", "plateConsistency", {
		name: "Nameplate Consistency",
		hint: "Attempts to keep nameplates the same size across different grid sizes",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register("Border-Control", "controlledColor", {
		name: "Color: Controlled",
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true
	});
	game.settings.register("Border-Control", "controlledColorEx", {
		name: "Color: Controlled External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register("Border-Control", "hostileColor", {
		name: "Color: Hostile",
		scope: "client",
		type: String,
		default: "#E72124",
		config: true
	});
	game.settings.register("Border-Control", "hostileColorEx", {
		name: "Color: Hostile External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register("Border-Control", "friendlyColor", {
		name: "Color: Friendly",
		scope: "client",
		type: String,
		default: "#43DFDF",
		config: true
	});
	game.settings.register("Border-Control", "friendlyColorEx", {
		name: "Color: Friendly External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register("Border-Control", "neutralColor", {
		name: "Color: Neutral",
		scope: "client",
		type: String,
		default: "#F1D836",
		config: true
	});
	game.settings.register("Border-Control", "neutralColorEx", {
		name: "Color: Neutral External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register("Border-Control", "partyColor", {
		name: "Color: Party",
		scope: "client",
		type: String,
		default: "#33BC4E",
		config: true
	});
	game.settings.register("Border-Control", "partyColorEx", {
		name: "Color: Party External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register("Border-Control", "targetColor", {
		name: "Color: Target",
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true
	});
	game.settings.register("Border-Control", "targetColorEx", {
		name: "Color: Target External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register("Border-Control", "disableRefreshTarget", {
		name: "Disable the refresh target feature",
		hint: "Use other module like Better Target, Smart Target, ecc. for apply design to target",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register("Border-Control", "barAlpha", {
		name: "Transparent Bars",
		hint: "Display transparent HUD bars if these elements are not visible to players",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	libWrapper.register("Border-Control", "Token.prototype._refreshBorder", BorderFrame.newBorder, "OVERRIDE");
	libWrapper.register("Border-Control", "Token.prototype._getBorderColor", BorderFrame.newBorderColor, "OVERRIDE");
	if (!game.settings.get("Border-Control", "disableRefreshTarget")) {
		libWrapper.register("Border-Control", "Token.prototype._refreshTarget", BorderFrame.newTarget, "OVERRIDE");
	}
	libWrapper.register("Border-Control", "Token.prototype._drawNameplate", BorderFrame.drawNameplate, "OVERRIDE");
	libWrapper.register("Border-Control", "Token.prototype.drawBars", BorderFrame.drawBars, "MIXED");

	libWrapper.register("Border-Control", "Token.prototype._drawTarget", BorderFrame._drawTarget, "OVERRIDE");
});
