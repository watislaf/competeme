import * as Sentry from "@sentry/remix";

Sentry.init({
  dsn: "https://51abd6dc44906345a5160139656e0643@o4509056807206912.ingest.de.sentry.io/4509060527489104",
  tracesSampleRate: 1,
});
