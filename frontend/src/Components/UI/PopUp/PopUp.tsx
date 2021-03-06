import React, { Component, CSSProperties, ReactNode } from "react";
import CloseIcon from '@material-ui/icons/Close';
import Button from "../Button/Button";
import "./PopUp.css";
import Card from "../Card/Card";

type PopUpProps = {
	title?: string;
	cancelText?: string;
	progressText?: string;
	children?: ReactNode;
	isBlank?: boolean;
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
	onClosed?: React.MouseEventHandler<SVGElement | HTMLDivElement>;
	onProgress?: React.MouseEventHandler<HTMLDivElement>;
	open: boolean;
	width?: string;
	style?: CSSProperties;
	className?: string;
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
		this.props.onProgress?.(e);
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
		if (this.props.open) {
			return (
				<div className="pop-up-wrapper">
					<Card className={"pop-up " + (this.props.className ? this.props.className : "")} style={{...this.props.style, width: this.props.width }}>
						{this.props.isBlank ? (this.props.children) : (
							<>
								<header>
									<h3>{this.props.title}</h3>
									<CloseIcon onClick={this.handleClose} htmlColor="#76777c" style={{ cursor: "pointer" }} />
								</header>
								<hr />
								<section className="content">
									{this.props.children}
								</section>
								<section className="footer">
									<Button variant="text" onClick={this.handleCancel}>{this.props.cancelText ? this.props.cancelText : "Back"}</Button>
									{this.props.progressText ? <Button variant="outline" onClick={this.handleProgress}>{this.props.progressText}</Button> : null}
								</section>
							</>
						)}
					</Card>
				</div>
			);
		} else {
			return <></>;
		}
	}
}