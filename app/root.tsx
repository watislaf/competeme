import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { Header } from "@/components/header/header";
import {
  ThemeSwitcherSafeHTML,
  ThemeSwitcherScript,
} from "@/components/theme-switcher";

import "./globals.css";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { isUnauthorized } from "@/errors/Unauthorized";
import { useMemo } from "react";

function App({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (isUnauthorized(error)) {
              navigate("/login");
              localStorage.removeItem("ACCESS_TOKEN_KEY");
              localStorage.removeItem("REFRESH_TOKEN");
            }

            console.error("Query Error:", error, query);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, query) => {
            if (isUnauthorized(error)) {
              navigate("/login");
              localStorage.removeItem("ACCESS_TOKEN_KEY");
              localStorage.removeItem("REFRESH_TOKEN");
            }
            console.error("Mutation Error:", error, query);
          },
        }),
      }),
    [],
  );

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
        </QueryClientProvider>
      </body>
    </ThemeSwitcherSafeHTML>
  );
}

function Root() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export default withSentry(Root);

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

  captureRemixErrorBoundaryError(error);

  return (
    <App>
      <div className="container prose py-8">
        <h1>{status}</h1>
        <p>{message}</p>
      </div>
    </App>
  );
}
