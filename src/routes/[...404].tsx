import { A, Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Nothing!</h1>
      <A href="/">ABORT ABORT ABORT ABORT</A>
    </main>
  );
}
