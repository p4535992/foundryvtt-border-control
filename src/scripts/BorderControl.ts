import { BCconfig } from "./BCconfig";
import CONSTANTS from "./constants";
import { BCC } from "./module";

export class BorderFrame {
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

	static AddBorderToggle(app, html, data) {
		if (!game.user?.isGM) {
			return;
		}
		if (!game.settings.get(CONSTANTS.MODULE_NAME, "enableHud")) {
			return;
		}
		const buttonPos = game.settings.get(CONSTANTS.MODULE_NAME, "hudPos");
		const noBorder = <boolean>app.object.document.flags[CONSTANTS.MODULE_NAME]?.noBorder;
		const borderButton = `<div class="control-icon border ${noBorder ? "active" : ""}" 
			title="Toggle Border"> <i class="fas fa-border-style"></i></div>`;
		let Pos = html.find(buttonPos);
		Pos.append(borderButton);
		html.find(".border").click(this.ToggleBorder.bind(app));
	}

	static async ToggleBorder(event) {
		//@ts-ignore
		const token: Token = this.object;
		const border = token.document.getFlag(CONSTANTS.MODULE_NAME, "noBorder");
		await token.document.setFlag(CONSTANTS.MODULE_NAME, "noBorder", !border);
		event.currentTarget.classList.toggle("active", !border);
	}
	static newBorder() {
		const token = <any>this;
		if (!BCC) {
			//@ts-ignore
			BCC = new BCconfig();
		}

		token.border?.clear();

		let borderColorBase = <number | null>token._getBorderColor();
		if (!borderColorBase) {
			return;
		}
		let borderColor = {
			INT: borderColorBase,
			EX: parseInt(String("#000000").substr(1), 16)
		};
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

		if (token.document.flags[CONSTANTS.MODULE_NAME]?.noBorder) {
			return;
		}
		let t = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderWidth") || CONFIG.Canvas.objectBorderThickness;
		token.border?.position.set(token.document.x, token.document.y);

		if (game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder") && token.controlled) {
			t = t * 2;
		}
		const sB = game.settings.get(CONSTANTS.MODULE_NAME, "scaleBorder");
		const bS = game.settings.get(CONSTANTS.MODULE_NAME, "borderGridScale");
		const nBS = bS ? <number>canvas.dimensions?.size / 100 : 1;

		const s = sB ? <number>(<unknown>token.scale) : 1;
		const sW = sB ? (token.w - token.w * s) / 2 : 0;
		const sH = sB ? (token.h - token.h * s) / 2 : 0;

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
		// Draw Hex border for size 1 tokens on a hex grid
		const gt = CONST.GRID_TYPES;
		const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
		if (game.settings.get(CONSTANTS.MODULE_NAME, "circleBorders")) {
			const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);
			token.border
				.lineStyle(t * nBS, borderColor.EX, 0.8)
				.drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + t + p);
			token.border
				.lineStyle(h * nBS, borderColor.INT, 1.0)
				.drawCircle(token.w / 2, token.h / 2, (token.w / 2) * s + h + t / 2 + p);
		} else if (hexTypes.includes(<any>canvas.grid?.type) && token.width === 1 && token.height === 1) {
			const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			const q = Math.round(p / 2);
			//@ts-ignore
			const polygon = canvas.grid?.grid?.getPolygon(
				-1.5 - q + sW,
				-1.5 - q + sH,
				(token.w + 2) * s + p,
				(token.h + 2) * s + p
			);
			token.border.lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon);
			token.border.lineStyle((t * nBS) / 2, borderColor.INT, 1.0).drawPolygon(polygon);
		}

		// Otherwise Draw Square border
		else {
			const p = <number>game.settings.get(CONSTANTS.MODULE_NAME, "borderOffset");
			const q = Math.round(p / 2);
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);
			token.border
				.lineStyle(t * nBS, borderColor.EX, 0.8)
				.drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
			token.border
				.lineStyle(h * nBS, borderColor.INT, 1.0)
				.drawRoundedRect(-o - q + sW, -o - q + sH, (token.w + h) * s + p, (token.h + h) * s + p, 3);
		}
		return;
	}

	static clamp(value, max, min) {
		return Math.min(Math.max(value, min), max);
	}
	static newBorderColor(hover: boolean) {
		const token = <any>this;
		const overrides = {
			CONTROLLED: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "controlledColorEx")).substr(1), 16)
			},
			FRIENDLY: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "friendlyColorEx")).substr(1), 16)
			},
			NEUTRAL: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "neutralColorEx")).substr(1), 16)
			},
			HOSTILE: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "hostileColorEx")).substr(1), 16)
			},
			PARTY: {
				INT: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColor")).substr(1), 16),
				EX: parseInt(String(game.settings.get(CONSTANTS.MODULE_NAME, "partyColorEx")).substr(1), 16)
			}
		};

		if (token.controlled) {
			return overrides.CONTROLLED;
		} else if (
			(hover ?? token.hover) ||
			//@ts-ignore
			canvas.tokens?._highlight ||
			game.settings.get(CONSTANTS.MODULE_NAME, "permanentBorder")
		) {
			let disPath = CONST.TOKEN_DISPOSITIONS;

			let d = parseInt(token.document.disposition);
			if (!game.user?.isGM && token.owner) {
				return overrides.CONTROLLED;
			} else if (token.actor?.hasPlayerOwner) {
				return overrides.PARTY;
			} else if (d === disPath.FRIENDLY) {
				return overrides.FRIENDLY;
			} else if (d === disPath.NEUTRAL) {
				return overrides.NEUTRAL;
			} else {
				return overrides.HOSTILE;
			}
		} else {
			return null;
		}
	}

	static newTarget(reticule) {
		const token = <any>this;
		const multiplier = <number>game.settings.get(CONSTANTS.MODULE_NAME, "targetSize");
		const INT = parseInt((<string>game.settings.get(CONSTANTS.MODULE_NAME, "targetColor")).substr(1), 16);
		const EX = parseInt((<string>game.settings.get(CONSTANTS.MODULE_NAME, "targetColorEx")).substr(1), 16);

		token.target.clear();
		if (!token.targeted.size) {
			return;
		}

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

	static componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	static rgbToHex(A) {
		if (A[0] === undefined || A[1] === undefined || A[2] === undefined) console.error("RGB color invalid");
		return (
			"#" + BorderFrame.componentToHex(A[0]) + BorderFrame.componentToHex(A[1]) + BorderFrame.componentToHex(A[2])
		);
	}

	static hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(<string>result[1], 16),
					g: parseInt(<string>result[2], 16),
					b: parseInt(<string>result[3], 16)
			  }
			: null;
	}

	static interpolateColor(color1, color2, factor) {
		if (arguments.length < 3) {
			factor = 0.5;
		}
		var result = color1.slice();
		for (var i = 0; i < 3; i++) {
			result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
		}
		return result;
	}

	// My function to interpolate between two colors completely, returning an array
	static interpolateColors(color1, color2, steps): number[] {
		var stepFactor = 1 / (steps - 1);
		var interpolatedColorArray: number[] = [];

		color1 = color1.match(/\d+/g).map(Number);
		color2 = color2.match(/\d+/g).map(Number);

		for (var i = 0; i < steps; i++) {
			interpolatedColorArray.push(BorderFrame.interpolateColor(color1, color2, stepFactor * i));
		}

		return interpolatedColorArray;
	}

	static getActorHpPath() {
		switch (game.system.id) {
			case "symbaroum": {
				return {
					value: "actor.system.health.toughness.value",
					max: "actor.system.health.toughness.max",
					tempMax: undefined,
					temp: undefined
				};
			}
			case "dnd5e": {
				return {
					value: "actor.system.attributes.hp.value",
					max: "actor.system.attributes.hp.max",
					tempMax: "actor.system.attributes.hp.tempmax",
					temp: "actor.system.attributes.hp.temp"
				};
			}
		}
	}

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

	static refreshAll() {
		canvas.tokens?.placeables.forEach((t) => t.draw());
	}

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
			});
		}
	}

	/* -------------------------------------------- */

	/**
	 * Draw the targeting arrows around this token.
	 * @param {ReticuleOptions} [reticule]  Additional parameters to configure how the targeting reticule is drawn.
	 * @protected
	 */
	static _drawTarget({
		margin: m = 0,
		alpha = 1,
		size = 0.15,
		color = <any>null,
		border: { width = 2, color: lineColor = 0 } = {}
	} = {}) {
		const token = <any>this;
		const l = <number>canvas.dimensions?.size * size; // Side length.
		const { h, w } = token;
		const lineStyle = { color: lineColor, alpha, width, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.BEVEL };
		//@ts-ignore
		color ??= <number | null>token._getBorderColor({ hover: true });

		m *= l * -1;
		//@ts-ignore
		token.target
			.beginFill(color.INT, alpha)
			.lineStyle(lineStyle)
			.drawPolygon([-m, -m, -m - l, -m, -m, -m - l]) // Top left
			.drawPolygon([w + m, -m, w + m + l, -m, w + m, -m - l]) // Top right
			.drawPolygon([-m, h + m, -m - l, h + m, -m, h + m + l]) // Bottom left
			.drawPolygon([w + m, h + m, w + m + l, h + m, w + m, h + m + l]); // Bottom right
	}
}
