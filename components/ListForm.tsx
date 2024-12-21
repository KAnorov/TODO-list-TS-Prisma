
type todoData = {
    text: string;
    checked: boolean;
};
type ListFormProps = {
    todoData: todoData;
    editingTodoId: number | null;
    handleAddTodo: () => void;
    handleEditTodo: () => void;
    closeModal: () => void;
    handleChange: (field: keyof todoData)=> (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  };


export default function ListForm({ todoData, editingTodoId, handleAddTodo, handleEditTodo, closeModal, handleChange }:ListFormProps) {
    const { text, checked } = todoData;

    return (
        <div>
            
            <fieldset>
                <h3>{editingTodoId ? 'Редактировать задание?' : 'Добавить задание?'}</h3>
                <textarea
                
                    placeholder="Введите текст..."
                    value={text}
                    onChange={handleChange('text')}
                ></textarea>
                <label>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange('checked')} /> Завершено
                </label>
                <button onClick={editingTodoId ? handleEditTodo : handleAddTodo}>
                    {editingTodoId ? 'Сохранить' : 'Добавить'}
                </button>
                <button type="button" onClick={closeModal}>Закрыть</button>
            </fieldset>
        </div>
    );
}
