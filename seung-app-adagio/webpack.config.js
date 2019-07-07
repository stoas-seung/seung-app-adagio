const path                    = require("path");
const MiniCssExtractPlugin    = require("mini-css-extract-plugin");
const UglifyJsPlugin          = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin    = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (env) => {
	
	let clientPath = path.resolve(__dirname, "res");
	let outputPath = path.resolve(__dirname, (env == "production") ? "src/main/resources/static" : "out");
	
	return {
		mode: !env ? "development" : env,
		entry: {
			core: ["lodash", "jquery", "moment", "numeral"],
			ui: ["w2ui"],
			app: clientPath + "/app.js"
		},
		output: {
			path: outputPath,
			filename: "[name].js"
		},
		optimization: {
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors"
					}
				}
			},
			minimizer: (env == "production") ? [
				new UglifyJsPlugin(),
				new OptimizeCssAssetsPlugin()
			] : []
		},
		devServer: {
			contentBase: outputPath,
			publicPath: "/res/",
			host: "0.0.0.0",
			port: 10606,
			proxy: {
				"**": "http://127.0.0.1:10605"
			},
			inline: true,
			overlay: true,
			hot: false
		},
		module: {
			rules: [
				{
					test: require.resolve('w2ui'),
					use: [{ loader: 'exports-loader', options: 'w2ui,w2obj,w2utils,w2popup,w2confirm,w2alert' }]
				},
				{
					test: /\.js$/,
					use: [{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					}]
				},
				{
					test: /\.(css)$/,
					use: [{
						loader: MiniCssExtractPlugin.loader
					}, {
						loader: "css-loader"
					}]
				},
				{
					test: /\.(jpe?g|png|gif)$/i,
					use: [{
						loader: "url-loader",
						options: {
							limit: 1024 * 10 // 10kb
						}
					}]
				},
				{
					test: /\.(svg)$/i,
					use: [{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "images/"
						}
					}]
				}
			]
		},
		plugins: [
			/*
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery"
			}),
			new BundleAnalyzerPlugin(),
			*/
			new MiniCssExtractPlugin({
				path: outputPath,
				filename: "[name].css"
			})
		]
	};
}
