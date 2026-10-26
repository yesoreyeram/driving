# Deploying Routewise

## Static hosting

Serve the contents of `dist/` over HTTPS. There is no build step, database, secret or package installation. All paths are relative, so the app can also be served under a subdirectory. Keep the JSON and `.mjs` modules accessible with correct MIME types (`application/json`, `text/javascript`).

For a local check:

```sh
npm run check
python3 -m http.server 8080 --directory dist
```

For any static provider, choose `dist` as the publication directory and leave the build command empty (or run `npm run check` as a validation step). Retain the CSP in `index.html`; configure server headers appropriate to your domain, including `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`. Use HSTS only when the domain and subdomains are configured for HTTPS.

## GitHub Pages

1. Merge the app PR into the default branch.
2. In repository Settings → Pages, choose GitHub Actions as the source.
3. Add a Pages workflow with `pages: write` and `id-token: write` permissions only on the deployment job, a `github-pages` environment, and a concurrency group.
4. Run `npm run check`, upload `dist` using the official Pages artifact action, then deploy using the official Pages deployment action. Pin actions to reviewed commit SHAs for a hardened release pipeline.
5. Open the returned Pages URL and check route loading, tiles, downloads, and contribution drafts on a phone.

Pages configuration is not enabled automatically by this PR. The included workflow validates code and data only.

## Sites preview

The project may also include `.openai/hosting.json`, which binds a private development deployment. It is not required for independent self-hosting. Do not reuse that project ID when creating your own hosted copy.

## Before wider release

Verify each route on the road and native navigation import on physical devices. Review map provider terms and arrange suitable infrastructure before replacing the source map embeds. Keep prior app releases and route data revisions for rollback. Add automated checks for withdrawn or stale routes before recommending them. Learner progress is local to the origin, so moving domains does not migrate it: export before moving and import on the new domain.
