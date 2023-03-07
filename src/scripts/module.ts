import { warn, error, debug, i18n } from "./lib/lib";
import CONSTANTS from "./constants";
import { setApi } from "../main";
import API from "./api";
import { BCconfig } from "./BCconfig";
import { BorderFrame } from "./BorderControl";

let possibleSystems = ["dnd5e", "symbaroum", "pf2e", "pf1", "swade"];

let fontFamilies = {};
//@ts-ignore
CONFIG.fontFamilies.forEach((i) => (fontFamilies[`${i}`] = i));

let BCC;

export const initHooks = async () => {
	// Hooks.once("socketlib.ready", registerSocket);
	// registerSocket();

	Hooks.on("renderSettingsConfig", (app, el, data) => {
		let nC = game.settings.get("Border-Control", "neutralColor");
		let fC = game.settings.get("Border-Control", "friendlyColor");
		let hC = game.settings.get("Border-Control", "hostileColor");
		let cC = game.settings.get("Border-Control", "controlledColor");
		let pC = game.settings.get("Border-Control", "partyColor");
		let nCE = game.settings.get("Border-Control", "neutralColorEx");
		let fCE = game.settings.get("Border-Control", "friendlyColorEx");
		let hCE = game.settings.get("Border-Control", "hostileColorEx");
		let cCE = game.settings.get("Border-Control", "controlledColorEx");
		let pCE = game.settings.get("Border-Control", "partyColorEx");
		let tC = game.settings.get("Border-Control", "targetColor");
		let tCE = game.settings.get("Border-Control", "targetColorEx");
		let gS = game.settings.get("Border-Control", "healthGradientA");
		let gE = game.settings.get("Border-Control", "healthGradientB");
		let gT = game.settings.get("Border-Control", "healthGradientC");
		let nPC = game.settings.get("Border-Control", "nameplateColor");
		let nPCGM = game.settings.get("Border-Control", "nameplateColorGM");
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

	//@ts-ignore
	libWrapper.register("Border-Control", "Token.prototype._refreshBorder", BorderFrame.newBorder, "OVERRIDE");
	//@ts-ignore
	libWrapper.register("Border-Control", "Token.prototype._getBorderColor", BorderFrame.newBorderColor, "OVERRIDE");
	if (!game.settings.get("Border-Control", "disableRefreshTarget")) {
		//@ts-ignore
		libWrapper.register("Border-Control", "Token.prototype._refreshTarget", BorderFrame.newTarget, "OVERRIDE");
	}
	//@ts-ignore
	libWrapper.register("Border-Control", "Token.prototype._drawNameplate", BorderFrame.drawNameplate, "OVERRIDE");
	//@ts-ignore
	libWrapper.register("Border-Control", "Token.prototype.drawBars", BorderFrame.drawBars, "MIXED");
	//@ts-ignore
	libWrapper.register("Border-Control", "Token.prototype._drawTarget", BorderFrame._drawTarget, "OVERRIDE");
};

export const setupHooks = async (): Promise<void> => {
	setApi(API);
};

export const readyHooks = () => {
	BCC = new BCconfig();

	Hooks.on("renderTokenHUD", (app, html, data) => {
		BorderFrame.AddBorderToggle(app, html, data);
	});

	Hooks.on("createToken", (data) => {
		let token = canvas.tokens.get(data.id);
		if (!token.owner) {
			token.cursor = "default";
		}
	});

	// Removed for conflict with others modules ?
	// canvas.tokens?.placeables.forEach((t) => {
	// 	if (!t.owner) {
	// 		t.cursor = "default";
	// 	}
	// });
};
