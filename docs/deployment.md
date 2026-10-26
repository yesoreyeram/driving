# Deployment

## Local development and build preview

Install Node.js 22 or later. No package installation or other runtime is needed.

```sh
npm run dev
```

Open `http://127.0.0.1:8080`. The built-in Node server serves only `src/`, with JavaScript/JSON MIME types, GET/HEAD support and no directory listing. It rejects traversal and symlink escapes. It is a local development server, not a production server.

To check the publication artifact:

```sh
npm run build
npm run preview
```

The build validates the code and split registry, cleans `_site/`, copies `src/` and adds `.nojekyll`. Preview serves only `_site/`. Set `PORT` to change the local port, and stop the development server before starting preview on the same port.

## GitHub Pages

The existing `.github/workflows/pages.yml` builds pull requests without publishing. Pushes to `main` build and upload `_site/`, then deploy that artifact in the `github-pages` environment. Pages/OIDC permissions remain scoped to the deployment job. Production runs are serialized; superseded PR checks can be cancelled.

One-time setup:

1. In repository **Settings → Pages**, choose **GitHub Actions** as the publishing method.
2. Merge the PR. The resulting push to `main` starts the Pages workflow.
3. Check that both build and deploy succeed, then open the deployment URL shown in the environment.

Use `workflow_dispatch` on `main` to redeploy manually. Dispatches from other branches only build. The expected project URL is `https://yesoreyeram.github.io/driving/`; use the action's actual deployment URL if a custom domain is configured.

App and JSON index paths are relative, so the `/driving/` project prefix needs no rewriting. The split registry is copied in full into the artifact. Missing or inconsistent index entries fail checks before publication.

## Other static hosts

Run `npm run build` and publish `_site/` over HTTPS. Serve `.js`/`.mjs` as JavaScript and `.json` as JSON. Retain the HTML CSP and configure suitable TLS, content-type and referrer headers for the host. Keep prior releases for rollback.

Moving domains does not move browser-local progress. Export before moving and import at the new origin. Verify current route access and navigation imports on physical devices before a wider release.
