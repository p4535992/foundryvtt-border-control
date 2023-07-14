import { BorderFrame } from "./BorderControl.mjs";
import CONSTANTS from "./constants.mjs";

export class BCconfig {
	symbaroum: any;
	dnd5e: any;
	pf2e: any;
	pf1: any;
	swade: any;

	stepLevel: number;
	endColor: number[];
	startColor: number[];
	tempColor: number[];
	colorArray: number[][];
	tempArray: number[][];
	currentSystem: any;

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

		this.stepLevel = <number>game.settings.get(CONSTANTS.MODULE_NAME, "stepLevel");
		//@ts-ignore
		this.endColor = <number[]>Color.from(game.settings.get(CONSTANTS.MODULE_NAME, "healthGradientA")).rgb;
		//@ts-ignore
		this.startColor = <number[]>Color.from(game.settings.get(CONSTANTS.MODULE_NAME, "healthGradientB")).rgb;
		//@ts-ignore
		this.tempColor = Color.from(game.settings.get(CONSTANTS.MODULE_NAME, "healthGradientC")).rgb;
		this.colorArray = BorderFrame.interpolateColors(
			`rgb(${<number>this.startColor[0] * 255}, ${<number>this.startColor[1] * 255}, ${
				<number>this.startColor[2] * 255
			})`,
			`rgb(${<number>this.endColor[0] * 255}, ${<number>this.endColor[1] * 255}, ${
				<number>this.endColor[2] * 255
			})`,
			this.stepLevel
		);
		this.tempArray = BorderFrame.interpolateColors(
			`rgb(${<number>this.endColor[0] * 255}, ${<number>this.endColor[1] * 255}, ${
				<number>this.endColor[2] * 255
			})`,
			`rgb(${<number>this.tempColor[0] * 255}, ${<number>this.tempColor[1] * 255}, ${
				<number>this.tempColor[2] * 255
			})`,
			this.stepLevel
		);

		this.currentSystem = this[game.system.id];
	}
}
