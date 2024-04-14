// @refresh reload
import { Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.scss";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <script async src="https://espy.boehs.org/script.js" data-website-id="c65e41eb-8bd1-4149-9087-a03846f6d103"></script>
        <Title>Evan.Rest</Title>
        <Meta property="og:title" content="Evan.Rest" />
        <Meta property="og:image" content="https://evan.rest/og.png" />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#e15be1" />
        <Link rel="icon" type="image/png" href="/favicon.png" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <Link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
