import { Component, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

import "./Feild.css";

interface FeildProps extends InputHTMLAttributes<HTMLInputElement>{
    name: string;
    type: HTMLInputTypeAttribute;
		isTextarea?: boolean;
}

type FeildState = {

}

export default class Feild extends Component<FeildProps, FeildState> {
    render() {
        const {name, style, ...inputProps} = this.props;
        return(
            <div className="feild" style={this.props.style}>
                <label>{this.props.name}</label>
								{ !this.props.isTextarea ? (
									<input placeholder={this.props.name} {...inputProps}/>
								) : (
									<textarea placeholder={this.props.name}></textarea>
								)}
            </div>
        );
    }
}