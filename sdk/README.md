# Analytics SDK

Standalone browser SDK for the analytics platform MVP.

## Usage

```html
<script type="module">
  import Analytics from './src/analytics.js';

  Analytics.init({
    apiKey: 'demo-key',
    endpoint: 'http://localhost:8000',
  });

  Analytics.track('product_view', {
    product_id: 'P001',
  });
</script>
```

## Behavior

- Generates an anonymous ID on first use.
- Persists the anonymous ID in `localStorage` when available.
- Sends events to `POST /api/events/track`.
- Swallows network failures and returns `false` instead of throwing.
