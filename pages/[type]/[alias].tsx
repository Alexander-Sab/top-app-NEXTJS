import { withLayout } from '@/layout/Layout';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import axios from 'axios';
import { MenuItem } from '@/interfaces/menu.interfaces';
import { TopLevelCategory, TopPageModel } from '@/interfaces/page.interface';
import { ParsedUrlQuery } from 'querystring';
import { ProductModel } from '@/interfaces/product.interface';
import { firstLevelMenu } from '@/helpers/helpers';
import { API } from '@/helpers/api';
import { TopPageCopponents } from '@/page-components';

function TopPage({ firstCategory, page, products }: TopPageProps): JSX.Element {
	return (
		<TopPageCopponents
			firstCategory={firstCategory}
			page={page}
			products={products}
		/>
		// {/* Проверка наличия данных перед доступом к свойствам */}
		// {/* {menu && <div>Menu length: {menu.length}</div>}
		// {page && <div>Page title: {page.title}</div>} */}
	);
}

export default withLayout(TopPage);

export const getStaticPaths: GetStaticPaths = async () => {
	let paths: string[] = [];
	for (const m of firstLevelMenu) {
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: m.id
		});
		paths = paths.concat(
			menu.flatMap((s) => s.pages.map((p) => `/${m.route}/${p.alias}`))
		);
	}
	return {
		paths,
		fallback: true
	};
};

export const getStaticProps: GetStaticProps<TopPageProps> = async ({
	params
}: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true
		};
	}
	const firstCategoryItem = firstLevelMenu.find(
		(m) => m.route == params.type
	);
	if (!firstCategoryItem) {
		return {
			notFound: true
		};
	}
	try {
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: firstCategoryItem.id
		});
		if (menu.length == 0) {
			return {
				notFound: true
			};
		}
		const { data: page } = await axios.get<TopPageModel>(
			API.topPage.byAlias + params.alias
		);
		const { data: products } = await axios.post<ProductModel[]>(
			API.product.find,
			{
				category: page.category,
				limit: 10
			}
		);

		return {
			props: {
				menu,
				firstCategory: firstCategoryItem.id,
				page,
				products
			}
		};
	} catch {
		return {
			notFound: true
		};
	}
};

interface TopPageProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: TopLevelCategory;
	page: TopPageModel;
	products: ProductModel[];
}