import React, { Component } from "react";

enum Directions {
	North = 1,
	East = 2,
	South = 3,
	West = 4
}

class Point {
	x: number;
	y: number;
	vertV: number;
	horzV: number;

	constructor(x: number, y: number, vertV: number, horzV: number) {
		this.x = x;
		this.y = y;
		this.vertV = vertV;
		this.horzV = horzV;
	}
}

const NODE_AMOUNT: number = 25;
const NODE_MOTION: number = .005;
const MAX_VELOCITY: number = .05;
const FRICTION: number = .025;
const NODE_THICKNESS: number = 3; // In Pixels
const LINE_DISTANCE: number = 250;
const LINE_THICKNESS: number = 2; // In Pixels
const FILL_COLOR: string = "#fcba03FF"; // In RGB or RGBA hex
const LINE_COLOR: string = "#fcba0322"; // In RGB or RGBA hex

const randomNumber = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
}

type BackgroundEffectState = {
	Width: number;
	Height: number;
	context?: CanvasRenderingContext2D | null;
};

type BackgroundEffectProps = {

};

export default class BackgroundEffect extends Component<BackgroundEffectProps, BackgroundEffectState> {
	canvasElement?: HTMLCanvasElement;
	canvasElementRef;
	parentRef;
	Points: Point[] = [];
	Mouse: {
		x: number,
		y: number
	} = {
			x: 0,
			y: 0
		};
	randomDirection(): Directions {
		let number = randomNumber(0, 100);
		if (number < 25) {
			return Directions.North;
		}
		else if (number < 50) {
			return Directions.East;
		}
		else if (number < 75) {
			return Directions.South;
		}
		else if (number < 100) {
			return Directions.West;
		} else {
			throw new Error("Invalid Direction!");
		}
	}

	isNear(from: Point, to: Point, r: number) {
		return Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2) < Math.pow(r, 2);
	}

	main(context: CanvasRenderingContext2D) {
		//First create a '2d'array for points
		this.Points = [];
		for (let i = 0; i < NODE_AMOUNT; i++) {
			//Generate random points within the canvas 
			//Then store them in the array
			this.Points.push(new Point(randomNumber(0, this.state.Width), randomNumber(0, this.state.Height), 0, 0));
		}
		//Render the points & lines
		this.draw(context);
	}

	connectNode(context: CanvasRenderingContext2D, from: Point, to: Point) {
		context.lineWidth = LINE_THICKNESS;
		context.beginPath();
		context.strokeStyle = LINE_COLOR;
		context.moveTo(from.x, from.y);
		context.lineTo(to.x, to.y);
		context.stroke();
	}

	//This connects all of them while using the connectNode method ot draw them
	connectNodes(context: CanvasRenderingContext2D) {
		this.Points.forEach(point => {
			this.Points
				.filter(otherPoint => this.isNear(point, otherPoint, LINE_DISTANCE) && point !== otherPoint)
				.forEach(filteredPoints => this.connectNode(context, point, filteredPoints));
		});
	}

	drawNodes(context: CanvasRenderingContext2D) {
		this.Points.forEach(point => {
			context.lineWidth = 1;
			context.beginPath();
			context.strokeStyle = FILL_COLOR;
			context.fillStyle = FILL_COLOR;
			context.arc(point.x, point.y, NODE_THICKNESS, 0, 2 * Math.PI);
			context.fill();
			context.stroke();
		});
	}

	boundsCheck(point: Point) {
		//Basic Bounce
		if (point.x >= this.state.Width || point.x < 0) {
			point.horzV *= -1;
		}

		if (point.y >= this.state.Height || point.y < 0) {
			point.vertV *= -1;
		}
		//They are really far out sooo we should just respawn them...
		if (point.x >= this.state.Width + 5 || point.x <= 0 - 5) {
			point.x = randomNumber(0, this.state.Width);
			point.y = randomNumber(0, this.state.Height);
		}

		if (point.y >= this.state.Height + 5 || point.y <= 0 - 5) {
			point.x = randomNumber(0, this.state.Width);
			point.y = randomNumber(0, this.state.Height);
		}
	}

	velocityCheck(point: Point): Point {
		if (Math.abs(point.horzV) >= MAX_VELOCITY) {
			point.horzV = MAX_VELOCITY * Math.sign(point.horzV);
		}
		if (Math.abs(point.vertV) >= MAX_VELOCITY) {
			point.vertV = MAX_VELOCITY * Math.sign(point.vertV);
		}

		return point;
	}

	animateNodes() {
		this.Points.forEach(point => {
			let direction: Directions = this.randomDirection();
			switch (direction) {
				case Directions.North:
					point.vertV += NODE_MOTION;
					break;
				case Directions.East:
					point.horzV += NODE_MOTION;
					break;
				case Directions.South:
					point.vertV -= NODE_MOTION;
					break;
				case Directions.West:
					point.horzV -= NODE_MOTION;
					break;
			}

			point.x += point.horzV - FRICTION;
			point.y += point.vertV - FRICTION;

			point = this.velocityCheck(point);
			this.boundsCheck(point);
		});
	}

	draw(context: CanvasRenderingContext2D) {
		if (this.state.context != null) {
			this.state.context.clearRect(0, 0, this.state.Width, this.state.Height);
			this.animateNodes();
			this.connectNodes(context);
			this.drawNodes(context);
		}
		window.requestAnimationFrame(() => {
			this.draw(context);
		});
	}

	constructor(props: BackgroundEffectProps) {
		super(props);
		this.canvasElementRef = React.createRef<HTMLCanvasElement>();
		this.parentRef = React.createRef<HTMLDivElement>();
		let ctx = this.canvasElementRef.current?.getContext("2d");
		this.state = {
			Width: 0,
			Height: 0,
			context: ctx
		};

		this.draw = this.draw.bind(this);

		window.onresize = (e) => {
			this.setState({
				Width: this.parentRef.current?.clientWidth ? this.parentRef.current.clientWidth : 0,
				Height: this.parentRef.current?.clientHeight ? this.parentRef.current.clientHeight : 0
			});
		}
	}

	componentDidMount() {
		if (this.canvasElementRef.current) {
			this.canvasElement = this.canvasElementRef.current;
		}
		this.setState({
			Width: this.parentRef.current?.clientWidth ? this.parentRef.current.clientWidth : 0,
			Height: this.parentRef.current?.clientHeight ? this.parentRef.current.clientHeight : 0
		});
		this.setState({ context: this.canvasElement?.getContext("2d") });
	}

	render() {
		if (this.state.context) {
			this.main(this.state.context);
		}
		return (
			<div ref={this.parentRef} style={{ height: "100%" }}>
				<canvas ref={this.canvasElementRef} width={this.state.Width} height={this.state.Height}>
					{this.props.children}
				</canvas>
			</div>
		);
	}
}