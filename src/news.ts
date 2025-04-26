import {
    McpServer,
    ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);
dotenv.config({ path: resolve(_dirname, "../.env") });

const NY_TIMES_API_KEY = process.env.NYTIMES_API_KEY;
const NY_TIMES_BASE_URL = "https://api.nytimes.com/svc";

if (!NY_TIMES_API_KEY) {
    throw new Error("NYTIMES_API_KEY is not set in .env file");
}

interface Article {
    headline: { main: string };
    abstract: string;
    web_url: string;
    _id: string;
    pub_date: string;
}

interface NYTimesResponse {
    status: string;
    response?: {
        docs: Article[];
    };
}

// Create an MCP server
const server = new McpServer({
    name: "NYTimes",
    version: "1.0.0",
});

// Add tool to get latest news
server.tool(
    "getLatestNews",
    { query: z.string().optional().describe("Optional search term") },
    async ({ query }) => {
        try {
            const searchQuery = query ? `&q=${encodeURIComponent(query)}` : "";
            const url = `${NY_TIMES_BASE_URL}/search/v2/articlesearch.json?api-key=${NY_TIMES_API_KEY}${searchQuery}&sort=newest`;

            const response = await fetch(url);
            const data = (await response.json()) as NYTimesResponse;

            if (data.status !== "OK" || !data.response) {
                throw new Error("Failed to fetch news");
            }

            const articles = data.response.docs.slice(0, 5).map((article) => ({
                title: article.headline.main,
                abstract: article.abstract,
                url: article.web_url,
                id: article._id,
                publishDate: new Date(article.pub_date).toLocaleDateString(),
            }));

            return {
                content: [
                    {
                        type: "text",
                        text: articles
                            .map(
                                (article) =>
                                    `📰 ${article.title}\n${article.abstract}\nPublished: ${article.publishDate}\nURL: ${article.url}\nID: ${article.id}\n---`
                            )
                            .join("\n\n"),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching news: ${error instanceof Error ? error.message : "Unknown error"
                            }`,
                    },
                ],
            };
        }
    }
);

// Add tool to get article by ID
server.tool(
    "getArticleById",
    { id: z.string().describe("Article ID from NY Times") },
    async ({ id }) => {
        try {
            const url = `${NY_TIMES_BASE_URL}/search/v2/articlesearch.json?api-key=${NY_TIMES_API_KEY}&fq=_id:"${id}"`;

            const response = await fetch(url);
            const data = (await response.json()) as NYTimesResponse;

            if (
                data.status !== "OK" ||
                !data.response ||
                !data.response.docs.length
            ) {
                throw new Error("Article not found");
            }

            const article = data.response.docs[0];
            return {
                content: [
                    {
                        type: "text",
                        text: `📰 ${article.headline.main}\n\n${article.abstract
                            }\n\nPublished: ${new Date(
                                article.pub_date
                            ).toLocaleDateString()}\nURL: ${article.web_url}`,
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching article: ${error instanceof Error ? error.message : "Unknown error"
                            }`,
                    },
                ],
            };
        }
    }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);