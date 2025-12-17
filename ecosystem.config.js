module.exports = {
  apps: [
    {
      name: "driver",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002",
      cwd: __dirname,
      env: {
        NODE_ENV: "development",
        PORT: 3002,
      },
    },
  ],
};
