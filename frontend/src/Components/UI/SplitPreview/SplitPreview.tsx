import React, { UIEvent } from "react";
import { ChangeEvent, Component } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { TextAreaFeildProps } from "..";
import "./SplitPreview.css";

export interface SplitPreviewProps extends TextAreaFeildProps {
	name: string;
};

export type SplitPreviewState = {
	value: string;
	height: number;
	width: number;
};

export default class SplitPreview extends Component<SplitPreviewProps, SplitPreviewState> {
	private resizeObserver: ResizeObserver;
	private textAreaRef = React.createRef<HTMLTextAreaElement>();
	private previewRef = React.createRef<HTMLDivElement>();

	constructor(props: SplitPreviewProps) {
		super(props);

		this.state = {
			value: "",
			height: 0,
			width: 0
		}

		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleOnResize = this.handleOnResize.bind(this);
		this.handleOnScroll = this.handleOnScroll.bind(this);

		this.resizeObserver = new ResizeObserver(this.handleOnResize);
	}
	
	componentDidMount() {
		
		if(this.textAreaRef.current) {
			this.setState({
				height: this.textAreaRef.current.offsetHeight,
				width: this.textAreaRef.current.offsetWidth
			});
			this.resizeObserver.observe(this.textAreaRef.current);
		}
	}

	handleOnResize(entries: ResizeObserverEntry[], observer: ResizeObserver) {
		if(this.textAreaRef.current) {
			this.setState({
				height: this.textAreaRef.current.offsetHeight,
				width: this.textAreaRef.current.offsetWidth
			})
		}
	}

	handleOnScroll(e: UIEvent<HTMLTextAreaElement>) {
		if(this.textAreaRef.current && this.previewRef.current) {
			this.previewRef.current.scrollTop = this.textAreaRef.current.scrollTop
		}
	}

	handleOnChange(e: ChangeEvent<HTMLTextAreaElement>) {
		this.setState({value: e.currentTarget.value});
		this.props.onChange?.(e);
	}

	render() {
		return (
			<div className="split-preview">
				<label>{this.props.name}</label>
				<textarea {...this.props} onChange={this.handleOnChange} ref={this.textAreaRef} onScroll={this.handleOnScroll}/>
				<div className="preview" ref={this.previewRef} style={{height: `${this.state.height}px`}}>
					<ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
						{this.state.value}
					</ReactMarkdown>
				</div>
			</div>
		);
	}
}