let BCC;
Hooks.on("ready", () => (BCC = new BCconfig()));
Hooks.on("renderTokenHUD", (app, html, data) => {
	BorderFrame.AddBorderToggle(app, html, data);
});
class BCconfig {
	constructor() {
		this.symbaroum = {
			value: "actor.system.health.toughness.value",
			max: "actor.system.health.toughness.max",
			tempMax: undefined,
			temp: undefined
		};
		this.dnd5e = {
			value: "actor.system.attributes.hp.value",
			max: "actor.system.attributes.hp.max",
			tempMax: undefined,
			temp: "actor.system.attributes.hp.temp"
		};
		this.pf2e = {
			value: "actor.system.attributes.hp.value",
			max: "actor.system.attributes.hp.max",
			tempMax: "actor.system.attributes.hp.tempmax",
			temp: "actor.system.attributes.hp.temp"
		};
		this.pf1 = {
			value: "actor.system.attributes.hp.value",
			max: "actor.system.attributes.hp.max",
			tempMax: undefined,
			temp: "actor.system.attributes.hp.temp"
		};
		this.swade = {
			value: "actor.system.wounds.value",
			max: "actor.system.wounds.max",
			tempMax: undefined,
			temp: undefined
		};

		this.stepLevel = game.settings.get("Border-Control", "stepLevel");
		this.endColor = Color.from(game.settings.get("Border-Control", "healthGradientA")).rgb;
		this.startColor = Color.from(game.settings.get("Border-Control", "healthGradientB")).rgb;
		this.tempColor = Color.from(game.settings.get("Border-Control", "healthGradientC")).rgb;
		this.colorArray = BorderFrame.interpolateColors(
			`rgb(${this.startColor[0] * 255}, ${this.startColor[1] * 255}, ${this.startColor[2] * 255})`,
			`rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`,
			this.stepLevel
		);
		this.tempArray = BorderFrame.interpolateColors(
			`rgb(${this.endColor[0] * 255}, ${this.endColor[1] * 255}, ${this.endColor[2] * 255})`,
			`rgb(${this.tempColor[0] * 255}, ${this.tempColor[1] * 255}, ${this.tempColor[2] * 255})`,
			this.stepLevel
		);

		this.currentSystem = this[game.system.id];
	}
}
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

Hooks.on("createToken", (data) => {
	let token = canvas.tokens.get(data.id);
	if (!token.owner) token.cursor = "default";
});

Hooks.once("ready", () => {
	canvas.tokens.placeables.forEach((t) => {
		if (!t.owner) t.cursor = "default";
	});
});

