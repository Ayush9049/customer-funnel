import json
import urllib.request
import urllib.error

BASE = 'http://127.0.0.1:8000'


def post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode('utf-8')
            print('POST', url, 'status=', resp.status)
            print(body)
    except urllib.error.HTTPError as e:
        print('POST HTTPError', e.code, e.read().decode('utf-8'))
    except Exception as e:
        print('POST Error', e)


def get(url):
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            body = resp.read().decode('utf-8')
            print('GET', url, 'status=', resp.status)
            print(body)
    except urllib.error.HTTPError as e:
        print('GET HTTPError', e.code, e.read().decode('utf-8'))
    except Exception as e:
        print('GET Error', e)


if __name__ == '__main__':
    event = {
        'user_id': 'smoke-user',
        'anonymous_id': 'smoke-anon',
        'event_name': 'product_view',
        'properties': {'product_id': 'SMOKE-001'},
    }

    post(f"{BASE}/api/events/track", event)
    print('\n--- Funnel ---')
    get(f"{BASE}/api/analytics/funnel")
    print('\n--- Events (filter smoke-user) ---')
    get(f"{BASE}/api/events?page=1&page_size=5&user_id=smoke-user")
