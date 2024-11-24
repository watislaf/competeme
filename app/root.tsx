import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import { GlobalPendingIndicator } from "@/components/global-pending-indicator";
import { Header } from "@/components/header";
import {
  ThemeSwitcherSafeHTML,
  ThemeSwitcherScript,
} from "@/components/theme-switcher";

import "./globals.css";
import { Analytics } from "@vercel/analytics/remix";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query Error:", error, query);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      console.error("Mutation Error:", error, { variables, context, mutation });
    },
  }),
});

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeSwitcherSafeHTML lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeSwitcherScript />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
          <ScrollRestoration />
          <Scripts />
          <Analytics />
        </QueryClientProvider>
      </body>
    </ThemeSwitcherSafeHTML>
  );
}

export default function Root() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    status = error.status;
    switch (error.status) {
      case 404:
        message = "Page Not Found";
        break;
    }
  } else {
    console.error(error);
  }

  return (
    <App>
      <div className="container prose py-8">
        <h1>{status}</h1>
        <p>{message}</p>
      </div>
    </App>
  );
}
