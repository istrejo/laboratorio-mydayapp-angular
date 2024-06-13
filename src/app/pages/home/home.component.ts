import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from 'src/app/models/todo.interface';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  todos: Todo[] = [];
  tempTodos: Todo[] = [];
  editMode: boolean = false;
  todoSelectedToEdit!: Todo;
  currentUrl: string = '';

  constructor(
    private router: Router,
    private localStorageSvc: LocalStorageService
  ) {}

  /**
   * The `ngOnInit` function initializes the component by setting the current URL and retrieving todos
   * from local storage if they exist.
   */
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.localStorageSvc.getItem('todos')) {
      this.todos = this.localStorageSvc.getItem('todos');
      this.filterTodos();
    }
  }

  /**
   * The `addNewTodo` function adds a new todo item to a list when the Enter key is pressed.
   * @param {KeyboardEvent} event - The `event` parameter in the `addNewTodo` function is of type
   * `KeyboardEvent`. It represents the keyboard event that occurred when a key was pressed while the
   * input field is focused.
   */
  addNewTodo(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const title = input.value.trim();
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    if (event.key === 'Enter') {
      this.tempTodos?.unshift(newTodo);
      input.value = '';
    }
    this.saveTodos();
  }

  /**
   * The `toggleCheck` function toggles the `completed` status of a todo item in a list of todos.
   * @param {Todo} todo - The `toggleCheck` function takes a `todo` object as a parameter. The `todo`
   * object represents a task or item in a todo list and has properties such as `id` and `completed`.
   * The function toggles the `completed` status of the specified `todo` item in the
   */
  toggleCheck(todo: Todo) {
    this.tempTodos = this.tempTodos.map((item: Todo) => {
      if (todo.id === item.id) {
        return {
          ...item,
          completed: !item.completed,
        };
      }
      return item;
    });
    this.saveTodos();
  }

  /**
   * The `deleteTodo` function removes a specific todo item from the list of todos and saves the
   * updated list.
   * @param {Todo} Todo - The `deleteTodo` function takes a parameter `Todo` of type `Todo`, which is
   * an object representing a todo item to be deleted. The function filters out the todo item with the
   * same `id` as the `Todo` object from the `tempTodos` array and then saves the updated
   */
  deleteTodo(Todo: Todo) {
    this.tempTodos = this.tempTodos.filter((item) => item.id != Todo.id);
    this.todos = this.tempTodos;
    this.saveTodos();
  }

  /**
   * The function `selectTodoToEdit` sets the edit mode to true and assigns the selected todo item to be
   * edited.
   * @param {Todo} Todo - The `selectTodoToEdit` function takes a `Todo` object as a parameter. This
   * `Todo` object represents the todo item that the user wants to edit. When this function is called,
   * it sets the `editMode` flag to true and assigns the selected `Todo` object to the
   */
  selectTodoToEdit(Todo: Todo) {
    this.editMode = true;
    this.todoSelectedToEdit = Todo;
  }

  /**
   * The editTodo function in TypeScript updates a todo item's title and saves the changes when the
   * Enter key is pressed, or cancels the edit mode when the Escape key is pressed.
   * @param {KeyboardEvent} event - KeyboardEvent
   * @returns If the event key is 'Escape', the editMode is set to false and the function returns.
   */
  editTodo(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const title = input.value.trim();

    this.todoSelectedToEdit.title = title;

    if (event.key === 'Escape') {
      this.editMode = false;
      return;
    }

    if (event.key === 'Enter') {
      this.tempTodos = this.tempTodos.map((Todo) => {
        if (this.todoSelectedToEdit.id === Todo.id) {
          return {
            ...this.todoSelectedToEdit,
          };
        }
        return Todo;
      });
      this.editMode = false;
    }
    this.saveTodos();
  }

  /**
   * The function `pendingTodos` returns the number of incomplete todos in the `todos` array.
   * @returns The `get pendingTodos()` method returns the number of todos that are not completed (i.e.,
   * where `completed` property is false) in the `todos` array.
   */
  get pendingTodos() {
    return this.todos.filter((todos) => !todos.completed).length;
  }

  /**
   * The `clearCompleted` function filters out completed todos from the list and updates the todos
   * accordingly.
   * @returns In the `clearCompleted()` function, either `undefined` or `void` is being returned
   * implicitly. This is because there is no explicit `return` statement at the end of the function.
   */
  clearCompleted() {
    if (this.currentUrl === '/completed') {
      this.tempTodos = [];
      this.todos = this.todos.filter((todo) => todo.completed === false);
      this.saveTodos();
      return;
    }
    this.todos = this.tempTodos.filter((todo) => todo.completed === false);
    this.tempTodos = this.todos;
    this.saveTodos();
  }

  /**
   * The function `filterTodos` filters todos based on their completion status depending on the current
   * URL.
   */
  filterTodos() {
    switch (this.currentUrl) {
      case '/completed':
        this.tempTodos = this.todos.filter((Todo) => Todo.completed);
        break;
      case '/pending':
        this.tempTodos = this.todos.filter((Todo) => !Todo.completed);
        break;
      default:
        this.tempTodos = this.todos;
    }
  }

  /**
   * The `saveTodos` function saves either the `todos` or `tempTodos` array to local storage based on
   * the current URL.
   * @returns If the current URL is '/completed', the function will return without explicitly returning
   * a value. If the current URL is not '/completed', the function will also return without explicitly
   * returning a value.
   */
  saveTodos() {
    if (this.currentUrl === '/completed') {
      this.localStorageSvc.setItem('todos', this.todos);
      return;
    }
    this.localStorageSvc.setItem('todos', this.tempTodos);
  }
}
