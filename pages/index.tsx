import Head from "next/head";
import { useSession } from "next-auth/react"
import TodoList from "@/components/TodoList";


export default function Home() {
 
  return<>
  <TodoList />
  </>
}