const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'payments',

  exposes: {
    './payments': './src/app/app.ts',
    './payments_routes': './src/app/app.routes.ts',
  },

  remotes: {
    bkt: "bkt@http://localhost:4202/remoteEntry.js",
    dft: "dft@http://localhost:4203/remoteEntry.js",
    cbft: "cbft@http://localhost:4204/remoteEntry.js",
    ops: "ops@http://localhost:4205/remoteEntry.js"
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
