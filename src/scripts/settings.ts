import { debug, log, warn, i18n } from "./lib/lib";
import CONSTANTS from "./constants";

let possibleSystems = ["dnd5e", "symbaroum", "pf2e", "pf1", "swade"];

let fontFamilies = {};

export const registerSettings = function () {
	//@ts-ignore
	CONFIG.fontFamilies.forEach((i) => (fontFamilies[`${i}`] = i));

	game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
		name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true
	});

	// =====================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "borderControlEnabled", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.borderControlEnabled.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.borderControlEnabled.hint"),
		default: true,
		type: Boolean,
		scope: "world",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "removeBorders", {
		name: "Remove Borders",
		hint: "Remove the border from specific tokens",
		scope: "world",
		type: String,
		choices: <any>{
			0: "None",
			1: "Non Owned",
			2: "All"
		},
		default: "0",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "permanentBorder", {
		name: "Permanent Border",
		hint: "Permanently shows token borders unless directly hidden, selected tokens have double width borders",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradient", {
		name: "HP Gradient",
		hint: "Only works for: DnD5e, PF1e, PF2e, Symbaroum and SWADE",
		scope: "world",
		type: Boolean,
		default: false,
		config: possibleSystems.includes(game.system.id)
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "tempHPgradient", {
		name: "Gradient TempHP Enable",
		scope: "world",
		type: Boolean,
		default: false,
		config: possibleSystems.includes(game.system.id)
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradientA", {
		name: "HP Gradient Start",
		scope: "world",
		type: String,
		default: "#1b9421",
		config: possibleSystems.includes(game.system.id)
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradientB", {
		name: "HP Gradient End",
		scope: "world",
		type: String,
		default: "#c9240a",
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradientC", {
		name: "HP Gradient TempHP",
		scope: "world",
		type: String,
		default: "#22e3dd",
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "stepLevel", {
		name: "Gradient Step Level",
		hint: "How many individual colors are part of the gradient",
		scope: "world",
		type: Number,
		default: 10,
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "borderWidth", {
		name: "Border Width",
		hint: "Override border width in pixels",
		scope: "client",
		type: Number,
		default: 4,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "borderGridScale", {
		name: "Grid Scaling",
		hint: "Scale border width to grid size, based on 100px grid",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "borderOffset", {
		name: "Border Offset",
		hint: "Customize border offset in pixels",
		scope: "client",
		type: Number,
		default: 0,
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "targetSize", {
		name: "Target Size Multiplier",
		scope: "client",
		type: Number,
		default: 1,
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "internatTarget", {
		name: "Internal Target",
		hint: "Target reticule inside  token borders",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "circleBorders", {
		name: "Circular Borders",
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "scaleBorder", {
		name: "Scale Borders",
		hint: "Scales token border according to the 'scale' token setting",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "hudEnable", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.hudEnable.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.hudEnable.hint"),
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	/** Which column should the button be placed on */
	game.settings.register(CONSTANTS.MODULE_NAME, "hudColumn", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
		scope: "world",
		config: true,
		type: String,
		default: "Right",
		choices: <any>{
			Left: "Left",
			Right: "Right"
		}
	});

	/** Whether the button should be placed on the top or bottom of the column */
	game.settings.register(CONSTANTS.MODULE_NAME, "hudTopBottom", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
		scope: "world",
		config: true,
		type: String,
		default: "Bottom",
		choices: <any>{
			Top: "Top",
			Bottom: "Bottom"
		}
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "plateFont", {
		name: "Nameplate Font",
		hint: "Requires a refresh",
		scope: "world",
		type: String,
		choices: <any>fontFamilies,
		default: "signika",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "sizeMultiplier", {
		name: "Nameplate Font Size",
		hint: "Requires a refresh",
		scope: "world",
		type: Number,
		default: 1,
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "plateConsistency", {
		name: "Nameplate Consistency",
		hint: "Attempts to keep nameplates the same size across different grid sizes",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "controlledColor", {
		name: "Color: Controlled",
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "controlledColorEx", {
		name: "Color: Controlled External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "hostileColor", {
		name: "Color: Hostile",
		scope: "client",
		type: String,
		default: "#E72124",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "hostileColorEx", {
		name: "Color: Hostile External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "friendlyColor", {
		name: "Color: Friendly",
		scope: "client",
		type: String,
		default: "#43DFDF",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "friendlyColorEx", {
		name: "Color: Friendly External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "neutralColor", {
		name: "Color: Neutral",
		scope: "client",
		type: String,
		default: "#F1D836",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "neutralColorEx", {
		name: "Color: Neutral External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "partyColor", {
		name: "Color: Party",
		scope: "client",
		type: String,
		default: "#33BC4E",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "partyColorEx", {
		name: "Color: Party External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});

	// Nameplate Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "disableNameplateDesign", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.disableNameplateDesign.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.disableNameplateDesign.hint"),
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "circularNameplate", {
		name: "Circular Nameplates",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "circularNameplateRadius", {
		name: "Circular Nameplates Radius",
		hint: "Requires a refresh",
		scope: "world",
		type: Number,
		default: 0,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "nameplateColor", {
		name: "Nameplate Color",
		scope: "client",
		type: String,
		default: "#FFFFFF",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "nameplateColorGM", {
		name: "Nameplate Color for GM only view",
		hint: "Nameplate color used when only the GM can see the nameplate",
		scope: "client",
		type: String,
		default: "#FFFFFF",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "nameplateOffset", {
		name: "Nameplate Y Offset",
		hint: "Y axis offset in pixels",
		scope: "world",
		type: Number,
		default: 0,
		config: true
	});

	// Target Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "disableRefreshTarget", {
		name: "Disable the refresh target feature",
		hint: "Use other module like Better Target, Smart Target, ecc. for apply design to target",
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "targetColor", {
		name: "Color: Target",
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "targetColorEx", {
		name: "Color: Target External",
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});

	// Bars Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "disableDrawBarsDesign", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.disableDrawBarsDesign.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.disableDrawBarsDesign.hint"),
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "barAlpha", {
		name: "Transparent Bars",
		hint: "Display transparent HUD bars if these elements are not visible to players",
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	// ========================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean
	});
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
	constructor(...args) {
		//@ts-ignore
		super(...args);
		//@ts-ignore
		return new Dialog({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
			content:
				'<p style="margin-bottom:1rem;">' +
				game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
				"</p>",
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
					callback: async () => {
						const worldSettings = game.settings.storage
							?.get("world")
							?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_NAME}.`));
						for (let setting of worldSettings) {
							console.log(`Reset setting '${setting.key}'`);
							await setting.delete();
						}
						//window.location.reload();
					}
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`)
				}
			},
			default: "cancel"
		});
	}

	async _updateObject(event: Event, formData?: object): Promise<any> {
		// do nothing
	}
}
