import Header from "@/components/Header";

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps)  {
  return <>
  
  <SessionProvider session={session}>
  <Header />
  <Component {...pageProps} />
  <Toaster />

  </SessionProvider>
  
  </> 
}
 
