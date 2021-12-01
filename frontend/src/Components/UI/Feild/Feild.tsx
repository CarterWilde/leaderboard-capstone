import { Component, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

import "./Feild.css";

export interface FeildProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    type: HTMLInputTypeAttribute;
}

type FeildState = {

}

export default class Feild extends Component<FeildProps, FeildState> {
    render() {
        const {name, style, ...inputProps} = this.props;
        return(
            <div className="feild" style={this.props.style}>
                <label>{name}</label>
								<input placeholder={name} {...inputProps}/>
            </div>
        );
    }
}