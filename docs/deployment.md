# Deploying Routewise

## Static hosting

Run `npm run build` and serve the generated `_site/` directory over HTTPS. The build validates the app and route data, cleans the output directory, copies the static assets and adds `.nojekyll`. No database, secret or package installation is required. All paths are relative, so the app can also be served under a subdirectory. Keep the JSON and `.mjs` modules accessible with correct MIME types (`application/json`, `text/javascript`).

For a local check:

```sh
npm run build
python3 -m http.server 8080 --directory _site
```

For any static provider, choose `npm run build` as the build command and `_site` as the publication directory. Retain the CSP in `index.html`; configure server headers appropriate to your domain, including `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`. Use HSTS only when the domain and subdomains are configured for HTTPS.

## GitHub Pages

The committed `.github/workflows/pages.yml` handles the complete build and deployment pipeline:

- Pull requests run the build, including all app and route-data checks. They do not receive deployment permissions or publish.
- Every push to `main` builds and uploads `_site` with `actions/upload-pages-artifact`, then publishes that exact artifact with `actions/deploy-pages`.
- Deployment waits for the build and runs in the `github-pages` environment, with Pages and OIDC permissions scoped to the deployment job.
- The workflow publishes the actual deployment URL in the environment. Production runs are serialized; new PR runs can cancel superseded PR checks.
- `workflow_dispatch` allows rebuilding and redeploying from the Actions tab. Select `main`; dispatches from other branches only validate the build.

### One-time repository setup

1. In [repository Settings → Pages](https://github.com/yesoreyeram/driving/settings/pages), select **GitHub Actions** under **Build and deployment → Source**. This requires repository administration access; the normal workflow token does not enable Pages for you.
2. Merge the app PR into `main`. That push triggers **Build and deploy GitHub Pages**.
3. In Actions, open the run and confirm both `build` and `deploy` succeed. Open the URL in the `github-pages` environment and check route loading, GPX downloads and navigation links on a phone.
4. If you enable required environment reviewers, approve deployments there. Otherwise merges publish automatically.

The expected project URL is `https://yesoreyeram.github.io/driving/`; the deployment action's returned URL is authoritative. All app asset paths are relative, so `/driving/` needs no URL rewriting or framework base-path configuration. A custom domain can change the final URL.

The existing checks workflow also validates feature-branch pushes. No PAT is required. Configure Pages and repository Actions policies to allow the official actions before the first production deployment.

## Sites preview

The project may also include `.openai/hosting.json`, which binds a private development deployment. It is not required for independent self-hosting. Do not reuse that project ID when creating your own hosted copy.

## Before wider release

Verify each route on the road and native navigation import on physical devices. Review map provider terms and arrange suitable infrastructure before replacing the source map embeds. Keep prior app releases and route data revisions for rollback. Add automated checks for withdrawn or stale routes before recommending them. Learner progress is local to the origin, so moving domains does not migrate it: export before moving and import on the new domain.
