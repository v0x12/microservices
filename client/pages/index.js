import Head from "next/head";

export default function Home(props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {/* <span>{currentUser ? "You are logged in" : "You are not logged in"}</span> */}
    </div>
  );
}

Home.getInitialProps = ({ req, res }) => {
  const props = {
    norbert: "lol",
  };
  return { ...props };
};
