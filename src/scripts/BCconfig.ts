import { BorderFrame } from "./BorderControl";

export class BCconfig {
	symbaroum: any;
	dnd5e: any;
	pf2e: any;
	pf1: any;
	swade: any;

	stepLevel: string;
	endColor: number[];
	startColor: number[];
	tempColor: number[];
	colorArray: number[];
	tempArray: number[];
	currentSystem: string;

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
		//@ts-ignore
		this.endColor = Color.from(game.settings.get("Border-Control", "healthGradientA")).rgb;
		//@ts-ignore
		this.startColor = Color.from(game.settings.get("Border-Control", "healthGradientB")).rgb;
		//@ts-ignore
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
