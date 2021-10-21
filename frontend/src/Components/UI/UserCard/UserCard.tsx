import Card from "../Card/Card";
import { CSSProperties, HTMLAttributes } from "react";

import "./UserCard.css";
import { Runner } from "../../../Models";

type UserCardProps = {
	user: Runner;
	isOwner?: boolean,
	className?: HTMLAttributes<HTMLDivElement>['className'];
	onClick?: HTMLAttributes<HTMLDivElement>['onClick'];
	style?: CSSProperties;
};

const GameCard = (props: UserCardProps) => {
	return (
		<Card className={`user ${props.isOwner ? 'owner' : ''}` + (props.className ? ' ' + props.className : '')} onClick={props.onClick} style={props.style}>
			{props.isOwner ? (
				<div className="profile">
					<div className="child" style={{ backgroundImage: `url(https://cdn.discordapp.com/avatars/${props.user.discordloginid}/${props.user.avatar}.png?size=128)` }} />
				</div>
			) : (
				<div className="profile" style={{ backgroundImage: `url(https://cdn.discordapp.com/avatars/${props.user.discordloginid}/${props.user.avatar}.png?size=128)` }} />
			)}
			<section className="name">
				<p>{props.user.username}</p>
				<p className="sub-text">#{props.user.discriminator}</p>
			</section>
		</Card>
	);
}

export default GameCard;