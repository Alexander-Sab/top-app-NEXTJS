// pages/[type]/index.tsx

import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React, { useEffect } from 'react';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interfaces';
import { withLayout } from '../../layout/Layout';
import { firstLevelMenu } from '../../helpers/helpers';
import { ParsedUrlQuery } from 'querystring';
import { API } from '../../helpers/api';

interface TypeProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
}

function Type({ firstCategory }: TypeProps): JSX.Element {
	return <>Type: {firstCategory}</>;
}

export default withLayout(Type);

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = firstLevelMenu.map((m) => ({
		params: { type: m.route }
	}));

	return {
		paths,
		fallback: true
	};
};

export const getStaticProps: GetStaticProps<TypeProps> = async ({
	params
}: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params || !params.type) {
		return {
			notFound: true
		};
	}
	const firstCategoryItem = firstLevelMenu.find(
		(m) => m.route === params.type
	);
	if (!firstCategoryItem) {
		return {
			notFound: true
		};
	}
	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
		firstCategory: firstCategoryItem.id
	});
	return {
		props: {
			menu,
			firstCategory: firstCategoryItem.id
		}
	};
};
