import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true
};

export default nextConfig;

module.exports = {
	webpack(config: {
		module: {
			rules: { test: RegExp; issuer: { and: RegExp[] }; use: string[] }[];
		};
	}) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				and: [/\.(js|ts)x?$/]
			},
			use: ['@svgr/webpack']
		});
		return config;
	}
};
