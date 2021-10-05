import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.css";
import { buildClient } from "../api/build-client";
import Navbar from "../components/layout/Navbar";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <Navbar currentUser={currentUser}>
      <Component {...pageProps} />
    </Navbar>
  );
}
MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const { ctx } = appContext;
  const { data } = await buildClient(ctx.req).request({
    method: "GET",
    url: "/api/users/currentuser",
  });

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps({
      ...ctx,
      currentUser: data.currentUser,
    });
  }

  return { pageProps, ...data };
};
export default MyApp;
