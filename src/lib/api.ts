import type { ApiEnvelope, FieldError } from './types';

const API_BASE = '/api/v1';
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly errors: FieldError[];

  constructor(status: number, message: string, errors: FieldError[] = []) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.errors = errors;
  }
}

function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const timeoutSignal =
    typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(REQUEST_TIMEOUT_MS) : undefined;
  const signals = [init.signal, timeoutSignal].filter(
    (signal): signal is AbortSignal => Boolean(signal),
  );
  const signal =
    signals.length === 0
      ? undefined
      : typeof AbortSignal.any === 'function'
        ? AbortSignal.any(signals)
        : signals[0];

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'same-origin',
      signal,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiRequestError(0, 'The server took too long to respond. Please try again.');
    }
    throw new ApiRequestError(0, 'Cannot connect to the server. Please try again.');
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (response.status === 401 && !path.startsWith('/auth/')) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }
  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(
      response.status,
      payload?.message ?? 'Something went wrong. Please try again.',
      payload?.errors ?? [],
    );
  }
  return payload;
}

export function apiGet<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<ApiEnvelope<T>> {
  return apiRequest<T>(`${path}${toQuery(params)}`);
}

export function apiSend<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: unknown,
): Promise<ApiEnvelope<T>> {
  return apiRequest<T>(path, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
