// src/pages/_app.js
import "@/app/globals.css"; // Make sure this path points to your globals.css!

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}