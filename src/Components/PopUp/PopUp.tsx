import React, { Component, ReactNode } from "react";
import CloseIcon from '@material-ui/icons/Close';
import Button from "../Button";
import "./PopUp.css"

type PopUpProps = {
    title?: string;
    cancelText?: string;
    progressText: string;
    children?: ReactNode
    /**
     * Invoked when the user clicks the close button.
     */
    onClose?: React.MouseEventHandler<SVGElement>;
    /**
     * Invoked when the user clicks on the cancel button.
     */
    onCancel?: React.MouseEventHandler<HTMLDivElement>;
    /**
     * Invoked when ever the PopUp is closed.
     */
    onClosed: React.MouseEventHandler<SVGElement | HTMLDivElement>;
    onProgress?: React.MouseEventHandler<HTMLDivElement>;
    open: boolean;
};

type PopUpState = {
};

export default class PopUp extends Component<PopUpProps, PopUpState> {
    constructor(props: PopUpProps) {
        super(props);
        
        this.state = {
            open: false
        };

        this.handleProgress = this.handleProgress.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.doesClose = this.doesClose.bind(this);
    }

    handleProgress(e: React.MouseEvent<HTMLDivElement>) {
        this.doesClose(e);
    }

    handleCancel(e: React.MouseEvent<HTMLDivElement>) {
        this.props.onCancel?.(e);
        this.doesClose(e);
    }

    handleClose(e: React.MouseEvent<SVGElement>) {
        this.props.onClose?.(e);
        this.doesClose(e);
    }

    doesClose(e: React.MouseEvent<SVGElement | HTMLDivElement>) {
        this.props.onClosed?.(e);
    }

    render() {
        if(this.props.open) {
            return(
                <div className="pop-up">
                    <div className="card">
                        <section className="header">
                            <h3>{this.props.title}</h3>
                            <CloseIcon onClick={this.handleClose} htmlColor="#76777c" style={{cursor: "pointer"}}/>
                        </section>
                        <hr/>
                        <section className="content">
                            {this.props.children}
                        </section>
                        <section className="footer">
                            <Button variant="text" color="#76777c" onClick={this.handleCancel}>{this.props.cancelText ? this.props.cancelText : "Back"}</Button>
                            <Button variant="outline" onClick={this.handleProgress}>{this.props.progressText}</Button>
                        </section>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }
}