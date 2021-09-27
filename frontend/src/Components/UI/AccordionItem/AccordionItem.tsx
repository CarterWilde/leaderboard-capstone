import { Add, Remove } from "@material-ui/icons";
import React, { Component, CSSProperties } from "react";

import "./AccordionItem.css";

type AccordionItemProps = {
    title: string,
    active?: boolean,
    bolded?: boolean,
    onClick?: React.MouseEventHandler<HTMLDivElement>,
    style?: CSSProperties
}

type AccordionItemState = {
    active: boolean
}

export default class AccordionItem extends Component<AccordionItemProps, AccordionItemState> {
    constructor(props: AccordionItemProps) {
        super(props);
        this.state = {
            active: this.props.active ? this.props.active : false
        }

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(e: React.MouseEvent<HTMLDivElement>) {
        this.setState({active: !this.state.active});
        this.props.onClick?.(e);
    }

    render() {
        return (
            <section className="accordion-item" style={this.props.style}>
                <header onClick={this.handleToggle} style={{cursor: "pointer"}}>
                    <h4 style={{fontWeight: this.props.bolded ? "normal" : "lighter"}}>{this.props.title}</h4>
                    {this.state.active ? <Remove/> : <Add/>}
                </header>
                {this.state.active ? (
                    <>
                        <summary>{this.props.children}</summary>
                    </>
                ) : null}
            </section>
        );
    }
}