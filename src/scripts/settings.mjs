import { debug, log, warn, i18n } from "./lib/lib.mjs";
import CONSTANTS from "./constants.mjs";

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
		name: `${CONSTANTS.MODULE_NAME}.setting.borderControlEnabled.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.borderControlEnabled.hint`,
		default: true,
		type: Boolean,
		scope: "world",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "removeBorders", {
		name: `${CONSTANTS.MODULE_NAME}.setting.removeBorders.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.removeBorders.hint`,
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
		name: `${CONSTANTS.MODULE_NAME}.setting.permanentBorder.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.permanentBorder.hint`,
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "stepLevel", {
		name: `${CONSTANTS.MODULE_NAME}.setting.stepLevel.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.stepLevel.hint`,
		scope: "world",
		type: Number,
		default: 10,
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "borderWidth", {
		name: `${CONSTANTS.MODULE_NAME}.setting.borderWidth.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.borderWidth.hint`,
		scope: "client",
		type: Number,
		default: 4,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "borderGridScale", {
		name: `${CONSTANTS.MODULE_NAME}.setting.borderGridScale.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.borderGridScale.hint`,
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "borderOffset", {
		name: `${CONSTANTS.MODULE_NAME}.setting.borderOffset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.borderOffset.hint`,
		scope: "client",
		type: Number,
		default: 0,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "circleBorders", {
		name: `${CONSTANTS.MODULE_NAME}.setting.circleBorders.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.circleBorders.hint`,
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "scaleBorder", {
		name: `${CONSTANTS.MODULE_NAME}.setting.scaleBorder.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.scaleBorder.hint`,
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

	game.settings.register(CONSTANTS.MODULE_NAME, "controlledColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.controlledColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.controlledColor.hint`,
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "controlledColorEx", {
		name: `${CONSTANTS.MODULE_NAME}.setting.controlledColorEx.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.controlledColorEx.hint`,
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "hostileColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.hostileColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.hostileColor.hint`,
		scope: "client",
		type: String,
		default: "#E72124",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "hostileColorEx", {
		name: `${CONSTANTS.MODULE_NAME}.setting.hostileColorEx.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.hostileColorEx.hint`,
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "friendlyColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.friendlyColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.friendlyColor.hint`,
		scope: "client",
		type: String,
		default: "#43DFDF",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "friendlyColorEx", {
		name: `${CONSTANTS.MODULE_NAME}.setting.friendlyColorEx.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.friendlyColorEx.hint`,
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "neutralColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.neutralColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.neutralColor.hint`,
		scope: "client",
		type: String,
		default: "#F1D836",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "neutralColorEx", {
		name: `${CONSTANTS.MODULE_NAME}.setting.neutralColorEx.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.neutralColorEx.hint`,
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "partyColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.partyColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.partyColor.hint`,
		scope: "client",
		type: String,
		default: "#33BC4E",
		config: true
	});
	game.settings.register(CONSTANTS.MODULE_NAME, "partyColorEx", {
		name: `${CONSTANTS.MODULE_NAME}.setting.partyColorEx.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.partyColorEx.hint`,
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "actorFolderColorEx", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.actorFolderColorEx.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.actorFolderColorEx.hint"),
		scope: "world",
		type: String,
		default: "#000000",
		config: true
	});

	// Setting off
	game.settings.register(CONSTANTS.MODULE_NAME, "customDispositionColorEx", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.customDispositionColorEx.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.customDispositionColorEx.hint"),
		scope: "world",
		type: String,
		default: "#000000",
		config: false
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "color-from", {
		name: i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.name"),
		hint: i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.hint"),
		scope: "world",
		config: true,
		default: "token-disposition",
		type: String,
		choices: <any>{
			"token-disposition": i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.opt.token-disposition"),
			"actor-folder-color": i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.opt.actor-folder-color")
			// "custom-disposition": i18n(CONSTANTS.MODULE_NAME + ".setting.color-from.opt.custom-disposition")
		}
	});

	// Nameplate Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "disableNameplateDesign", {
		name: `${CONSTANTS.MODULE_NAME}.setting.disableNameplateDesign.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.disableNameplateDesign.hint`,
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "circularNameplate", {
		name: `${CONSTANTS.MODULE_NAME}.setting.circularNameplate.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.circularNameplate.hint`,
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "circularNameplateRadius", {
		name: `${CONSTANTS.MODULE_NAME}.setting.circularNameplateRadius.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.circularNameplateRadius.hint`,
		scope: "world",
		type: Number,
		default: 0,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "nameplateColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.nameplateColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.nameplateColor.hint`,
		scope: "client",
		type: String,
		default: "#FFFFFF",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "nameplateColorGM", {
		name: `${CONSTANTS.MODULE_NAME}.setting.nameplateColorGM.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.nameplateColorGM.hint`,
		scope: "client",
		type: String,
		default: "#FFFFFF",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "nameplateOffset", {
		name: `${CONSTANTS.MODULE_NAME}.setting.nameplateOffset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.nameplateOffset.hint`,
		scope: "world",
		type: Number,
		default: 0,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "plateFont", {
		name: `${CONSTANTS.MODULE_NAME}.setting.plateFont.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.plateFont.hint`,
		scope: "world",
		type: String,
		choices: <any>fontFamilies,
		default: "signika",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "sizeMultiplier", {
		name: `${CONSTANTS.MODULE_NAME}.setting.sizeMultiplier.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.sizeMultiplier.hint`,
		scope: "world",
		type: Number,
		default: 1,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "plateConsistency", {
		name: `${CONSTANTS.MODULE_NAME}.setting.plateConsistency.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.plateConsistency.hint`,
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	// Target Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "disableRefreshTarget", {
		name: `${CONSTANTS.MODULE_NAME}.setting.disableRefreshTarget.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.disableRefreshTarget.hint`,
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "targetSize", {
		name: `${CONSTANTS.MODULE_NAME}.setting.targetSize.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.targetSize.hint`,
		scope: "client",
		type: Number,
		default: 1,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "internatTarget", {
		name: `${CONSTANTS.MODULE_NAME}.setting.internatTarget.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.internatTarget.hint`,
		scope: "client",
		type: Boolean,
		default: false,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "targetColor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.targetColor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.targetColor.hint`,
		scope: "client",
		type: String,
		default: "#FF9829",
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "targetColorEx", {
		name: `${CONSTANTS.MODULE_NAME}.setting.targetColorEx.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.targetColorEx.hint`,
		scope: "client",
		type: String,
		default: "#000000",
		config: true
	});

	// Bars Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "disableDrawBarsDesign", {
		name: `${CONSTANTS.MODULE_NAME}.setting.disableDrawBarsDesign.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.disableDrawBarsDesign.hint`,
		scope: "world",
		type: Boolean,
		default: true,
		config: true
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "barAlpha", {
		name: `${CONSTANTS.MODULE_NAME}.setting.barAlpha.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.barAlpha.hint`,
		scope: "world",
		type: Boolean,
		default: false,
		config: true
	});

	// HealthGradient Feature (Deprecated)

	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradient", {
		name: `${CONSTANTS.MODULE_NAME}.setting.healthGradient.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.healthGradient.hint`,
		scope: "world",
		type: Boolean,
		default: false,
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "tempHPgradient", {
		name: `${CONSTANTS.MODULE_NAME}.setting.tempHPgradient.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.tempHPgradient.hint`,
		scope: "world",
		type: Boolean,
		default: false,
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradientA", {
		name: `${CONSTANTS.MODULE_NAME}.setting.healthGradientA.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.healthGradientA.hint`,
		scope: "world",
		type: String,
		default: "#1b9421",
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradientB", {
		name: `${CONSTANTS.MODULE_NAME}.setting.healthGradientB.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.healthGradientB.hint`,
		scope: "world",
		type: String,
		default: "#c9240a",
		config: possibleSystems.includes(game.system.id)
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "healthGradientC", {
		name: `${CONSTANTS.MODULE_NAME}.setting.healthGradientC.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.healthGradientC.hint`,
		scope: "world",
		type: String,
		default: "#22e3dd",
		config: possibleSystems.includes(game.system.id)
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
