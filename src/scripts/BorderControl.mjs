import { BCconfig } from "./BCconfig.mjs";
import { BorderControlGraphic } from "./BorderControlModels.mjs";
import CONSTANTS from "./constants.mjs";
import { i18n } from "./lib/lib.mjs";
import { BCCBASE } from "./main.mjs";

export class BorderFrame {
  static BORDER_CONTROL_FLAGS = {
    BORDER_DRAW_FRAME: "borderDrawFrame", //'draw-frame',
    BORDER_DISABLE: "noBorder", // "borderDisable", // 'disable'
    // BORDER_NO_BORDER: "noBorder", // noBorder
    BORDER_CUSTOM_COLOR_INT: "borderCustomColorInt",
    BORDER_CUSTOM_COLOR_EXT: "borderCustomColorExt",
    BORDER_CUSTOM_FRAME_OPACITY: "borderCustomFrameOpacity",
    BORDER_CUSTOM_BASE_OPACITY: "borderCustomBaseOpacity",
  };

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
      "party-member": game.settings.get(CONSTANTS.MODULE_ID, "partyColor"), //'#33bc4e',
      "party-npc": game.settings.get(CONSTANTS.MODULE_ID, "partyColor"), //'#33bc4e',
      "friendly-npc": game.settings.get(CONSTANTS.MODULE_ID, "friendlyColor"), //'#43dfdf',
      "neutral-npc": game.settings.get(CONSTANTS.MODULE_ID, "neutralColor"), //'#f1d836',
      "hostile-npc": game.settings.get(CONSTANTS.MODULE_ID, "hostileColor"), //'#e72124',

      "controlled-npc": game.settings.get(CONSTANTS.MODULE_ID, "controlledColor"),
      "neutral-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "neutralColorEx"),
      "friendly-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "friendlyColorEx"),
      "hostile-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "hostileColorEx"),
      "controlled-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "controlledColorEx"),
      "party-external-member": game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx"),
      "party-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "partyColorEx"),

