const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Ensure Metro recognizes .tflite files
  config.resolver.assetExts = [...config.resolver.assetExts, "tflite"];

  return withNativeWind(config, { input: "./src/global.css" });
})();
