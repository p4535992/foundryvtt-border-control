// import { BCconfig } from "./BCconfig.js";
import { BorderControlGraphic } from "./BorderControlModels.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { injectConfig } from "./lib/injectConfig.js";
import { isRealNumber } from "./lib/lib.js";
// import { BCCBASE } from "./main.js";

export class BorderFrame {
  static dispositionKey = (token) => {
    const dispositionValue = parseInt(String(token.document.disposition), 10);
    let disposition;
    if (token.actor && token.actor.hasPlayerOwner && token.actor.type === "character") {
      disposition = "party-member";
    } else if (token.actor && token.actor.hasPlayerOwner) {
      disposition = "party-npc";
    } else if (dispositionValue === 1) {
      disposition = "friendly-npc";
    } else if (dispositionValue === 0) {
      disposition = "neutral-npc";
    } else if (dispositionValue === -1) {
      disposition = "hostile-npc";
    }
    return disposition;
  };

  static defaultColors;

  static dispositions;

  static async onInit() {
    BorderFrame.defaultColors = {
      "friendly-npc": game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor"), //'#43dfdf',
      "neutral-npc": game.settings.get(CONSTANTS.MODULE_ID, "neutralColor"), //'#f1d836',
      "hostile-npc": game.settings.get(CONSTANTS.MODULE_ID, "hostileColor"), //'#e72124',
      "secret-npc": game.settings.get(CONSTANTS.MODULE_ID, "secretColor"), //'#e72124',
      "controlled-npc": game.settings.get(CONSTANTS.MODULE_ID, "controlledColor"), //'0xFF6400'

      "party-member": game.settings.get(CONSTANTS.MODULE_ID, "partyColor"), //'#33bc4e',
      "party-npc": game.settings.get(CONSTANTS.MODULE_ID, "partyColor"), //'#33bc4e',

      "friendly-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx"),
      "neutral-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx"),
      "hostile-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx"),
      "secret-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "secretColorEx"),
      "controlled-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx"),

      "party-external-member": game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx"),
      "party-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx"),

      // "target-npc": game.settings.get(CONSTANTS.MODULE_ID, "targetColor"),
      // "target-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "targetColorEx"),
    };

    BorderFrame.dispositions = Object.keys(BorderFrame.defaultColors);
  }

  static renderTokenConfig = async function (config, html) {
    BorderFrame.renderTokenConfigHandler(config, html);
    /*
    const tokenDocument = config.object;
    if (!game.user?.isGM) {
      return;
    }
    if (!html) {
      return;
    }
    const borderControlDisableValue = config.object.getFlag(
      CONSTANTS.MODULE_ID,
      CONSTANTS.FLAGS.BORDER_DISABLE
    )
      ? "checked"
      : "";

    const currentCustomColorTokenInt =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT) || "#000000";

    const currentCustomColorTokenExt =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT) || "#000000";

    const currentCustomColorTokenFrameOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY) || 0.5;

    const currentCustomColorTokenBaseOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY) || 0.5;

    // Expand the width
    config.position.width = 540;
    config.setPosition(config.position);

    const nav = html.find(`nav.sheet-tabs.tabs[data-group="main"]`);
    nav.append(
      $(`
			<a class="item" data-tab="bordercontrol">
        <i class="fas fa-border-style"></i>
				${Logger.i18n("Border-Control.label.borderControl")}
			</a>
		`)
    );

    const formConfig = `
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomDisable")}</label>
        <input type="checkbox"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_DISABLE}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_DISABLE}"
          data-dtype="Boolean" ${borderControlDisableValue}>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenBaseOpacity}"></input>
      </div>
    `;

    nav
      .parent()
      .find("footer")
      .before(
        $(`
			<div class="tab" data-tab="bordercontrol">
				${formConfig}
			</div>
		`)
      );

    nav
      .parent()
      .find('.tab[data-tab="bordercontrol"] input[type="checkbox"][data-edit]')
      .change(config._onChangeInput.bind(config));
    // nav
    //   .parent()
    //   .find('.tab[data-tab="bordercontrol"] input[type="color"][data-edit]')
    //   .change(config._onChangeInput.bind(config));
    */
  };

  /**
   * Handler called when token configuration window is opened. Injects custom form html and deals
   * with updating token.
   * @category GMOnly
   * @function
   * @async
   * @param {TokenConfig} tokenConfig
   * @param {JQuery} html
   */
  static async renderTokenConfigHandler(tokenConfig, html) {
    // if (!tokenConfig.token.hasPlayerOwner) {
    //   return;
    // }
    if (!html) {
      return;
    }

    injectConfig.inject(
      tokenConfig,
      html,
      {
        moduleId: CONSTANTS.MODULE_ID,
        tab: {
          name: CONSTANTS.MODULE_ID,
          label: Logger.i18n("Border-Control.label.borderControl"),
          icon: "fas fa-border-style",
        },
      },
      tokenConfig.object
    );

    const posTab = html.find(`.tab[data-tab="${CONSTANTS.MODULE_ID}"]`);
    const tokenFlags = tokenConfig.options.sheetConfig
      ? tokenConfig.object.flags
        ? tokenConfig.object.flags[CONSTANTS.MODULE_ID] || {}
        : {}
      : tokenConfig.token.flags
      ? tokenConfig.token.flags[CONSTANTS.MODULE_ID] || {}
      : {};

    const data = {
      hasPlayerOwner: tokenConfig.token.hasPlayerOwner,
      borderControlDisableValue: tokenFlags[CONSTANTS.FLAGS.BORDER_DISABLE] ? "checked" : "",
      currentCustomColorTokenInt: tokenFlags[CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT] || "#000000",
      currentCustomColorTokenExt: tokenFlags[CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT] || "#000000",
      currentCustomColorTokenFrameOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY])
        ? tokenFlags[CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY]
        : 0.5,
      currentCustomColorTokenBaseOpacity: isRealNumber(tokenFlags[CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY])
        ? tokenFlags[CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY]
        : 0.5,
    };

    const insertHTML = await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/token-config.html`, data);
    posTab.append(insertHTML);
  }

  // START NEW MANAGE

  static AddBorderToggle(app, html, data) {
    if (!game.user?.isGM) {
      return;
    }
    if (!game.settings.get(CONSTANTS.MODULE_ID, "hudEnable")) {
      return;
    }
    if (!app?.object?.document) {
      return;
    }

    const borderControlDisableFlag = app.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_DISABLE);

    const borderButton = `
    <div class="control-icon borderControlBorder
      ${borderControlDisableFlag ? "active" : ""}"
      title="Toggle Border Controller"> <i class="fas fa-border-style"></i>
    </div>`;

    const settingHudColClass = game.settings.get(CONSTANTS.MODULE_ID, "hudColumn") ?? "right";
    const settingHudTopBottomClass = game.settings.get(CONSTANTS.MODULE_ID, "hudTopBottom") ?? "bottom";

    const buttonPos = "." + settingHudColClass.toLowerCase();

    const col = html.find(buttonPos);
    if (settingHudTopBottomClass.toLowerCase() === "top") {
      col.prepend(borderButton);
    } else {
      col.append(borderButton);
    }

    html.find(".borderControlBorder").click(this.ToggleBorder.bind(app));
    html.find(".borderControlBorder").contextmenu(this.ToggleCustomBorder.bind(app));
  }

  static async ToggleBorder(event) {
    const borderIsDisabled = this.object.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_DISABLE);

    for (const token of canvas.tokens?.controlled) {
      try {
        await token.document.setFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_DISABLE, !borderIsDisabled);
        token.refresh();
      } catch (e) {
        error(e);
      }
    }

    event.currentTarget.classList.toggle("active", !borderIsDisabled);
  }

  static async ToggleCustomBorder(event) {
    const tokenTmp = this.object;

    const currentCustomColorTokenInt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT) || "#000000";

    const currentCustomColorTokenExt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT) || "#000000";

    const currentCustomColorTokenFrameOpacity = isRealNumber(
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY)
    )
      ? tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY)
      : 0.5;

    const currentCustomColorTokenBaseOpacity = isRealNumber(
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY)
    )
      ? tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY)
      : 0.5;

    const dialogContent = `
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenInt")}</label>
        <input type="color"
          value="${currentCustomColorTokenInt}"
          data-edit="Border-Control.currentCustomColorTokenInt"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenExt")}</label>
        <input type="color"
          value="${currentCustomColorTokenExt}"
          data-edit="Border-Control.currentCustomColorTokenExt"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenFrameOpacity}"
          data-edit="Border-Control.currentCustomColorTokenFrameOpacity"></input>
      </div>
      <div class="form-group">
        <label>${Logger.i18n("Border-Control.label.borderControlCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenBaseOpacity}"
          data-edit="Border-Control.currentCustomColorTokenBaseOpacity"></input>
      </div>
      `;

    const d = new Dialog({
      title: Logger.i18n("Border-Control.label.chooseCustomColorToken"),
      content: dialogContent,
      buttons: {
        yes: {
          label: Logger.i18n("Border-Control.label.applyCustomColor"),

          callback: async (html) => {
            const newCurrentCustomColorTokenInt = $(
              html.find(`input[data-edit='Border-Control.currentCustomColorTokenInt']`)[0]
            ).val();
            const newCurrentCustomColorTokenExt = $(
              html.find(`input[data-edit='Border-Control.currentCustomColorTokenExt']`)[0]
            ).val();
            const newCurrentCustomColorTokenFrameOpacity = $(
              html.find(`input[data-edit='Border-Control.currentCustomColorTokenFrameOpacity']`)[0]
            ).val();
            const newCurrentCustomColorTokenBaseOpacity = $(
              html.find(`input[data-edit='Border-Control.currentCustomColorTokenBaseOpacity']`)[0]
            ).val();
            for (const token of canvas.tokens?.controlled) {
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT,
                newCurrentCustomColorTokenInt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT,
                newCurrentCustomColorTokenExt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.BORDER_CUSTOM_FRAME_OPACITY,
                newCurrentCustomColorTokenFrameOpacity
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                CONSTANTS.FLAGS.BORDER_CUSTOM_BASE_OPACITY,
                newCurrentCustomColorTokenBaseOpacity
              );
            }
          },
        },
        no: {
          label: Logger.i18n("Border-Control.label.doNothing"),
          callback: (html) => {
            // Do nothing
          },
        },
      },
      default: "no",
    });
    d.render(true);
  }

  static _clamp(value, max, min) {
    return Math.min(Math.max(value, min), max);
  }

  static _componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static _rgbToHex(A) {
    if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error("RGB color invalid");
    return (
      "#" + BorderFrame._componentToHex(A[0]) + BorderFrame._componentToHex(A[1]) + BorderFrame._componentToHex(A[2])
    );
  }

  static _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static _interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  }

  // My function to interpolate between two colors completely, returning an array
  static interpolateColors(color1, color2, steps) {
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (let i = 0; i < steps; i++) {
      interpolatedColorArray.push(BorderFrame._interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  }

  // ADDED

  static retrieveListBorderControl(token) {
    const colorFrom = game.settings.get(CONSTANTS.MODULE_ID, "color-from");
    let color;
    let icon;
    if (colorFrom === "token-disposition") {
      const disposition = BorderFrame.dispositionKey(token);
      if (disposition) {
        color = BorderFrame.defaultColors[disposition];
      }
    } else if (colorFrom === "actor-folder-color") {
      if (token.actor && token.actor.folder && token.actor.folder) {
        color = token.actor.folder.color;

        icon = token.actor.folder.icon;
      }
    } else {
      // colorFrom === 'custom-disposition'
      // TODO PUT SOME NEW FLAG ON THE TOKEN
      const disposition = BorderFrame.dispositionKey(token);
      if (disposition) {
        color = game.settings.get(CONSTANTS.MODULE_ID, `custom-${disposition}-color`);
      }
    }

    const currentCustomColorTokenInt = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_INT
    );
    const currentCustomColorTokenExt = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      CONSTANTS.FLAGS.BORDER_CUSTOM_COLOR_EXT
    );

    const overrides = {
      CONTROLLED: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx")),
      },
      FRIENDLY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx")),
      },
      NEUTRAL: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx")),
      },
      HOSTILE: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx")),
      },
      PARTY: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "partyColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "partyColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx")),
      },
      SECRET: {
        INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "secretColor")).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "secretColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "secretColor")),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "secretColorEx")),
      },
      ACTOR_FOLDER_COLOR: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "actorFolderColorEx")).substr(1), 16),
        ICON: icon ? String(icon) : "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(color),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "actorFolderColorEx")),
      },
      CUSTOM_DISPOSITION: {
        INT: parseInt(String(color).substr(1), 16),
        EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "customDispositionColorEx")).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(color),
        EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "customDispositionColorEx")),
      },
    };

    let borderControlCustom = null;
    if (currentCustomColorTokenInt && currentCustomColorTokenInt != "#000000") {
      borderControlCustom = {
        INT: parseInt(String(currentCustomColorTokenInt).substr(1), 16),
        EX: parseInt(String(currentCustomColorTokenExt).substr(1), 16),
        ICON: "",
        TEXTURE_INT: PIXI.Texture.EMPTY,
        TEXTURE_EX: PIXI.Texture.EMPTY,
        INT_S: String(currentCustomColorTokenInt),
        EX_S: String(currentCustomColorTokenExt),
      };
    }

    if (borderControlCustom) {
      return {
        CUSTOM_DISPOSITION_BY_FLAG: borderControlCustom,
      };
    } else {
      return overrides;
    }
  }

  static newBorder(token, permanentBorder = false) {
    token = token ?? this;
    if (!permanentBorder) {
      token.border.clear();
    }

    token.border.position.set(token.document.x, token.document.y);
    if (!token.visible) {
      return;
    }

    let borderColorColor = token._getBorderColor();
    if (!borderColorColor) {
      return;
    }
    let borderColor = null;
    const overrides = BorderFrame.retrieveListBorderControl(token);
    if (overrides.CUSTOM_DISPOSITION_BY_FLAG) {
      borderColor = overrides.CUSTOM_DISPOSITION_BY_FLAG;
    } else {
      for (const [key, override] of Object.entries(overrides)) {
        if (override.INT_S === borderColorColor.css) {
          borderColor = override;
          break;
        }
      }
    }
    if (!borderColor) {
      return;
    }

    switch (game.settings.get(CONSTANTS.MODULE_ID, "removeBorders")) {
      case "0": {
        break;
      }
      case "1": {
        if (!token.owner) {
          return;
        }
        break;
      }
      case "2": {
        return;
      }
    }

    let skipDraw;
    try {
      // skipDraw = token.document.getFlag(
      // 	CONSTANTS.MODULE_ID,
      // 	CONSTANTS.FLAGS.BORDER_DISABLE
      // );
      skipDraw = getProperty(token.document, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.BORDER_DISABLE}`);
    } catch (e) {
      token.document.setFlag(CONSTANTS.MODULE_ID, TokenFactions.CONSTANTS.FLAGS.BORDER_DISABLE, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, CONSTANTS.FLAGS.BORDER_DISABLE);
    }

    if (skipDraw) {
      return;
    }

    let t = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth"); // || CONFIG.Canvas.objectBorderThickness;
    const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");

    if (game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder") && token.controlled) {
      //  && token._controlled
      t = t * 2;
    }
    const sB = game.settings.get(CONSTANTS.MODULE_ID, "scaleBorder");
    const bS = game.settings.get(CONSTANTS.MODULE_ID, "borderGridScale");
    const nBS = bS ? canvas.dimensions?.size / 100 : 1;

    const sX = sB ? token.document.texture.scaleX : 1;

    const sY = sB ? token.document.texture.scaleY : 1;
    const sW = sB ? (token.w - token.w * sX) / 2 : 0;
    const sH = sB ? (token.h - token.h * sY) / 2 : 0;

    const s = sX;
    // const s: any = sB ? token.scale : 1;
    // const sW = sB ? (token.w - token.w * s) / 2 : 0;
    // const sH = sB ? (token.h - token.h * s) / 2 : 0;

    // if (!game.settings.get(CONSTANTS.MODULE_ID, "disableDrawBarsDesign")
    //     && game.settings.get(CONSTANTS.MODULE_ID, "healthGradient")) {
    //   const systemPath = BCC.currentSystem;
    //   const stepLevel = BCC.stepLevel;
    //   const hpMax = getProperty(token, systemPath.max) + (getProperty(token, systemPath.tempMax) ?? 0);
    //   const hpValue = getProperty(token, systemPath.value);
    //   const hpDecimal = parseInt(String(BorderFrame._clamp((hpValue / hpMax) * stepLevel, stepLevel, 1))) || 1;
    //   const color = BorderFrame._rgbToHex(BCC.colorArray[hpDecimal - 1]);
    //   borderColor.INT = parseInt(color.substr(1), 16);
    //   if (game.settings.get(CONSTANTS.MODULE_ID, "tempHPgradient") && getProperty(token, systemPath.temp) > 0) {
    //     const tempValue = getProperty(token, systemPath.temp);
    //     const tempDecimal = parseInt(String(BorderFrame._clamp((tempValue / (hpMax / 2)) * stepLevel, stepLevel, 1)));
    //     const tempEx = BorderFrame._rgbToHex(BCC.tempArray[tempDecimal - 1]);
    //     borderColor.EX = parseInt(tempEx.substr(1), 16);
    //   }
    // }

    const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(token.document.texture.src) || PIXI.Texture.EMPTY;
    const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

    // Draw Hex border for size 1 tokens on a hex grid
    const gt = CONST.GRID_TYPES;
    const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

    if (game.settings.get(CONSTANTS.MODULE_ID, "circleBorders")) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      token.border

        .lineStyle(t * nBS, Color.from(borderColor.EX), 0.8)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + t + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

      token.border

        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + h + t / 2 + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
    } else if (canvas.grid.isHex || (hexTypes.includes(canvas.grid?.type) && token.width === 1 && token.height === 1)) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);

      const polygon = canvas.grid?.grid?.getPolygon(
        -1.5 - q + sW,
        -1.5 - q + sH,
        (token.w + 2) * sX + p,
        (token.h + 2) * sY + p
      );

      // const polygon = canvas.grid?.grid?.getPolygon(
      // 	-1.5 - q + sW,
      // 	-1.5 - q + sH,
      // 	(token.w + 2) * s + p,
      // 	(token.h + 2) * s + p
      // );

      token.border.lineStyle(t * nBS, Color.from(borderColor.EX), 0.8).drawPolygon(polygon);

      token.border.lineStyle((t * nBS) / 2, Color.from(borderColor.INT), 1.0).drawPolygon(polygon);
    }

    // Otherwise Draw Square border
    else {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      token.border

        .lineStyle(t * nBS, Color.from(borderColor.EX), 0.8)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

      token.border

        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
    }
  }

  /**
   * Get the hex color that should be used to render the Token border
   * @param {object} [options]
   * @param {boolean} [options.hover]  Return a border color for this hover state, otherwise use the token's current
   *                                   state.
   * @returns {number|null}            The hex color used to depict the border color
   * @protected
   */
  static newBorderColor({ hover } = {}) {
    // const colors = CONFIG.Canvas.dispositionColors;
    // if ( this.controlled ) return colors.CONTROLLED;
    // else if ( (hover ?? this.hover) || this.layer.highlightObjects ) {
    //   let d = this.document.disposition;
    //   if ( !game.user.isGM && this.isOwner ) return colors.CONTROLLED;
    //   else if ( this.actor?.hasPlayerOwner ) return colors.PARTY;
    //   else if ( d === CONST.TOKEN_DISPOSITIONS.FRIENDLY ) return colors.FRIENDLY;
    //   else if ( d === CONST.TOKEN_DISPOSITIONS.NEUTRAL ) return colors.NEUTRAL;
    //   else if ( d === CONST.TOKEN_DISPOSITIONS.HOSTILE ) return colors.HOSTILE;
    //   else if ( d === CONST.TOKEN_DISPOSITIONS.SECRET ) return this.isOwner ? colors.SECRET : null;
    // }
    // return null;

    const token = this;
    let hoverTmp = hover != undefined && hover != null ? hover : this.hover;

    if (!BorderFrame.defaultColors) {
      BorderFrame.onInit();
    }

    const colorFrom = game.settings.get(CONSTANTS.MODULE_ID, "color-from");
    let borderControlCustom = null;
    const overrides = BorderFrame.retrieveListBorderControl(token);
    if (overrides.CUSTOM_DISPOSITION_BY_FLAG) {
      borderControlCustom = overrides.CUSTOM_DISPOSITION_BY_FLAG;
    }

    let borderColor = null;
    if (colorFrom === "token-disposition") {
      if (token.controlled) {
        borderColor = overrides.CONTROLLED ?? {
          INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColor")).substr(1), 16),
          EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx")).substr(1), 16),
          ICON: "",
          TEXTURE_INT: PIXI.Texture.EMPTY,
          TEXTURE_EX: PIXI.Texture.EMPTY,
          INT_S: String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColor")),
          EX_S: String(game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx")),
        };
      } else if (
        hoverTmp ||
        token.layer.highlightObjects ||
        //canvas.tokens?.highlightObjects ||
        game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder")
      ) {
        if (borderControlCustom) {
          borderColor = borderControlCustom;
        } else {
          const disPath = CONST.TOKEN_DISPOSITIONS;

          const d = parseInt(token.document.disposition);

          if (!game.user?.isGM && token.owner) {
            borderColor = overrides.CONTROLLED;
          } else if (token.actor?.hasPlayerOwner) {
            borderColor = overrides.PARTY;
          } else if (d === disPath.FRIENDLY) {
            borderColor = overrides.FRIENDLY;
          } else if (d === disPath.NEUTRAL) {
            borderColor = overrides.NEUTRAL;
          } else if (d === disPath.HOSTILE) {
            borderColor = overrides.HOSTILE;
          } else if (d === disPath.SECRET) {
            borderColor = token.isOwner ? overrides.SECRET : null;
          } else {
            borderColor = overrides.HOSTILE;
          }
        }
      } else {
        borderColor = null;
      }
    } else if (colorFrom === "actor-folder-color") {
      if (
        hoverTmp ||
        token.layer.highlightObjects ||
        //canvas.tokens?.highlightObjects ||
        game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder")
      ) {
        if (borderControlCustom) {
          borderColor = borderControlCustom;
        } else {
          borderColor = overrides.ACTOR_FOLDER_COLOR;
        }
      } else {
        borderColor = null;
      }
    } else {
      borderColor = null;
    }

    // const finalBorderColor = borderColor
    //   ? Color.from(borderColor.INT)
    //   : Color.from(CONFIG.Canvas.dispositionColors.NEUTRAL);

    const finalBorderColor = borderColor ? Color.from(borderColor.INT) : null;

    return finalBorderColor;
  }

  // TRY TO FIX THE PERMANENT BORDER WITHOUT SUCCESS

  // static tokenApplyRenderFlagsHandler(wrapped, ...args) {
  //   let result = wrapped(...args);
  //   const permanentBorder = game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder");
  //   if (permanentBorder) {
  //     BorderFrame.newBorder(this, true);
  //     // this._refreshBorder();
  //   }

  //   return result;
  // }

  // static tokenPrototypeRefreshHandler = function (wrapped, ...args) {
  //   const permanentBorder = game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder");
  //   if (permanentBorder) {
  //     BorderFrame.newBorder(this, false);
  //     // this._refreshBorder();
  //   }
  //   return wrapped(...args);
  // };

  // static tokenPrototypeRefreshVisibilityHandler = function (wrapped, ...args) {
  //   if (this.isVisible && this.renderable) {
  //     const permanentBorder = game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder");
  //     if (permanentBorder) {
  //       BorderFrame.newBorder(this, false);
  //       // this._refreshBorder();
  //     }
  //   }
  //   return wrapped(...args);
  // }
}
