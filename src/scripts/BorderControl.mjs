import { BCconfig } from "./BCconfig.mjs";
import type { BorderControlGraphic } from "./BorderControlModels.mjs";
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
		BORDER_CUSTOM_BASE_OPACITY: "borderCustomBaseOpacity"
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
			"party-member": game.settings.get(CONSTANTS.MODULE_NAME, "partyColor"), //'#33bc4e',
			"party-npc": game.settings.get(CONSTANTS.MODULE_NAME, "partyColor"), //'#33bc4e',
			"friendly-npc": game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor"), //'#43dfdf',
			"neutral-npc": game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor"), //'#f1d836',
			"hostile-npc": game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor"), //'#e72124',

			"controlled-npc": game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor"),
			"neutral-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx"),
			"friendly-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx"),
			"hostile-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx"),
			"controlled-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx"),
			"party-external-member": game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"),
			"party-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"),

			"target-npc": game.settings.get(CONSTANTS.MODULE_NAME, "targetColor"),
			"target-external-npc": game.settings.get(CONSTANTS.MODULE_NAME, "targetColorEx")
		};

		BorderFrame.dispositions = Object.keys(BorderFrame.defaultColors);
	}

	static renderTokenConfig = async function (config, html) {
		const tokenDocument = config.object as TokenDocument;
		if (!game.user?.isGM) {
			return;
		}
		if (!html) {
			return;
		}
		const borderControlDisableValue = config.object.getFlag(
			CONSTANTS.MODULE_NAME,
			BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
		)
			? "checked"
			: "";

		const currentCustomColorTokenInt =
			config.object.getFlag(CONSTANTS.MODULE_NAME, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT) ||
			"#000000";

		const currentCustomColorTokenExt =
			config.object.getFlag(CONSTANTS.MODULE_NAME, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT) ||
			"#000000";

		const currentCustomColorTokenFrameOpacity =
			config.object.getFlag(
				CONSTANTS.MODULE_NAME,
				BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY
			) || 0.5;

		const currentCustomColorTokenBaseOpacity =
			config.object.getFlag(CONSTANTS.MODULE_NAME, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY) ||
			0.5;

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
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE}"
          name="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE}"
          data-dtype="Boolean" ${borderControlDisableValue}>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenInt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT}"
          name="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT}"
          data-dtype="String" value="${currentCustomColorTokenInt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenExt")}</label>
        <input type="color"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT}"
          name="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT}"
          data-dtype="String" value="${currentCustomColorTokenExt}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenFrameOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY}"
          name="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenFrameOpacity}"></input>
      </div>
      <div class="form-group">
        <label>${i18n("Border-Control.label.borderControlCustomColorTokenBaseOpacity")}</label>
        <input type="number"
          min="0" max="1" step="0.1"
          data-edit="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY}"
          name="flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY}"
          data-dtype="Number" value="${currentCustomColorTokenBaseOpacity}"></input>
      </div>
    `;

		nav.parent()
			.find("footer")
			.before(
				$(`
			<div class="tab" data-tab="bordercontrol">
				${formConfig}
			</div>
		`)
			);

		nav.parent()
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
		if (!game.settings.get(CONSTANTS.MODULE_NAME, "hudEnable")) {
			return;
		}
		if (!app?.object?.document) {
			return;
		}

		const borderControlDisableFlag = app.object.document.getFlag(
			CONSTANTS.MODULE_NAME,
			BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
		);

		const borderButton = `
    <div class="control-icon borderControlBorder
      ${borderControlDisableFlag ? "active" : ""}"
      title="Toggle Border Controller"> <i class="fas fa-border-style"></i>
    </div>`;

		const settingHudColClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, "hudColumn") ?? "right";
		const settingHudTopBottomClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, "hudTopBottom") ?? "bottom";

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
			CONSTANTS.MODULE_NAME,
			BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
		);

		for (const token of <Token[]>canvas.tokens?.controlled) {
			//@ts-ignore
			await token.document.setFlag(
				CONSTANTS.MODULE_NAME,
				BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE,
				!borderIsDisabled
			);
			// if (borderIsDisabled) {
			// 	await token.document.unsetFlag(
			// 		CONSTANTS.MODULE_NAME,
			// 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT
			// 	);
			// 	await token.document.unsetFlag(
			// 		CONSTANTS.MODULE_NAME,
			// 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT
			// 	);
			// 	await token.document.unsetFlag(
			// 		CONSTANTS.MODULE_NAME,
			// 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY
			// 	);
			// 	await token.document.unsetFlag(
			// 		CONSTANTS.MODULE_NAME,
			// 		BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY
			// 	);
			// }
		}

		event.currentTarget.classList.toggle("active", !borderIsDisabled);
	}

	static async ToggleCustomBorder(event) {
		//@ts-ignore
		const tokenTmp = <Token>this.object;

		const currentCustomColorTokenInt =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT
			) || "#000000";

		const currentCustomColorTokenExt =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT
			) || "#000000";

		const currentCustomColorTokenFrameOpacity =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY
			) || 0.5;

		const currentCustomColorTokenBaseOpacity =
			tokenTmp.document.getFlag(
				CONSTANTS.MODULE_NAME,
				BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY
			) || 0.5;

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
					callback: async (html: JQuery<HTMLElement>) => {
						const newCurrentCustomColorTokenInt = <string>(
							$(
								<HTMLElement>(
									html.find(`input[data-edit='Border-Control.currentCustomColorTokenInt']`)[0]
								)
							).val()
						);
						const newCurrentCustomColorTokenExt = <string>(
							$(
								<HTMLElement>(
									html.find(`input[data-edit='Border-Control.currentCustomColorTokenExt']`)[0]
								)
							).val()
						);
						const newCurrentCustomColorTokenFrameOpacity = <string>(
							$(
								<HTMLElement>(
									html.find(
										`input[data-edit='Border-Control.currentCustomColorTokenFrameOpacity']`
									)[0]
								)
							).val()
						);
						const newCurrentCustomColorTokenBaseOpacity = <string>(
							$(
								<HTMLElement>(
									html.find(`input[data-edit='Border-Control.currentCustomColorTokenBaseOpacity']`)[0]
								)
							).val()
						);
						for (const token of <Token[]>canvas.tokens?.controlled) {
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT,
								newCurrentCustomColorTokenInt
							);
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT,
								newCurrentCustomColorTokenExt
							);
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_FRAME_OPACITY,
								newCurrentCustomColorTokenFrameOpacity
							);
							token.document.setFlag(
								CONSTANTS.MODULE_NAME,
								BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_BASE_OPACITY,
								newCurrentCustomColorTokenBaseOpacity
							);
						}
					}
				},
				no: {
					label: i18n("Border-Control.label.doNothing"),
					callback: (html) => {
						// Do nothing
					}
				}
			},
			default: "no"
		});
		d.render(true);
	}

	private static clamp(value, max, min) {
		return Math.min(Math.max(value, min), max);
	}

	private static componentToHex(c) {
		const hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	private static rgbToHex(A) {
		if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error("RGB color invalid");
		return (
			"#" + BorderFrame.componentToHex(A[0]) + BorderFrame.componentToHex(A[1]) + BorderFrame.componentToHex(A[2])
		);
	}

	private static hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(<string>result[1], 16),
					g: parseInt(<string>result[2], 16),
					b: parseInt(<string>result[3], 16)
			  }
			: null;
	}

	private static interpolateColor(color1, color2, factor): number[] {
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
	static interpolateColors(color1, color2, steps): number[][] {
		const stepFactor = 1 / (steps - 1);
		const interpolatedColorArray: number[][] = [];

		color1 = color1.match(/\d+/g).map(Number);
		color2 = color2.match(/\d+/g).map(Number);

		for (let i = 0; i < steps; i++) {
			interpolatedColorArray.push(BorderFrame.interpolateColor(color1, color2, stepFactor * i));
		}

		return interpolatedColorArray;
	}

	// static refreshAll() {
	// 	canvas.tokens?.placeables.forEach((t) => t.draw());
	// }

	// ADDED

	static newBorder() {
		const token = <any>this;
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
		let borderColor = <BorderControlGraphic | null>this._getBorderColor();
		if (!borderColor) {
			return;
		}

		switch (game.settings.get(CONSTANTS.MODULE_NAME, "removeBorders")) {
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
			// 	CONSTANTS.MODULE_NAME,
			// 	BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE
			// );
			skipDraw = getProperty(
				token.document,
				`flags.${CONSTANTS.MODULE_NAME}.${BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE}`
			);
		} catch (e) {
			//@ts-ignore
			token.document.setFlag(CONSTANTS.MODULE_NAME, TokenFactions.BORDER_CONTROL_FLAGS.BORDER_DISABLE, false);
			skipDraw = token.document.getFlag(CONSTANTS.MODULE_NAME, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_DISABLE);
		}
		//@ts-ignore
		if (skipDraw) {
			return;
		}

		let t = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
		const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
		//@ts-ignore
		if (game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder") && token._controlled) {
			t = t * 2;
		}
		const sB = game.settings.get(CONSTANTS.MODULE_NAME, "scaleBorder");
		const bS = game.settings.get(CONSTANTS.MODULE_NAME, "borderGridScale");
		const nBS = bS ? (<Canvas.Dimensions>canvas.dimensions)?.size / 100 : 1;
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

		if (game.settings.get(CONSTANTS.MODULE_NAME, "healthGradient")) {
			const systemPath = BCC.currentSystem;
			const stepLevel = BCC.stepLevel;
			const hpMax = getProperty(token, systemPath.max) + (getProperty(token, systemPath.tempMax) ?? 0);
			const hpValue = getProperty(token, systemPath.value);
			const hpDecimal = parseInt(String(BorderFrame.clamp((hpValue / hpMax) * stepLevel, stepLevel, 1))) || 1;
			const color = BorderFrame.rgbToHex(BCC.colorArray[hpDecimal - 1]);
			borderColor.INT = parseInt(color.substr(1), 16);
			if (game.settings.get(CONSTANTS.MODULE_NAME, "tempHPgradient") && getProperty(token, systemPath.temp) > 0) {
				const tempValue = getProperty(token, systemPath.temp);
				const tempDecimal = parseInt(
					String(BorderFrame.clamp((tempValue / (hpMax / 2)) * stepLevel, stepLevel, 1))
				);
				const tempEx = BorderFrame.rgbToHex(BCC.tempArray[tempDecimal - 1]);
				borderColor.EX = parseInt(tempEx.substr(1), 16);
			}
		}

		const textureINT = borderColor.TEXTURE_INT || PIXI.Texture.EMPTY; //await PIXI.Texture.fromURL(<string>token.document.texture.src) || PIXI.Texture.EMPTY;
		const textureEX = borderColor.TEXTURE_EX || PIXI.Texture.EMPTY;

		// Draw Hex border for size 1 tokens on a hex grid
		const gt = CONST.GRID_TYPES;
		const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];

		if (game.settings.get(CONSTANTS.MODULE_NAME, "circleBorders")) {
			// const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
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
			// const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
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
			// const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
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

	public static newBorderColor(hover: boolean): BorderControlGraphic | null {
		const token = <any>this;

		if (!BorderFrame.defaultColors) {
			BorderFrame.onInit();
		}

		const colorFrom = game.settings.get(CONSTANTS.MODULE_NAME, "color-from");
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
				color = <string>game.settings.get(CONSTANTS.MODULE_NAME, `custom-${disposition}-color`);
			}
		}

		const currentCustomColorTokenInt = <string>(
			token.document.getFlag(CONSTANTS.MODULE_NAME, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_INT)
		);
		const currentCustomColorTokenExt = <string>(
			token.document.getFlag(CONSTANTS.MODULE_NAME, BorderFrame.BORDER_CONTROL_FLAGS.BORDER_CUSTOM_COLOR_EXT)
		);

		const overrides = {
			CONTROLLED: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx"))
			} as BorderControlGraphic,
			FRIENDLY: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx"))
			} as BorderControlGraphic,
			NEUTRAL: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx"))
			} as BorderControlGraphic,
			HOSTILE: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx"))
			} as BorderControlGraphic,
			PARTY: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx")).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx"))
			} as BorderControlGraphic,
			ACTOR_FOLDER_COLOR: {
				INT: parseInt(String(color).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx")).substr(1), 16),
				ICON: icon ? String(icon) : "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(color),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "actorFolderColorEx"))
			},
			CUSTOM_DISPOSITION: {
				INT: parseInt(String(color).substr(1), 16),
				EX: parseInt(
					String(game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx")).substr(1),
					16
				),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(color),
				EX_S: String(game.settings.get(CONSTANTS.MODULE_NAME, "customDispositionColorEx"))
			}
		};

		let borderControlCustom: BorderControlGraphic | null = null;
		if (currentCustomColorTokenInt && currentCustomColorTokenInt != "#000000") {
			borderControlCustom = {
				INT: parseInt(String(currentCustomColorTokenInt).substr(1), 16),
				EX: parseInt(String(currentCustomColorTokenExt).substr(1), 16),
				ICON: "",
				TEXTURE_INT: PIXI.Texture.EMPTY,
				TEXTURE_EX: PIXI.Texture.EMPTY,
				INT_S: String(currentCustomColorTokenInt),
				EX_S: String(currentCustomColorTokenExt)
			} as BorderControlGraphic;
		}

		let borderColor: BorderControlGraphic | null = null;
		if (colorFrom === "token-disposition") {
			if (token.controlled) {
				return overrides.CONTROLLED;
			} else if (
				//@ts-ignore
				(hover ?? token.hover) ||
				//@ts-ignore
				canvas.tokens?._highlight ||
				game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder")
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
				canvas.tokens?._highlight ||
				game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder")
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
		const token = <any>this;
		token.target.clear();

		if (!token.targeted.size) {
			return;
		}

		const multiplier = <number>game.settings.get(CONSTANTS.MODULE_NAME, "targetSize");
		const INT = parseInt((<string>game.settings.get(CONSTANTS.MODULE_NAME, "targetColor")).substr(1), 16);
		const EX = parseInt((<string>game.settings.get(CONSTANTS.MODULE_NAME, "targetColorEx")).substr(1), 16);

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
		const token = <any>this;
		const offSet = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
		const yOff = <number>game.settings.get(CONSTANTS.MODULE_NAME, "nameplateOffset");
		const bOff = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") / 2;
		const replaceFont = <string>game.settings.get(CONSTANTS.MODULE_NAME, "plateFont");
		let color =
			game.user?.isGM && [10, 40, 20].includes(token.document.displayName)
				? game.settings.get(CONSTANTS.MODULE_NAME, "nameplateColorGM")
				: game.settings.get(CONSTANTS.MODULE_NAME, "nameplateColor");
		const sizeMulti = <number>game.settings.get(CONSTANTS.MODULE_NAME, "sizeMultiplier");

		if (game.settings.get(CONSTANTS.MODULE_NAME, "circularNameplate")) {
			let style = <any>CONFIG.canvasTextStyle.clone();
			let extraRad = <number>game.settings.get(CONSTANTS.MODULE_NAME, "circularNameplateRadius");
			if (!game.modules.get("custom-nameplates")?.active) {
				style.fontFamily = replaceFont;
				style.fontSize *= sizeMulti;
			}
			if (game.settings.get(CONSTANTS.MODULE_NAME, "plateConsistency")) {
				style.fontSize *= <number>canvas.grid?.size / 100;
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

			var points = <PIXI.Point[]>[];
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
			const style = <any>token._getTextStyle();
			if (!game.modules.get("custom-nameplates")?.active) {
				style.fontFamily = game.settings.get(CONSTANTS.MODULE_NAME, "plateFont");
				style.fontSize *= sizeMulti;
			}
			if (game.settings.get(CONSTANTS.MODULE_NAME, "plateConsistency")) {
				style.fontSize *= <number>canvas.grid?.size / 100;
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
		const token = <any>this;
		if (!game.settings.get(CONSTANTS.MODULE_NAME, "barAlpha") || !game.user?.isGM) {
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
		color = <BorderControlGraphic | null>null,
		border: { width = 2, color: lineColor = 0 } = {}
	} = {}) {
		const token = <any>this;
		const l = <number>canvas.dimensions?.size * size; // Side length.
		const { h, w } = token;
		const lineStyle = { color: lineColor, alpha, width, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.BEVEL };

		color ??= <BorderControlGraphic | null>token._getBorderColor({ hover: true });

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
