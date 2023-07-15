import { warn, error, debug, i18n } from "./lib/lib.mjs";
import CONSTANTS from "./constants.mjs";
import { setApi } from "../module.js";
import API from "./api.mjs";
// import { BCconfig } from "./BCconfig.mjs";
import { BorderFrame } from "./BorderControl.mjs";

// export let BCCBASE;

export const initHooks = async () => {
  // Hooks.once("socketlib.ready", registerSocket);
  // registerSocket();

  Hooks.on("renderSettingsConfig", (app, el, data) => {
    let nC = game.settings.get(CONSTANTS.MODULE_ID, "neutralColor");
    let fC = game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor");
    let hC = game.settings.get(CONSTANTS.MODULE_ID, "hostileColor");
    let cC = game.settings.get(CONSTANTS.MODULE_ID, "controlledColor");
    let pC = game.settings.get(CONSTANTS.MODULE_ID, "partyColor");
    let sC = game.settings.get(CONSTANTS.MODULE_ID, "secretColor");
    let nCE = game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx");
    let fCE = game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx");
    let hCE = game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx");
    let cCE = game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx");
    let pCE = game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx");
    let sCE = game.settings.get(CONSTANTS.MODULE_ID, "secretColorEx");
    const afCE = game.settings.get(CONSTANTS.MODULE_ID, "actorFolderColorEx");
    const cdCE = game.settings.get(CONSTANTS.MODULE_ID, "customDispositionColorEx");

    // let tC = game.settings.get(CONSTANTS.MODULE_ID, "targetColor");
    // let tCE = game.settings.get(CONSTANTS.MODULE_ID, "targetColorEx");

    // let gS = game.settings.get(CONSTANTS.MODULE_ID, "healthGradientA");
    // let gE = game.settings.get(CONSTANTS.MODULE_ID, "healthGradientB");
    // let gT = game.settings.get(CONSTANTS.MODULE_ID, "healthGradientC");
    // let nPC = game.settings.get(CONSTANTS.MODULE_ID, "nameplateColor");
    // let nPCGM = game.settings.get(CONSTANTS.MODULE_ID, "nameplateColorGM");
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

    el.find('[name="Border-Control.secretColor"]')
      .parent()
      .append(`<input type="color"value="${sC}" data-edit="Border-Control.secretColor">`);

    // el.find('[name="Border-Control.targetColor"]')
    //   .parent()
    //   .append(`<input type="color"value="${tC}" data-edit="Border-Control.targetColor">`);

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

    el.find('[name="Border-Control.secretColorEx"]')
      .parent()
      .append(`<input type="color"value="${sCE}" data-edit="Border-Control.secretColorEx">`);

    el.find('[name="Border-Control.actorFolderColorEx"]')
      .parent()
      .append(`<input type="color" value="${afCE}" data-edit="Border-Control.actorFolderColorEx">`);
    el.find('[name="Border-Control.customDispositionColorEx"]')
      .parent()
      .append(`<input type="color" value="${cdCE}" data-edit="Border-Control.customDispositionColorEx">`);

    // el.find('[name="Border-Control.targetColorEx"]')
    //   .parent()
    //   .append(`<input type="color"value="${tCE}" data-edit="Border-Control.targetColorEx">`);

    // el.find('[name="Border-Control.healthGradientA"]')
    //   .parent()
    //   .append(`<input type="color"value="${gS}" data-edit="Border-Control.healthGradientA">`);
    // el.find('[name="Border-Control.healthGradientB"]')
    //   .parent()
    //   .append(`<input type="color"value="${gE}" data-edit="Border-Control.healthGradientB">`);
    // el.find('[name="Border-Control.healthGradientC"]')
    //   .parent()
    //   .append(`<input type="color"value="${gT}" data-edit="Border-Control.healthGradientC">`);
    // el.find('[name="Border-Control.nameplateColor"]')
    //   .parent()
    //   .append(`<input type="color"value="${nPC}" data-edit="Border-Control.nameplateColor">`);
    // el.find('[name="Border-Control.nameplateColorGM"]')
    //   .parent()
    //   .append(`<input type="color"value="${nPCGM}" data-edit="Border-Control.nameplateColorGM">`);
  });

  if (game.settings.get(CONSTANTS.MODULE_ID, "borderControlEnabled")) {
    // setup all the hooks

    Hooks.on("renderTokenConfig", (config, html) => {
      BorderFrame.renderTokenConfig(config, html);
    });

    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype._refreshBorder", BorderFrame.newBorder, "OVERRIDE");
    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype._getBorderColor", BorderFrame.newBorderColor, "OVERRIDE");

    // if (!game.settings.get(CONSTANTS.MODULE_ID, "disableRefreshTarget")) {
    //   //@ts-ignore
    //   libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype._refreshTarget", BorderFrame.newTarget, "OVERRIDE");

    //   //@ts-ignore
    //   libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype._drawTarget", BorderFrame._drawTarget, "OVERRIDE");
    // }

    // if (!game.settings.get(CONSTANTS.MODULE_ID, "disableNameplateDesign")) {
    //   //@ts-ignore
    //   libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     "Token.prototype._drawNameplate",
    //     BorderFrame.drawNameplate,
    //     "OVERRIDE"
    //   );
    // }

    // if (!game.settings.get(CONSTANTS.MODULE_ID, "disableDrawBarsDesign")) {
    //   //@ts-ignore
    //   libWrapper.register(CONSTANTS.MODULE_ID, "Token.prototype.drawBars", BorderFrame.drawBars, "MIXED");
    // }
  }
};

export const setupHooks = async () => {
  setApi(API);
};

export const readyHooks = () => {
  // BCCBASE = new BCconfig();

  if (game.settings.get(CONSTANTS.MODULE_ID, "borderControlEnabled")) {
    Hooks.on("renderTokenHUD", (app, html, data) => {
      BorderFrame.AddBorderToggle(app, html, data);
    });

    Hooks.on("createToken", (data) => {
      let token = canvas.tokens?.get(data.id);
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