      "target-npc": game.settings.get(CONSTANTS.MODULE_ID, "targetColor"),
      "target-external-npc": game.settings.get(CONSTANTS.MODULE_ID, "targetColorEx"),
    };

    BorderFrame.dispositions = Object.keys(BorderFrame.defaultColors);
  }

  static renderTokenConfig = async function (config, html) {
    const tokenDocument = config.object;
    if (!game.user?.isGM) {
      return;
    }
    if (!html) {
      return;
    }
    const borderControlDisableValue = config.object.getFlag(
      CONSTANTS.MODULE_ID,
      BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
    )
      ? "checked"
      : "";

    const currentCustomColorTokenInt =
      config.object.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT) ||
      "#000000";

    const currentCustomColorTokenExt =
      config.object.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT) ||
      "#000000";

    const currentCustomColorTokenFrameOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY) || 0.5;

    const currentCustomColorTokenBaseOpacity =
      config.object.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY) || 0.5;

    // Expand the width
    config.position.width = 540;
    config.setPosition(config.position);

    const nav = html.find(`nav.sheet-tabs.tabs[data-group="main"]`);
    nav.append(
      $(`
			<a class="item" data-tab="bordercontrol">
        <i class="fas fa-border-style"></i>
				${i18n("Border-Control.label.borderControl")}
			</a>
		`)
    );

    const formConfig = `
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomDisable")}</label>
        <input type="checkbox"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE}"
          name="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE}"
          data-dtype="Boolean" ${borderControlDisableValue}>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY}"
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
  };

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

    const borderControlDisableFlag = app.object.document.getFlag(
      CONSTANTS.MODULE_ID,
      BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
    );

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
    //@ts-ignore
    const borderIsDisabled = this.object.document.getFlag(
      CONSTANTS.MODULE_ID,
      BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
    );

    for (const token of canvas.tokens?.controlled) {
      //@ts-ignore
      await token.document.setFlag(
        CONSTANTS.MODULE_ID,
        BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE,
        !borderIsDisabled
      );
      // if (borderIsDisabled) {
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT
      // 	);
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT
      // 	);
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY
      // 	);
      // 	await token.document.unsetFlag(
      // 		CONSTANTS.MODULE_ID,
      // 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY
      // 	);
      // }
    }

    event.currentTarget.classList.toggle("active", !borderIsDisabled);
  }

  static async ToggleCustomBorder(event) {
    //@ts-ignore
    const tokenTmp = this.object;

    const currentCustomColorTokenInt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT) ||
      "#000000";

    const currentCustomColorTokenExt =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT) ||
      "#000000";

    const currentCustomColorTokenFrameOpacity =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY) ||
      0.5;

    const currentCustomColorTokenBaseOpacity =
      tokenTmp.document.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY) ||
      0.5;

    const dialogContent = `
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenInt")}</label>
        <input type="color"
          value="${currentCustomColorTokenInt}"
          data-edit="Border-Control.currentCustomColorTokenInt"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenExt")}</label>
        <input type="color"
          value="${currentCustomColorTokenExt}"
          data-edit="Border-Control.currentCustomColorTokenExt"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenFrameOpacity}"
          data-edit="Border-Control.currentCustomColorTokenFrameOpacity"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          value="${currentCustomColorTokenBaseOpacity}"
          data-edit="Border-Control.currentCustomColorTokenBaseOpacity"></input>
      </div>
      `;

    const d = new Dialog({
      title: i18n("Border-Control.label.chooseCustomColorToken"),
      content: dialogContent,
      buttons: {
        yes: {
          label: i18n("Border-Control.label.applyCustomColor"),
          //@ts-ignore
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
                BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT,
                newCurrentCustomColorTokenInt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT,
                newCurrentCustomColorTokenExt
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY,
                newCurrentCustomColorTokenFrameOpacity
              );
              token.document.setFlag(
                CONSTANTS.MODULE_ID,
                BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY,
                newCurrentCustomColorTokenBaseOpacity
              );
            }
          },
        },
        no: {
          label: i18n("Border-Control.label.doNothing"),
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

  static newBorder() {
    const token = this;
    let BCC;
    if (BCCBASE) {
      // BCC = new BCconfig();
      BCC = BCCBASE;
    } else {
      BCC = new BCconfig();
    }

    //@ts-ignore
    this.border.clear();
    //@ts-ignore
    this.border.position.set(this.document.x, this.document.y);
    //@ts-ignore
    if (!this.visible) {
      return;
    }
    //@ts-ignore
    let borderColor = this._getBorderColor();
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

    //@ts-ignore
    let skipDraw;
    try {
      // skipDraw = token.document.getFlag(
      // 	CONSTANTS.MODULE_ID,
      // 	BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
      // );
      skipDraw = getProperty(
        token.document,
        `flags.${CONSTANTS.MODULE_ID}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE}`
      );
    } catch (e) {
      //@ts-ignore
      token.document.setFlag(CONSTANTS.MODULE_ID, TokenFactions.BORDER_CONTROL_FLAGS.BORDER_DISABLE, false);
      skipDraw = token.document.getFlag(CONSTANTS.MODULE_ID, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE);
    }
    //@ts-ignore
    if (skipDraw) {
      return;
    }

    let t = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
    const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
    //@ts-ignore
    if (game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder") && token._controlled) {
      t = t * 2;
    }
    const sB = game.settings.get(CONSTANTS.MODULE_ID, "scaleBorder");
    const bS = game.settings.get(CONSTANTS.MODULE_ID, "borderGridScale");
    const nBS = bS ? canvas.dimensions?.size / 100 : 1;
    //@ts-ignore
    const sX = sB ? token.document.texture.scaleX : 1;
    //@ts-ignore
    const sY = sB ? token.document.texture.scaleY : 1;
    const sW = sB ? (token.w - token.w * sX) / 2 : 0;
    const sH = sB ? (token.h - token.h * sY) / 2 : 0;

    const s = sX;
    // const s: any = sB ? token.scale : 1;
    // const sW = sB ? (token.w - token.w * s) / 2 : 0;
    // const sH = sB ? (token.h - token.h * s) / 2 : 0;

    if (game.settings.get(CONSTANTS.MODULE_ID, "healthGradient")) {
      const systemPath = BCC.currentSystem;
      const stepLevel = BCC.stepLevel;
      const hpMax = getProperty(token, systemPath.max) + (getProperty(token, systemPath.tempMax) ?? 0);
      const hpValue = getProperty(token, systemPath.value);
      const hpDecimal = parseInt(String(BorderFrame._clamp((hpValue / hpMax) * stepLevel, stepLevel, 1))) || 1;
      const color = BorderFrame._rgbToHex(BCC.colorArray[hpDecimal - 1]);
      borderColor.INT = parseInt(color.substr(1), 16);
      if (game.settings.get(CONSTANTS.MODULE_ID, "tempHPgradient") && getProperty(token, systemPath.temp) > 0) {
        const tempValue = getProperty(token, systemPath.temp);
        const tempDecimal = parseInt(String(BorderFrame._clamp((tempValue / (hpMax / 2)) * stepLevel, stepLevel, 1)));
        const tempEx = BorderFrame._rgbToHex(BCC.tempArray[tempDecimal - 1]);
        borderColor.EX = parseInt(tempEx.substr(1), 16);
      }
    }

    const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(token.document.texture.src) || PIXI.Texture.EMPTY;
    const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

    // Draw Hex border for size 1 tokens on a hex grid
    const gt = CONST.GRID_TYPES;
    const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

    if (game.settings.get(CONSTANTS.MODULE_ID, "circleBorders")) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      //@ts-ignore
      token.border
        //@ts-ignore
        .lineStyle(t * nBS, Color.from(borderColor.EX), 0.8)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + t + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);

      //@ts-ignore
      token.border
        //@ts-ignore
        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawCircle(token.x + token.w / 2, token.y + token.h / 2, (token.w / 2) * sX + h + t / 2 + p);
        .drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
    } else if (
      //@ts-ignore
      canvas.grid.isHex ||
      //@ts-ignore
      (hexTypes.includes(canvas.grid?.type) && token.width === 1 && token.height === 1)
    ) {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);
      //@ts-ignore
      const polygon = canvas.grid?.grid?.getPolygon(
        -1.5 - q + sW,
        -1.5 - q + sH,
        (token.w + 2) * sX + p,
        (token.h + 2) * sY + p
      );
      //@ts-ignore
      // const polygon = canvas.grid?.grid?.getPolygon(
      // 	-1.5 - q + sW,
      // 	-1.5 - q + sH,
      // 	(token.w + 2) * s + p,
      // 	(token.h + 2) * s + p
      // );

      //@ts-ignore
      token.border.lineStyle(t * nBS, Color.from(borderColor.EX), 0.8).drawPolygon(polygon);

      //@ts-ignore
      token.border.lineStyle((t * nBS) / 2, Color.from(borderColor.INT), 1.0).drawPolygon(polygon);
    }

    // Otherwise Draw Square border
    else {
      // const p = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
      const q = Math.round(p / 2);
      const h = Math.round(t / 2);
      const o = Math.round(h / 2);

      //@ts-ignore
      token.border
        //@ts-ignore
        .lineStyle(t * nBS, Color.from(borderColor.EX), 0.8)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);

      //@ts-ignore
      token.border
        //@ts-ignore
        .lineStyle(h * nBS, Color.from(borderColor.INT), 1.0)
        // .drawRoundedRect(token.x, token.y, token.w, token.h, 3);
        .drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
    }
  }

  static newBorderColor(hover) {
    const token = this;

    if (!BorderFrame.defaultColors) {
      BorderFrame.onInit();
    }

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
        //@ts-ignore
        color = token.actor.folder.color;
        //@ts-ignore
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
      BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT
    );
    const currentCustomColorTokenExt = token.document.getFlag(
      CONSTANTS.MODULE_ID,
      BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT
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

    let borderColor = null;
    if (colorFrom === "token-disposition") {
      if (token.controlled) {
        return overrides.CONTROLLED;
      } else if (
        //@ts-ignore
        (hover ?? token.hover) ||
        //@ts-ignore
        canvas.tokens?.highlightObjects ||
        game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder")
      ) {
        if (borderControlCustom) {
          borderColor = borderControlCustom;
        } else {
          const disPath = CONST.TOKEN_DISPOSITIONS;

          //@ts-ignore
          const d = parseInt(token.document.disposition);
          //@ts-ignore
          if (!game.user?.isGM && token.owner) {
            borderColor = overrides.CONTROLLED;
          }
          //@ts-ignore
          else if (token.actor?.hasPlayerOwner) {
            borderColor = overrides.PARTY;
          } else if (d === disPath.FRIENDLY) {
            borderColor = overrides.FRIENDLY;
          } else if (d === disPath.NEUTRAL) {
            borderColor = overrides.NEUTRAL;
          } else {
            borderColor = overrides.HOSTILE;
          }
        }
      } else {
        // colorFrom === 'custom-disposition'
        // borderColor = overrides.CUSTOM_DISPOSITION;
        borderColor = null;
      }
    } else if (colorFrom === "actor-folder-color") {
      if (
        //@ts-ignore
        (hover ?? token.hover) ||
        //@ts-ignore
        canvas.tokens?.highlightObjects ||
        game.settings.get(CONSTANTS.MODULE_ID, "permanentBorder")
      ) {
        if (borderControlCustom) {
          borderColor = borderControlCustom;
        } else {
          borderColor = overrides.ACTOR_FOLDER_COLOR;
        }
      } else {
        // colorFrom === 'custom-disposition'
        // borderColor = overrides.CUSTOM_DISPOSITION;
        borderColor = null;
      }
    } else {
      // colorFrom === 'custom-disposition'
      // borderColor = overrides.CUSTOM_DISPOSITION;
      borderColor = null;
    }

    return borderColor;
  }

  /* -------------------------------------------- */
  /* DEPRECATED METHODS USE OTHERS MODULE INSTEAD */
  /* -------------------------------------------- */

  // static getActorHpPath() {
  // 	switch (game.system.id) {
  // 		case "symbaroum": {
  // 			return {
  // 				value: "actor.system.health.toughness.value",
  // 				max: "actor.system.health.toughness.max",
  // 				tempMax: undefined,
  // 				temp: undefined
  // 			};
  // 		}
  // 		case "dnd5e": {
  // 			return {
  // 				value: "actor.system.attributes.hp.value",
  // 				max: "actor.system.attributes.hp.max",
  // 				tempMax: "actor.system.attributes.hp.tempmax",
  // 				temp: "actor.system.attributes.hp.temp"
  // 			};
  // 		}
  // 		default: {
  // 			return {
  // 				value: "actor.system.attributes.hp.value",
  // 				max: "actor.system.attributes.hp.max",
  // 				tempMax: "actor.system.attributes.hp.tempmax",
  // 				temp: "actor.system.attributes.hp.temp"
  // 			};
  // 		}
  // 	}
  // }

  /**
   * @deprecated use instead other modules
   * @param reticule
   * @returns
   */
  static newTarget(reticule) {
    const token = this;
    token.target.clear();

    if (!token.targeted.size) {
      return;
    }

    const multiplier = game.settings.get(CONSTANTS.MODULE_ID, "targetSize");
    const INT = parseInt(game.settings.get(CONSTANTS.MODULE_ID, "targetColor").substr(1), 16);
    const EX = parseInt(game.settings.get(CONSTANTS.MODULE_ID, "targetColorEx").substr(1), 16);

    // Determine whether the current user has target and any other users
    const [others, user] = Array.from(token.targeted).partition((u) => u === game.user);

    // For the current user, draw the target arrows
    if (user.length) {
      token._drawTarget(reticule);
    }
    // For other users, draw offset pips
    const hw = token.w / 2;
    for (let [i, u] of others.entries()) {
      const offset = Math.floor((i + 1) / 2) * 16;
      const sign = i % 2 === 0 ? 1 : -1;
      const x = hw + sign * offset;
      //@ts-ignore
      token.target.beginFill(Color.from(u.color), 1.0).lineStyle(2, 0x0000000).drawCircle(x, 0, 6);
    }
  }

  /**
   * @deprecated use instead other modules
   * @returns
   */
  static drawNameplate() {
    const token = this;
    const offSet = game.settings.get(CONSTANTS.MODULE_ID, "borderOffset");
    const yOff = game.settings.get(CONSTANTS.MODULE_ID, "nameplateOffset");
    const bOff = game.settings.get(CONSTANTS.MODULE_ID, "borderWidth") / 2;
    const replaceFont = game.settings.get(CONSTANTS.MODULE_ID, "plateFont");
    let color =
      game.user?.isGM && [10, 40, 20].includes(token.document.displayName)
        ? game.settings.get(CONSTANTS.MODULE_ID, "nameplateColorGM")
        : game.settings.get(CONSTANTS.MODULE_ID, "nameplateColor");
    const sizeMulti = game.settings.get(CONSTANTS.MODULE_ID, "sizeMultiplier");

    if (game.settings.get(CONSTANTS.MODULE_ID, "circularNameplate")) {
      let style = CONFIG.canvasTextStyle.clone();
      let extraRad = game.settings.get(CONSTANTS.MODULE_ID, "circularNameplateRadius");
      if (!game.modules.get("custom-nameplates")?.active) {
        style.fontFamily = replaceFont;
        style.fontSize *= sizeMulti;
      }
      if (game.settings.get(CONSTANTS.MODULE_ID, "plateConsistency")) {
        style.fontSize *= canvas.grid?.size / 100;
      }
      style.fill = color;
      var text = new PreciseText(token.name, style);
      text.resolution = 4;
      text.style.trim = true;
      text.updateText(true);

      var radius = token.w / 2 + text.texture.height + bOff + extraRad;
      var maxRopePoints = 100;
      var step = Math.PI / maxRopePoints;

      var ropePoints = maxRopePoints - Math.round((text.texture.width / (radius * Math.PI)) * maxRopePoints);
      ropePoints /= 2;

      var points = [];
      for (var i = maxRopePoints - ropePoints; i > ropePoints; i--) {
        var x = radius * Math.cos(step * i);
        var y = radius * Math.sin(step * i);
        points.push(new PIXI.Point(-x, -y));
      }
      const name = new PIXI.SimpleRope(text.texture, points);
      name.rotation = Math.PI;
      name.position.set(token.w / 2, token.h / 2 + yOff);
      return name;
    } else {
      //@ts-ignore
      const style = token._getTextStyle();
      if (!game.modules.get("custom-nameplates")?.active) {
        style.fontFamily = game.settings.get(CONSTANTS.MODULE_ID, "plateFont");
        style.fontSize *= sizeMulti;
      }
      if (game.settings.get(CONSTANTS.MODULE_ID, "plateConsistency")) {
        style.fontSize *= canvas.grid?.size / 100;
      }
      style.fill = color;

      const name = new PreciseText(token.document.name, style);
      name.anchor.set(0.5, 0);
      name.position.set(token.w / 2, token.h + bOff + yOff + offSet);
      return name;
    }
  }

  /**
   * @deprecated use instead other modules
   * @param wrapped
   * @param args
   * @returns
   */
  static drawBars(wrapped, ...args) {
    const token = this;
    if (!game.settings.get(CONSTANTS.MODULE_ID, "barAlpha") || !game.user?.isGM) {
      return wrapped(...args);
    }
    if (!token.actor || [50, 0, 30].includes(token.document.displayBars)) {
      return wrapped(...args);
    } else {
      return ["bar1", "bar2"].forEach((b, i) => {
        const bar = token.bars[b];
        const attr = token.document.getBarAttribute(b);
        if (!attr || attr.type !== "bar") {
          return (bar.visible = false);
        }
        token._drawBar(i, bar, attr);
        bar.visible = true;
        bar.alpha = 0.5;
        token.bars.visible = token._canViewMode(token.document.displayBars);
        return token.bars.visible;
      });
    }
  }

  /**
   * Draw the targeting arrows around this token.
   * @param {ReticuleOptions} [reticule]  Additional parameters to configure how the targeting reticule is drawn.
   * @protected
   * @deprecated use instead other modules
   */
  static _drawTarget({
    margin: m = 0,
    alpha = 1,
    size = 0.15,
    color = null,
    border: { width = 2, color: lineColor = 0 } = {},
  } = {}) {
    const token = this;
    const l = canvas.dimensions?.size * size; // Side length.
    const { h, w } = token;
    const lineStyle = { color: lineColor, alpha, width, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.BEVEL };

    color ??= token._getBorderColor({ hover: true });

    m *= l * -1;

    token.target
      //@ts-ignore
      .beginFill(Color.from(color.INT), alpha)
      .lineStyle(lineStyle)
      .drawPolygon([-m, -m, -m - l, -m, -m, -m - l]) // Top left
      .drawPolygon([w + m, -m, w + m + l, -m, w + m, -m - l]) // Top right
      .drawPolygon([-m, h + m, -m - l, h + m, -m, h + m + l]) // Bottom left
      .drawPolygon([w + m, h + m, w + m + l, h + m, w + m, h + m + l]); // Bottom right
  }
}
