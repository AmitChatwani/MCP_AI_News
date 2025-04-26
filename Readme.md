# Weather & News MCP Service

A TypeScript-based Model Context Protocol (MCP) service that provides weather information from the National Weather Service (NWS) and news articles from the New York Times API.

## Features

- **Weather Service**
  - Get current weather alerts by state
  - Fetch detailed weather forecasts by location coordinates
  - Real-time data from the National Weather Service API

- **News Service**
  - Fetch latest news articles from NY Times
  - Search articles by keywords
  - Retrieve specific articles by ID

## Prerequisites

- Node.js v18 or higher
- TypeScript
- NY Times API key
- Internet connection for API access

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd weather
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NYTIMES_API_KEY=your_api_key_here
```

## Usage

Start the weather service:
```bash
npm run start:weather
```

Start the news service:
```bash
npm run start:news
```

## API Examples

### Weather Service

Get weather alerts for a state:
```javascript
getAlerts({ state: "CA" })
```

Get weather forecast:
```javascript
getForecast({ latitude: 37.7749, longitude: -122.4194 })
```

### News Service

Get latest news:
```javascript
getLatestNews({ query: "technology" })
```

Get article by ID:
```javascript
getArticleById({ id: "article-id" })
```

## Project Structure

```
weather/
├── src/
│   ├── index.ts    # Weather service
│   └── news.ts     # News service
├── build/          # Compiled JavaScript
├── .env           # Environment variables
└── package.json   # Project configuration
```

## Technologies

- TypeScript
- Model Context Protocol (MCP)
- Node.js
- Zod for validation
- Dotenv for environment variables

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Demo
[Link](https://drive.google.com/file/d/12mlKJK8YGM4zdw4cYukA0v_BihdExbbW/view?usp=sharing)
