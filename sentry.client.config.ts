import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers["Authorization"];
      delete event.request.headers["Cookie"];
    }
    if (event.request?.data) {
      const data = event.request.data as Record<string, unknown>;
      if (data.password) data.password = "[Filtered]";
      if (data.email) data.email = "[Filtered]";
    }
    return event;
  },
  enabled: process.env.NODE_ENV === "production",
});
 