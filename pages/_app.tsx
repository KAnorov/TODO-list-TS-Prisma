import TodoList from "@/components/TodoList";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps)  {
  return <>
  <SessionProvider session={session}>
  <Component {...pageProps} />
  </SessionProvider>
  <Toaster />
  <TodoList /> Добавил специально для проверки ДЗ предыдущей, на случай если не сработает авторизация!
  </> 
}
 
