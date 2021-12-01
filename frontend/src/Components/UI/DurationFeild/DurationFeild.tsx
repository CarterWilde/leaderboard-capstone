import React, { Component } from "react"
import { FeildProps } from "..";
import { Duration } from "../../../Models";

import "./DurationFeild.css";

export interface DurationFeildProps extends FeildProps {
	onChangeDuration?: (e: React.ChangeEvent<HTMLInputElement>, duration: Duration) => void;
}

export type DurationFeildState = {
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export default class DurationFeild extends Component<DurationFeildProps, DurationFeildState> {
	constructor(props: DurationFeildProps) {
		super(props);
		this.state = {
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		}

		this.handleOnChange = this.handleOnChange.bind(this);
	}

	handleOnChange(e: React.ChangeEvent<HTMLInputElement>, type: "hh" | "mm" | "ss" | "ms") {
		this.props.onChange?.(e);
		let value = e.currentTarget.valueAsNumber ? e.currentTarget.valueAsNumber : 0;
		switch (type) {
			case "hh":
				this.setState({ hours: value });
				break;
			case "mm":
				this.setState({ minutes: value });
				break;
			case "ss":
				this.setState({ seconds: value });
				break;
			case "ms":
				this.setState({ milliseconds: value });
				break;
			default:
				throw new Error("Invalid Change Event!");
		}
		const duration = Duration.withNumbers(this.state.hours, this.state.minutes, this.state.seconds, this.state.milliseconds);
		this.props.onChangeDuration?.(e, duration);
	}

	render() {
		const { name, style, onDurationChange, ...inputProps } = this.props;
		return (
			<div className="feild duration" style={this.props.style}>
				<label>{name}</label>
				<div className="wrapper">
					<input placeholder="HH" {...inputProps} type="number" onChange={(e) => { this.handleOnChange(e, "hh"); }} />
					<input placeholder="MM" {...inputProps} type="number" onChange={(e) => { this.handleOnChange(e, "mm"); }} />
					<input placeholder="SS" {...inputProps} type="number" onChange={(e) => { this.handleOnChange(e, "ss"); }} />
					<input placeholder="MS" {...inputProps} type="number" onChange={(e) => { this.handleOnChange(e, "ms"); }} />
				</div>
			</div>
		);
	}
}