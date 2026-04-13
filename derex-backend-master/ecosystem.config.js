module.exports = {
  apps: [
    {
      name: "api-server", // Replace with your app's name
      script: "./app.js", // Path to your app's main script
      cwd: "/opt/javer-backend", // Working directory
      user: "ubuntu", // Run as the ubuntu user
      out_file: "/opt/javer-backend/logs/out.log", // Redirect stdout logs
      error_file: "/opt/javer-backend/logs/err.log", // Redirect stderr logs
      max_memory_restart: "1G", // Restart if memory usage exceeds 1GB
      watch: ["app.js"], // Restart on file changes (optional)
      autorestart: true, // Restart on unexpected exits
    },
  ],
};
