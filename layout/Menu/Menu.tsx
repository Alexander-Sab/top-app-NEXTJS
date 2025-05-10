import { useContext } from 'react';
import styles from './Menu.module.css';
import { AppContext } from '@/context/app.context';

import cn from 'classnames';

import { FirstLevelMenuItem, PageItem } from '@/interfaces/menu.interfaces';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firstLevelMenu } from '@/helpers/helpers';
import { motion } from 'framer-motion';

export const Menu = (): JSX.Element => {
	const { menu, setMenu, firstCategory } = useContext(AppContext);
	const router = useRouter();
	const variants = {
		visible: {
			marginBottom: 20,
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.1
			}
		},
		hidden: { marginBottom: 0 }
	};
	const variantsChildren = {
		visible: {
			opacity: 1,
			height: 29
		},
		hidden: { opacity: 0, height: 0, overflow: 'hidden' }
	};

	const openSecondLevel = (secondCategory: string) => {
		// Используем оператор опциональной последовательности (?.) вместо &&
		setMenu?.(
			menu.map((m) => {
				if (m._id.secondCategory == secondCategory) {
					m.isOpened = !m.isOpened;
				}
				return m;
			})
		);
	};

	const buildFirstLevel = () => {
		return (
			<>
				{firstLevelMenu.map((m) => (
					<div key={m.route}>
						<Link href={`/${m.route}`}>
							<div
								className={cn(styles.firstLevel, {
									[styles.firstLevelActive]:
										m.id == firstCategory
								})}
							>
								{m.icon}
								<span>{m.name}</span>
							</div>
						</Link>

						{m.id == firstCategory && buildSecondLevel(m)}
					</div>
				))}
			</>
		);
	};

	const buildSecondLevel = (menuItem: FirstLevelMenuItem) => {
		return (
			<div className={styles.secondBlock}>
				{menu.map((m) => {
					if (
						m.pages
							.map((p) => p.alias)
							.includes(router.asPath.split('/')[2])
					) {
						m.isOpened = true;
					}
					return (
						<div key={m._id.secondCategory}>
							<div
								className={styles.secondLevel}
								onClick={() =>
									openSecondLevel(m._id.secondCategory)
								}
							>
								{m._id.secondCategory}
							</div>
							<motion.div
								layout
								variants={variants}
								initial={m.isOpened ? 'visible' : 'hidden'}
								animate={m.isOpened ? 'visible' : 'hidden'}
								className={cn(styles.secondLevelBlock)}
							>
								{buildThirdLevel(
									m.pages,
									menuItem.route,
									m.isOpened ?? false
								)}
							</motion.div>
						</div>
					);
				})}
				А
			</div>
		);
	};
	const buildThirdLevel = (
		pages: PageItem[],
		route: string,
		isOpened: boolean
	) => {
		return pages.map((p) => (
			<motion.div key={p._id} variants={variantsChildren}>
				<Link
					href={`/${route}/${p.alias}`}
					tabIndex={isOpened ? 0 : -1}
					className={cn(styles.thirdLevel, {
						[styles.thirdLevelActive]:
							`/${route}/${p.alias}` == router.asPath
					})}
					aria-current={
						`/${route}/${p.alias}` == router.asPath ? 'page' : false
					}
				>
					{p.category}
				</Link>
			</motion.div>
		));
	};

	return <div className={styles.menu}>{buildFirstLevel()}</div>;
};
