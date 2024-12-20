type TodoItem = {
    id: number;
    text: string;
    checked: boolean;
};

type TDListModalProps = {
    todo: TodoItem[] | undefined;
    openModalForAdd: OpenModalForAdd;
    openModalForEdit: OpenModalForEdit;
    handleDeleteTodo: HandleDeleteTodo;
  };
type OpenModalForAdd = () => void;
type OpenModalForEdit = (todoItem: TodoItem) => void;
type HandleDeleteTodo = (id: number) => void;

export default function TDListModal({ todo, openModalForAdd, openModalForEdit, handleDeleteTodo }: TDListModalProps) {
    return (
        <div>
            <h2>Список задач</h2>
            <button onClick={openModalForAdd}>Добавить задачу</button>
            <ul>
                {todo?.map(todoItem => (
                    <li key={todoItem.id}>
                        <div className="div-content">
                            <span style={{ textDecoration: todoItem.checked ? 'line-through' : 'none' }}>
                                {todoItem.text}
                            </span>
                        </div>
                        <div className="button-click">
                            <button onClick={() => openModalForEdit(todoItem)}>🖊 </button>
                            <button onClick={() => handleDeleteTodo(todoItem.id)}>❌</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
