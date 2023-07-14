import { warn, error, debug, i18n } from "./lib/lib.mjs";
import CONSTANTS from "./constants.mjs";
import { setApi } from "../main.mjs";
import API from "./api.mjs";
import { BCconfig } from "./BCconfig.mjs";
import { BorderFrame } from "./BorderControl.mjs";

export let BCCBASE: BCconfig;

export const initHooks = async () => {
	// Hooks.once("socketlib.ready", registerSocket);
	// registerSocket();

	Hooks.on("renderSettingsConfig", (app, el, data) => {
		let nC = game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor");
		let fC = game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor");
		let hC = game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor");
		let cC = game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor");
		let pC = game.settings.get(CONSTANTS.MODULE_NAME, "partyColor");
		let nCE = game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx");
		let fCE = game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx");
		let hCE = game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx");
		let cCE = game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx");
		let pCE = game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx");
		const afCE = game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx");
		const cdCE = game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx");

		let tC = game.settings.get(CONSTANTS.MODULE_NAME, "targetColor");
		let tCE = game.settings.get(CONSTANTS.MODULE_NAME, "targetColorEx");

		let gS = game.settings.get(CONSTANTS.MODULE_NAME, "healthGradientA");
		let gE = game.settings.get(CONSTANTS.MODULE_NAME, "healthGradientB");
		let gT = game.settings.get(CONSTANTS.MODULE_NAME, "healthGradientC");
		let nPC = game.settings.get(CONSTANTS.MODULE_NAME, "nameplateColor");
		let nPCGM = game.settings.get(CONSTANTS.MODULE_NAME, "nameplateColorGM");
		el.find('[name="Border-Control.neutralColor"]')
			.parent()
			.append(`<input type="color" value="${nC}" data-edit="Border-Control.neutralColor">`);
		el.find('[name="Border-Control.friendlyColor"]')
			.parent()
			.append(`<input type="color" value="${fC}" data-edit="Border-Control.friendlyColor">`);
		el.find('[name="Border-Control.hostileColor"]')
			.parent()
			.append(`<input type="color" value="${hC}" data-edit="Border-Control.hostileColor">`);
		el.find('[name="Border-Control.controlledColor"]')
			.parent()
			.append(`<input type="color"value="${cC}" data-edit="Border-Control.controlledColor">`);
		el.find('[name="Border-Control.partyColor"]')
			.parent()
			.append(`<input type="color"value="${pC}" data-edit="Border-Control.partyColor">`);
		el.find('[name="Border-Control.targetColor"]')
			.parent()
			.append(`<input type="color"value="${tC}" data-edit="Border-Control.targetColor">`);

		el.find('[name="Border-Control.neutralColorEx"]')
			.parent()
			.append(`<input type="color" value="${nCE}" data-edit="Border-Control.neutralColorEx">`);
		el.find('[name="Border-Control.friendlyColorEx"]')
			.parent()
			.append(`<input type="color" value="${fCE}" data-edit="Border-Control.friendlyColorEx">`);
		el.find('[name="Border-Control.hostileColorEx"]')
			.parent()
			.append(`<input type="color" value="${hCE}" data-edit="Border-Control.hostileColorEx">`);
		el.find('[name="Border-Control.controlledColorEx"]')
			.parent()
			.append(`<input type="color"value="${cCE}" data-edit="Border-Control.controlledColorEx">`);
		el.find('[name="Border-Control.partyColorEx"]')
			.parent()
			.append(`<input type="color"value="${pCE}" data-edit="Border-Control.partyColorEx">`);

		el.find('[name="Border-Control.actorFolderColorEx"]')
			.parent()
			.append(`<input type="color" value="${afCE}" data-edit="Border-Control.actorFolderColorEx">`);
		el.find('[name="Border-Control.customDispositionColorEx"]')
			.parent()
			.append(`<input type="color" value="${cdCE}" data-edit="Border-Control.customDispositionColorEx">`);

		el.find('[name="Border-Control.targetColorEx"]')
			.parent()
			.append(`<input type="color"value="${tCE}" data-edit="Border-Control.targetColorEx">`);

		el.find('[name="Border-Control.healthGradientA"]')
			.parent()
			.append(`<input type="color"value="${gS}" data-edit="Border-Control.healthGradientA">`);
		el.find('[name="Border-Control.healthGradientB"]')
			.parent()
			.append(`<input type="color"value="${gE}" data-edit="Border-Control.healthGradientB">`);
		el.find('[name="Border-Control.healthGradientC"]')
			.parent()
			.append(`<input type="color"value="${gT}" data-edit="Border-Control.healthGradientC">`);
		el.find('[name="Border-Control.nameplateColor"]')
			.parent()
			.append(`<input type="color"value="${nPC}" data-edit="Border-Control.nameplateColor">`);
		el.find('[name="Border-Control.nameplateColorGM"]')
			.parent()
			.append(`<input type="color"value="${nPCGM}" data-edit="Border-Control.nameplateColorGM">`);
	});

	if (game.settings.get(CONSTANTS.MODULE_NAME, "borderControlEnabled")) {
		// setup all the hooks

		Hooks.on("renderTokenConfig", (config, html) => {
			BorderFrame.renderTokenConfig(config, html);
		});

		//@ts-ignore
		libWrapper.register(CONSTANTS.MODULE_NAME, "Token.prototype._refreshBorder", BorderFrame.newBorder, "OVERRIDE");
		//@ts-ignore
		libWrapper.register(
			CONSTANTS.MODULE_NAME,
			"Token.prototype._getBorderColor",
			BorderFrame.newBorderColor,
			"OVERRIDE"
		);

		if (!game.settings.get(CONSTANTS.MODULE_NAME, "disableRefreshTarget")) {
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"Token.prototype._refreshTarget",
				BorderFrame.newTarget,
				"OVERRIDE"
			);

			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"Token.prototype._drawTarget",
				BorderFrame._drawTarget,
				"OVERRIDE"
			);
		}

		if (!game.settings.get(CONSTANTS.MODULE_NAME, "disableNameplateDesign")) {
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"Token.prototype._drawNameplate",
				BorderFrame.drawNameplate,
				"OVERRIDE"
			);
		}

		if (!game.settings.get(CONSTANTS.MODULE_NAME, "disableDrawBarsDesign")) {
			//@ts-ignore
			libWrapper.register(CONSTANTS.MODULE_NAME, "Token.prototype.drawBars", BorderFrame.drawBars, "MIXED");
		}
	}
};

export const setupHooks = async (): Promise<void> => {
	setApi(API);
};

export const readyHooks = () => {
	BCCBASE = new BCconfig();

	if (game.settings.get(CONSTANTS.MODULE_NAME, "borderControlEnabled")) {
		Hooks.on("renderTokenHUD", (app, html, data) => {
			BorderFrame.AddBorderToggle(app, html, data);
		});

		Hooks.on("createToken", (data) => {
			let token = <Token>canvas.tokens?.get(data.id);
			if (!token.owner) {
				token.cursor = "default";
			}
		});

		// Removed for conflict with others modules ?
		canvas.tokens?.placeables.forEach((t) => {
			if (!t.owner) {
				t.cursor = "default";
			}
		});
	}
};
