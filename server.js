import {serve} from "@hono/node-server";
import { Hono } from "hono";
import { build as esbuild} from "esbuild";
import { fileURLToPath } from 'node:url';
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import * as ReactServerDom from "react-server-dom-webpack/server.browser";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.get("/", async (c) => {
    return c.html(`
        <!DOCTYPE html>
            <html>
            <head>
                <title>React Server Components from Scratch</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="/build/_client.js"></script>
            </body>
	</html>
    `);
});

app.use("/build/*", serveStatic());

app.get("/rsc", async (c) => {
    const Page = await import("./build/page.js");
    const stream = ReactServerDom.renderToReadableStream(createElement(Page.default));
    return new Response(stream);
});

serve(app, async (info) => {
    await build();
    console.log(`Listening on http://localhost:${info.port}`);
});

async function build() {
    await esbuild ({
        bundle: true,
        format: "esm",
        logLevel: "error",
        entryPoints: [resolveApp("page.jsx")],
        outdir: resolveBuild(),
        //avoid bunding  npm pagckages
        packages: "external"
    });

    await esbuild ({
        bundle: true,
        format: "esm",
        logLevel: "error",
        entryPoints: [resolveApp("_client.jsx")],
        outdir: resolveBuild(),
        splitting: true,
        plugins: []
    });
}

const appDir = new URL("./app/", import.meta.url);
const buildDir = new URL("./build/", import.meta.url);

function resolveApp(path = "") {
    return fileURLToPath(new URL(path, appDir));
}

function resolveBuild(path = "") {
    return fileURLToPath(new URL(path, buildDir));
}
