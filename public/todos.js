const token = localStorage.getItem('token');
const todoListEl = document.getElementById('todos');

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.replace('/login.html');
    });
}

window.addEventListener('pageshow', (event) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
        window.location.replace('/login.html');
    }
});

if (!token) {
    console.error('No auth token found. Please login before fetching todos.');
    window.location.replace('/login.html');
} else if (!todoListEl) {
    console.error('No #todos element found in DOM. Add <ul id="todos"></ul> or similar.');
} else {
    fetch('http://localhost:3001/api/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                const errBody = await response.json().catch(() => null);
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    alert('Session expired or invalid token. Please login again.');
                    window.location.href = '/login.html';
                    return Promise.reject(new Error('Auth failed')); // stop processing
                }
                throw new Error(`Fetch failed ${response.status}: ${JSON.stringify(errBody)}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Todos:', data);
            todoListEl.innerHTML = '';
            data.forEach(todo => {
                const li = createTodoListItem(todo);
                todoListEl.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
        });
}

const taskForm = document.getElementById('task-form');

function createTodoListItem(todo) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = todo._id || todo.id || '';
    if (todo.completed) {
        li.classList.add('completed');
    }

    li.innerHTML = `
    <div class="task-content">
        <h3 class="task-title">${todo.title}</h3>
        <p class="task-desc">${todo.description || ''}</p>
        <span class="priority ${todo.priority}">${todo.priority}</span>
    </div>
    <div class="task-actions">
        <button class="complete-btn">✔</button>
        <button class="delete-btn">✖</button>
    </div>`;

    return li;
}

if (taskForm) {
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const titleInput = document.getElementById('title') || document.querySelector('.task-input');
        const descriptionInput = document.getElementById('description') || document.querySelector('.task-description');
        const priorityInput = document.getElementById('priority') || document.querySelector('.task-priority');

        const title = titleInput ? titleInput.value.trim() : '';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const priority = priorityInput ? priorityInput.value : 'medium';

        if (!title) {
            console.error('Task title is required');
            return;
        }

        fetch('http://localhost:3001/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, priority })
        })
            .then(async response => {
                if (!response.ok) {
                    const errBody = await response.json().catch(() => null);
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        alert('Session expired or invalid token. Please login again.');
                        window.location.href = '/login.html';
                        return Promise.reject(new Error('Auth failed'));
                    }
                    throw new Error(`Create failed ${response.status}: ${JSON.stringify(errBody)}`);
                }
                return response.json();
            })
            .then(newTodo => {
                const li = createTodoListItem(newTodo);
                todoListEl.appendChild(li);
                taskForm.reset();
                console.log('Created todo:', newTodo);
            })
            .catch(error => {
                console.error('Error creating todo:', error);
            });
    });
}

if (todoListEl) {
    todoListEl.addEventListener('click', function (e) {
        const target = e.target;

        if (target.classList.contains('delete-btn')) {
            const li = target.closest('li');
            const id = li && li.dataset.id;
            if (!id) {
                console.error('Todo id missing for delete');
                return;
            }

            fetch(`http://localhost:3001/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(async response => {
                    if (!response.ok) {
                        const errBody = await response.json().catch(() => null);
                        throw new Error(`Delete failed ${response.status}: ${JSON.stringify(errBody)}`);
                    }
                    return response.json();
                })
                .then(result => {
                    if (li) li.remove();
                    console.log('Deleted todo:', result);
                })
                .catch(error => {
                    console.error('Error deleting todo:', error);
                });
        }

        if (target.classList.contains('complete-btn')) {
            const li = target.closest('li');
            const id = li && li.dataset.id;
            if (!li || !id) {
                console.error('Todo id missing for complete');
                return;
            }

            fetch(`http://localhost:3001/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(async response => {
                    if (!response.ok) {
                        const errBody = await response.json().catch(() => null);
                        if (response.status === 401 || response.status === 403) {
                            localStorage.removeItem('token');
                            alert('Session expired or invalid token. Please login again.');
                            window.location.href = '/login.html';
                            return Promise.reject(new Error('Auth failed'));
                        }
                        throw new Error(`Complete failed ${response.status}: ${JSON.stringify(errBody)}`);
                    }
                    return response.json();
                })
                .then(updated => {
                    li.classList.toggle('completed');
                    console.log('Marked complete:', updated);
                })
                .catch(error => {
                    console.error('Error completing todo:', error);
                });
        }
    });
}
