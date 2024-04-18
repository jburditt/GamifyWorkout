const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "https://localhost:8080",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
