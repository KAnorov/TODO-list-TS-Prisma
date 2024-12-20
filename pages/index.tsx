import TodoList from "@/components/TodoList";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  console.log(' Signed in as', { session });
  if (session) {
    return (
      <>
        Вошел в систему как {session.user?.name} ({session.user?.email}) 
        {session.user?.image &&
          <img src={session.user.image}
            style={{ width: '50px', borderRadius: '50%' }} />}
        
        <button onClick={() => signOut()}>Выйти</button>
       <TodoList />
      </>
    )
  }
  return (
    <>
  
      Войдите в аккаунт:
      <button onClick={() => signIn()}>Войти</button>
    </>
  )
};
