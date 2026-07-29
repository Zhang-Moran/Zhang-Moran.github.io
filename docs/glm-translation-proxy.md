# GLM translation proxy

GitHub Pages cannot safely call the GLM API directly: any API key included in browser JavaScript is public. Deploy a small HTTPS proxy, keep `ZHIPU_API_KEY` in that service's secret store, and set its URL in `_config.yml`:

```yaml
glm_translation_endpoint: "https://your-domain.example/api/translate"
```

The page sends this JSON request:

```json
{"source_language":"zh-CN","target_language":"en","texts":["...", "..."]}
```

The proxy must return the same number of translated strings:

```json
{"translations":["...", "..."]}
```

Allow `POST` requests from `https://zhang-moran.github.io` through CORS. The browser never receives the GLM key.
