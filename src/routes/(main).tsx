import { A, Outlet, useLocation } from "solid-start"

export default function Main() {
  return <>
    <nav>
      <A href="/">{'<'} Back</A> &bull; <h1>{useLocation().pathname.split('/').slice(-1)}</h1>
    </nav>
    <Outlet />
  </>
}