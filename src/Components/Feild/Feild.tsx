import { Component, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

import "./Feild.css";

interface FeildProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    type: HTMLInputTypeAttribute;
}

type FeildState = {

}

export default class Feild extends Component<FeildProps, FeildState> {
    render() {
        const {name, ...inputProps} = this.props;
        return(
            <div className="feild">
                <label>{this.props.name}</label>
                <input placeholder={this.props.name} {...inputProps}/>
            </div>
        );
    }
}