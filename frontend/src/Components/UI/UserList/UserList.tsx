import { UserCard } from "..";
import { Runner } from "../../../Models";

export type UserListProps = {
	users: Runner[];
	onSelection: (runner: Runner) => void;
}

export const UserList = (props: UserListProps) => {
	return (
		<section className="user-list">
			{
				props.users.map(user => (
					<UserCard key={user.id} user={user} onClick={() => {
						props.onSelection(user);
					}}/>
				))
			}
		</section>
	);
}