export let BorderFrame = class BorderFrame {
	static AddBorderToggle(app, html, data) {
		if (!game.user.isGM) return;
		if (!game.settings.get("Border-Control", "enableHud")) return;
		const buttonPos = game.settings.get("Border-Control", "hudPos");
		const borderButton = `<div class="control-icon border ${
			app.object.document.flags["Border-Control"]?.noBorder ? "active" : ""
		}" title="Toggle Border"> <i class="fas fa-border-style"></i></div>`;
		let Pos = html.find(buttonPos);
		Pos.append(borderButton);
		html.find(".border").click(this.ToggleBorder.bind(app));
	}

	static async ToggleBorder(event) {
		const border = this.object.document.getFlag("Border-Control", "noBorder");
		await this.object.document.setFlag("Border-Control", "noBorder", !border);
		event.currentTarget.classList.toggle("active", !border);
	}
	static newBorder() {
		if (!BCC) BCC = new BCconfig();

		this.border.clear();
		let borderColor = this._getBorderColor();
		if (!borderColor) return;
		switch (game.settings.get("Border-Control", "removeBorders")) {
			case "0":
				break;
			case "1":
				if (!this.owner) return;
				break;
			case "2":
				return;
		}
		if (this.document.flags["Border-Control"]?.noBorder) return;
		let t = game.settings.get("Border-Control", "borderWidth") || CONFIG.Canvas.objectBorderThickness;
		this.border.position.set(this.document.x, this.document.y);

		if (game.settings.get("Border-Control", "permanentBorder") && this.controlled) t = t * 2;
		const sB = game.settings.get("Border-Control", "scaleBorder");
		const bS = game.settings.get("Border-Control", "borderGridScale");
		const nBS = bS ? canvas.dimensions.size / 100 : 1;

		const s = sB ? this.scale : 1;
		const sW = sB ? (this.w - this.w * s) / 2 : 0;
		const sH = sB ? (this.h - this.h * s) / 2 : 0;

		if (game.settings.get("Border-Control", "healthGradient")) {
			const systemPath = BCC.currentSystem;
			const stepLevel = BCC.stepLevel;
			const hpMax = getProperty(this, systemPath.max) + (getProperty(this, systemPath.tempMax) ?? 0);
			const hpValue = getProperty(this, systemPath.value);
			const hpDecimal = parseInt(BorderFrame.clamp((hpValue / hpMax) * stepLevel, stepLevel, 1)) || 1;
			const color = BorderFrame.rgbToHex(BCC.colorArray[hpDecimal - 1]);
			borderColor.INT = parseInt(color.substr(1), 16);
			if (game.settings.get("Border-Control", "tempHPgradient") && getProperty(this, systemPath.temp) > 0) {
				const tempValue = getProperty(this, systemPath.temp);
				const tempDecimal = parseInt(BorderFrame.clamp((tempValue / (hpMax / 2)) * stepLevel, stepLevel, 1));
				const tempEx = BorderFrame.rgbToHex(BCC.tempArray[tempDecimal - 1]);
				borderColor.EX = parseInt(tempEx.substr(1), 16);
			}
		}
		// Draw Hex border for size 1 tokens on a hex grid
		const gt = CONST.GRID_TYPES;
		const hexTypes = [gt.HEXEVENQ, gt.HEXEVENR, gt.HEXODDQ, gt.HEXODDR];
		if (game.settings.get("Border-Control", "circleBorders")) {
			const p = game.settings.get("Border-Control", "borderOffset");
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);
			this.border
				.lineStyle(t * nBS, borderColor.EX, 0.8)
				.drawCircle(this.w / 2, this.h / 2, (this.w / 2) * s + t + p);
			this.border
				.lineStyle(h * nBS, borderColor.INT, 1.0)
				.drawCircle(this.w / 2, this.h / 2, (this.w / 2) * s + h + t / 2 + p);
		} else if (hexTypes.includes(canvas.grid.type) && this.width === 1 && this.height === 1) {
			const p = game.settings.get("Border-Control", "borderOffset");
			const q = Math.round(p / 2);
			const polygon = canvas.grid.grid.getPolygon(
				-1.5 - q + sW,
				-1.5 - q + sH,
				(this.w + 2) * s + p,
				(this.h + 2) * s + p
			);
			this.border.lineStyle(t * nBS, borderColor.EX, 0.8).drawPolygon(polygon);
			this.border.lineStyle((t * nBS) / 2, borderColor.INT, 1.0).drawPolygon(polygon);
		}

		// Otherwise Draw Square border
		else {
			const p = game.settings.get("Border-Control", "borderOffset");
			const q = Math.round(p / 2);
			const h = Math.round(t / 2);
			const o = Math.round(h / 2);

			this.border
				.lineStyle(t * nBS, borderColor.EX, 0.8)
				.drawRoundedRect(-o - q + sW, -o - q + sH, (this.w + h) * s + p, (this.h + h) * s + p, 3);
			this.border
				.lineStyle(h * nBS, borderColor.INT, 1.0)
				.drawRoundedRect(-o - q + sW, -o - q + sH, (this.w + h) * s + p, (this.h + h) * s + p, 3);
		}
		return;
	}

	static clamp(value, max, min) {
		return Math.min(Math.max(value, min), max);
	}
	static newBorderColor({ hover } = {}) {
		const overrides = {
			CONTROLLED: {
				INT: parseInt(game.settings.get("Border-Control", "controlledColor").substr(1), 16),
				EX: parseInt(game.settings.get("Border-Control", "controlledColorEx").substr(1), 16)
			},
			FRIENDLY: {
				INT: parseInt(game.settings.get("Border-Control", "friendlyColor").substr(1), 16),
				EX: parseInt(game.settings.get("Border-Control", "friendlyColorEx").substr(1), 16)
			},
			NEUTRAL: {
				INT: parseInt(game.settings.get("Border-Control", "neutralColor").substr(1), 16),
				EX: parseInt(game.settings.get("Border-Control", "neutralColorEx").substr(1), 16)
			},
			HOSTILE: {
				INT: parseInt(game.settings.get("Border-Control", "hostileColor").substr(1), 16),
				EX: parseInt(game.settings.get("Border-Control", "hostileColorEx").substr(1), 16)
			},
			PARTY: {
				INT: parseInt(game.settings.get("Border-Control", "partyColor").substr(1), 16),
				EX: parseInt(game.settings.get("Border-Control", "partyColorEx").substr(1), 16)
			}
		};
		if (this.controlled) {
			return overrides.CONTROLLED;
		}
		// else if ((this._hover || game.settings.get("Border-Control", "permanentBorder"))) {}
		else if (
			(hover ?? this.hover) ||
			canvas.tokens._highlight ||
			game.settings.get("Border-Control", "permanentBorder")
		) {
			let disPath = CONST.TOKEN_DISPOSITIONS;
			let d = parseInt(this.document.disposition);
			if (!game.user.isGM && this.owner) return overrides.CONTROLLED;
			else if (this.actor?.hasPlayerOwner) return overrides.PARTY;
			else if (d === disPath.FRIENDLY) return overrides.FRIENDLY;
			else if (d === disPath.NEUTRAL) return overrides.NEUTRAL;
			else return overrides.HOSTILE;
		} else {
			return null;
		}
	}

	static newTarget(reticule) {
		const multiplier = game.settings.get("Border-Control", "targetSize");
		const INT = parseInt(game.settings.get("Border-Control", "targetColor").substr(1), 16);
		const EX = parseInt(game.settings.get("Border-Control", "targetColorEx").substr(1), 16);

		this.target.clear();
		if (!this.targeted.size) return;

		// Determine whether the current user has target and any other users
		const [others, user] = Array.from(this.targeted).partition((u) => u === game.user);

		// For the current user, draw the target arrows
		if (user.length) this._drawTarget(reticule);

		// For other users, draw offset pips
		const hw = this.w / 2;
		for (let [i, u] of others.entries()) {
			const offset = Math.floor((i + 1) / 2) * 16;
			const sign = i % 2 === 0 ? 1 : -1;
			const x = hw + sign * offset;
			this.target.beginFill(Color.from(u.color), 1.0).lineStyle(2, 0x0000000).drawCircle(x, 0, 6);
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
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
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
	static interpolateColors(color1, color2, steps) {
		var stepFactor = 1 / (steps - 1),
			interpolatedColorArray = [];

		color1 = color1.match(/\d+/g).map(Number);
		color2 = color2.match(/\d+/g).map(Number);

		for (var i = 0; i < steps; i++) {
			interpolatedColorArray.push(BorderFrame.interpolateColor(color1, color2, stepFactor * i));
		}

		return interpolatedColorArray;
	}

	static getActorHpPath() {
		switch (game.system.id) {
			case "symbaroum":
				return {
					value: "actor.system.health.toughness.value",
					max: "actor.system.health.toughness.max",
					tempMax: undefined,
					temp: undefined
				};
			case "dnd5e":
				return {
					value: "actor.system.attributes.hp.value",
					max: "actor.system.attributes.hp.max",
					tempMax: "actor.system.attributes.hp.tempmax",
					temp: "actor.system.attributes.hp.temp"
				};
		}
	}

	static drawNameplate() {
		const offSet = game.settings.get("Border-Control", "borderOffset");
		const yOff = game.settings.get("Border-Control", "nameplateOffset");
		const bOff = game.settings.get("Border-Control", "borderWidth") / 2;
		const replaceFont = game.settings.get("Border-Control", "plateFont");
		let color =
			game.user.isGM && [10, 40, 20].includes(this.document.displayName)
				? game.settings.get("Border-Control", "nameplateColorGM")
				: game.settings.get("Border-Control", "nameplateColor");
		const sizeMulti = game.settings.get("Border-Control", "sizeMultiplier");

		if (game.settings.get("Border-Control", "circularNameplate")) {
			let style = CONFIG.canvasTextStyle.clone();
			let extraRad = game.settings.get("Border-Control", "circularNameplateRadius");
			if (!game.modules.get("custom-nameplates")?.active) {
				style.fontFamily = replaceFont;
				style.fontSize *= sizeMulti;
			}
			if (game.settings.get("Border-Control", "plateConsistency")) style.fontSize *= canvas.grid.size / 100;
			style.fill = color;
			var text = new PreciseText(this.name, style);
			text.resolution = 4;
			text.style.trim = true;
			text.updateText();

			var radius = this.w / 2 + text.texture.height + bOff + extraRad;
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
			name.position.set(this.w / 2, this.h / 2 + yOff);
			return name;
		} else {
			const style = this._getTextStyle();
			if (!game.modules.get("custom-nameplates")?.active) {
				style.fontFamily = game.settings.get("Border-Control", "plateFont");
				style.fontSize *= sizeMulti;
			}
			if (game.settings.get("Border-Control", "plateConsistency")) style.fontSize *= canvas.grid.size / 100;
			style.fill = color;

			const name = new PreciseText(this.document.name, style);
			name.anchor.set(0.5, 0);
			name.position.set(this.w / 2, this.h + bOff + yOff + offSet);
			return name;
		}
	}

	static refreshAll() {
		canvas.tokens.placeables.forEach((t) => t.draw());
	}

	static drawBars(wrapped, ...args) {
		if (!game.settings.get("Border-Control", "barAlpha") || !game.user.isGM) {
			return wrapped(...args);
		}
		if (!this.actor || [50, 0, 30].includes(this.document.displayBars)) return wrapped(...args);
		else
			return ["bar1", "bar2"].forEach((b, i) => {
				const bar = this.bars[b];
				const attr = this.document.getBarAttribute(b);
				if (!attr || attr.type !== "bar") return (bar.visible = false);
				this._drawBar(i, bar, attr);
				bar.visible = true;
				bar.alpha = 0.5;
				this.bars.visible = this._canViewMode(this.document.displayBars);
			});
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
		color,
		border: { width = 2, color: lineColor = 0 } = {}
	} = {}) {
		const l = canvas.dimensions.size * size; // Side length.
		const { h, w } = this;
		const lineStyle = { color: lineColor, alpha, width, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.BEVEL };
		color ??= this._getBorderColor({ hover: true });

		m *= l * -1;
		this.target
			.beginFill(color.INT, alpha)
			.lineStyle(lineStyle)
			.drawPolygon([-m, -m, -m - l, -m, -m, -m - l]) // Top left
			.drawPolygon([w + m, -m, w + m + l, -m, w + m, -m - l]) // Top right
			.drawPolygon([-m, h + m, -m - l, h + m, -m, h + m + l]) // Bottom left
			.drawPolygon([w + m, h + m, w + m + l, h + m, w + m, h + m + l]); // Bottom right
	}
};
