const PROXY_CONFIG = [
  {
    context: [
      "/api",
    ],
    target: "https://localhost:8080",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
