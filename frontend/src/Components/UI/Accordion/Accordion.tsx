import { Component, CSSProperties } from "react";
import Card from "../Card/Card";

import "./Accordion.css";

type AccordionProps = {
    style?: CSSProperties
}

type AccordionState = {
}

export default class Accordion extends Component<AccordionProps, AccordionState> {
    render() {
        return (
            <Card className="accordion" style={this.props.style}>
                {this.props.children}
            </Card>
        );
    }
}