import useSWR from 'swr';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import ListForm from '@/components/ListForm';
import TDListModal from '@/components/TDListModal';
import { Todo } from '@prisma/client';

const URL_APP = '/api/todos';

type TodoData = {
    text: string;
    checked: boolean;
    id: number;
};

async function fetcher(url: string | URL): Promise<Todo[]> {
    const response = await fetch(url);
    console.log('fetcher=', response);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при загрузке данных: ${response.status} - ${errorText}`);
    }
    return response.json();

}
export default function TodoList() {
    const [todoData, setTodoData] = useState<TodoData>({ text: '', checked: false, id: 0 });
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: todo, error, isValidating, isLoading, mutate } = useSWR<Todo[]>(URL_APP, fetcher);

    const addTodo = async (todo: { id: number; text: string; checked: boolean }) => {
        const response = await fetch(URL_APP, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error('Ошибка при добавлении задания: ' + errorMessage);
        }

        return response.json();
    };
    const editTodo = async (id: number | null, todo: { id: number; text: string; checked: boolean }) => {
        const response = await fetch(`${URL_APP}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error('Ошибка при редактировании задания');
        }
        return response.json();
    };
    const handleAddTodo = async () => {
        if (!todoData.text.trim()) {
            return toast.error('Задание не может быть пустым!');
        }
        const newTodo = { ...todoData, id: Date.now() };
        mutate((currentTodos) => [...(currentTodos || []), newTodo], false);
        try {
            const addedTodo: Todo = await addTodo(todoData);
            toast.success('Задание успешно добавлено');
            mutate((currentTodos) => currentTodos?.map((todo) => todo.id === newTodo.id ? { ...todo, id: addedTodo.id } : todo), false);
            setTodoData({ text: '', checked: false, id: 0 });
            setIsModalOpen(false);
        } catch (error: unknown) {
            if (error instanceof Error)
                toast.error(error.message);
            mutate((currentTodos) => currentTodos?.filter((todo) => todo.id !== newTodo.id), false);
        }
        mutate();

    };
    const handleDeleteTodo = async (id: null | Todo['id']) => {
        try {
            const response = await fetch(`${URL_APP}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Ошибка при удалении задания');
            }
            toast.success('Задание успешно удалено');
            mutate();
        } catch (error: unknown) {
            if (error instanceof Error)
                toast.error(error.message);
        }
    };
    const handleEditTodo = async () => {
        if (!todoData.text.trim()) {
            toast.error('Задание не может быть пустым!');
            return;
        }
        try {
            await editTodo(editingTodoId, todoData);
            toast.success('Задание успешно обновлено');
            setTodoData({ text: '', checked: false, id: 0 });
            setEditingTodoId(null);
            setIsModalOpen(false);
            mutate();
        } catch (error: unknown) {
            if (error instanceof Error)
                toast.error(error.message);
        }
    };
    const handleChange = (field: keyof TodoData) => async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = field === 'checked' ? ((event.target) as HTMLInputElement).checked : (event.target as HTMLTextAreaElement).value;
        setTodoData((prevTodoData) => ({ ...prevTodoData, [field]: value, }));
        if (editingTodoId) {
            try {
                const response = await fetch(`${URL_APP}/${editingTodoId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [field]: value }),
                });

                if (!response.ok) {
                    throw new Error('Ошибка обновления задачи');
                }
                const data = await response.json();
                console.log('Задача обновлена:', data);
            } catch (error: unknown) {
                if (error instanceof Error)
                console.error('Ошибка:', error);
            }
        }
    };
    const openModalForAdd = () => {
        setTodoData({ text: '', checked: false, id: 0 });
        setEditingTodoId(null);
        setIsModalOpen(true);
    };
    const openModalForEdit = (todo: Todo) => {
        setEditingTodoId(todo.id);
        setTodoData({ text: todo.text, checked: todo.checked, id: todo.id });
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setTodoData({ text: '', checked: false, id: 0 });
        setEditingTodoId(null);
    };
    return <>
        <div className="container" >
            <div
                style={{ position: 'absolute', fontSize: 'xxx-large', top: '200px' }}>
                {isLoading && '⌛'}
                {isValidating && '👁'}
                {error && `💀 ${error.toString()}`}
            </div>
            < TDListModal
                todo={todo}
                openModalForAdd={openModalForAdd}
                openModalForEdit={openModalForEdit}
                handleDeleteTodo={handleDeleteTodo}
            />
            {isModalOpen && (
                <div className="modal" >
                    <ListForm
                        todoData={todoData}
                        editingTodoId={editingTodoId}
                        handleAddTodo={handleAddTodo}
                        handleEditTodo={handleEditTodo}
                        closeModal={closeModal}
                        handleChange={handleChange}
                    />
                </div>
            )}
        </div>
    </>;
}