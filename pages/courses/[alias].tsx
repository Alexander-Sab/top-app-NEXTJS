import { withLayout } from '@/layout/Layout';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import axios from 'axios';
import { MenuItem } from '@/interfaces/menu.interfaces';
import { TopPageModel } from '@/interfaces/page.interface';
import { ParsedUrlQuery } from 'querystring';
import { ProductModel } from '@/interfaces/product.interface';

const firstCategory = 0;

function Course({ menu, page, product }: CourseProps): JSX.Element {
	return (
		<>
			{product && <div>Product count: {product.length}</div>}
			{/* Проверка наличия данных перед доступом к свойствам */}
			{menu && <div>Menu length: {menu.length}</div>}
			{page && <div>Page title: {page.title}</div>}
		</>
	);
}

export default withLayout(Course);

export const getStaticPaths = async () => {
	const { data: menu } = await axios.post<MenuItem[]>(
		process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find',
		{ firstCategory }
	);
	return {
		paths: menu.flatMap((m) => m.pages.map((p) => '/courses/' + p.alias)),
		fallback: true
	};
};

export const getStaticProps: GetStaticProps<CourseProps> = async ({
	params
}: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true
		};
	}

	// Добавлен запрос для получения menu внутри getStaticProps
	const { data: menu } = await axios.post<MenuItem[]>(
		process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find',
		{ firstCategory }
	);

	// Исправлен путь в запросе get (добавлен / перед params?.alias)
	const { data: page } = await axios.get<TopPageModel>(
		process.env.NEXT_PUBLIC_DOMAIN +
			'/api/top-page/byAlias/' +
			params?.alias
	);

	// Приведен ключ limit к нижнему регистру, чтобы он соответствовал требованиям API
	const { data: product } = await axios.post<ProductModel[]>(
		process.env.NEXT_PUBLIC_DOMAIN + '/api/product/find',
		{
			category: page.category,
			limit: 10
		}
	);

	return {
		props: {
			menu,
			firstCategory,
			page,
			product
		}
	};
};

interface CourseProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
	page: TopPageModel;
	product: ProductModel[];
}
