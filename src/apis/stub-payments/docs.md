# Getting Started with Demo Payments

## Overview
The Demo Payments API allows you to accept payments, manage customers, and process refunds.

## Base URL
```
https://api.Demo.dev/v1
```

## Authentication
All API requests require a valid API key passed in the `Authorization` header:
```
Authorization: Bearer Demo_sk_live_...
```

## Quick Example
```bash
curl -X POST https://api.Demo.dev/v1/payments \
  -H "Authorization: Bearer Demo_sk_test_abc123" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd"}'
```

## Error Handling
| Status Code | Description |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Invalid API key |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
