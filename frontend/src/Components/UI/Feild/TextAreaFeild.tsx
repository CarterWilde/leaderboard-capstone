import { Component, TextareaHTMLAttributes } from "react";

import "./Feild.css";

export interface TextAreaFeildProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
}

type FeildState = {

}

export default class TextAreaFeild extends Component<TextAreaFeildProps, FeildState> {
    render() {
        const {name, style, ...inputProps} = this.props;
        return(
            <div className="feild" style={this.props.style}>
                <label>{name}</label>
								<textarea placeholder={name} {...inputProps}/>
            </div>
        );
    }
}