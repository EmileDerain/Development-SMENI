const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const { assetExts } = defaultConfig.resolver;
  return {
    resolver: {
      // add bin to assetExts
      assetExts: [...assetExts, 'bin']
    }
  };
})();
// Ancien fichier de configuration à garder sous la main si besoin
/*
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};*/
