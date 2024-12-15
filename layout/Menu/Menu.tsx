import { useContext } from 'react';
import styles from './Menu.module.css';

import { format } from 'date-fns';
import { AppContext } from '@/context/app.context';

export const Menu = (): JSX.Element => {
	const { menu, setMenu, firstCotegory } = useContext(AppContext);
	return (
		<div>
			<ul>
				{menu.map((m) => (
					<li key={m._id.secondCategory}>{m._id.secondCategory}</li>
				))}
			</ul>
		</div>
	);
};
