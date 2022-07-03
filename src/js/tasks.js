if(!Tasks) var Tasks = {};

/**
 * Creates a tasks ui
 *
 * Options:
 * HTMLELement canvas - The canvas where the user interface will be created
 * string language - The ISO 639-1 code for example de_DE
 *
 * @class Tasks
 * @author Hendrik Weiler
 * @namespace Tasks
 */
Tasks.Tasks = class {

    /**
     * Returns the configuration object
     *
     * @memberOf Tasks
     * @type object
     * @var config
     */
    config = {};

    /**
     * Returns the node where the columns reside
     *
     * @memberOf Tasks
     * @type HTMLElement
     * @var columnsNode
     */
    columnsNode = null;

    /**
     * Returns the listener for mouseup
     *
     * @memberOf Tasks
     * @type Function
     * @var mouseupListener
     */
    mouseupListener = null;

    /**
     * Returns the listener for mousedown
     *
     * @memberOf Tasks
     * @type Function
     * @var mouseupListener
     */
    mousedownListener = null;

    /**
     * Returns the listener for mousemove
     *
     * @memberOf Tasks
     * @type Function
     * @var mouseupListener
     */
    mousemoveListener = null;

    /**
     * Returns the temporary drag node for dragging
     *
     * @memberOf Tasks
     * @type Function
     * @var tempDrag
     */
    tempDrag = null;

    /**
     * Returns the left starting point for dragging columns
     *
     * @memberOf Tasks
     * @type number
     * @var columnLeft
     */
    columnLeft = 0;

    /**
     * Returns the current column left position
     *
     * @memberOf Tasks
     * @type number
     * @var targetColumnLeft
     */
    targetColumnLeft = 0;

    /**
     * Returns the left starting point for dragging a task
     *
     * @memberOf Tasks
     * @type number
     * @var taskLeft
     */
    taskLeft = 0;

    /**
     * Returns the current task left position
     *
     * @memberOf Tasks
     * @type number
     * @var targetTaskLeft
     */
    targetTaskLeft = 0;

    /**
     * Returns the top starting point for dragging a task
     *
     * @memberOf Tasks
     * @type number
     * @var taskTop
     */
    taskTop = 0;

    /**
     * Returns the current task top position
     *
     * @memberOf Tasks
     * @type number
     * @var targetTaskTop
     */
    targetTaskTop = 0;

    /**
     * Returns if a column is being dragged or not
     *
     * @memberOf Tasks
     * @type boolean
     * @var mouseDraggingColumn
     */
    mouseDraggingColumn = false;

    /**
     * Returns if a task is being dragged or not
     *
     * @memberOf Tasks
     * @type boolean
     * @var mouseDraggingTask
     */
    mouseDraggingTask = false;

    /**
     * Returns if in between add buttons should be shown or not
     *
     * @memberOf Tasks
     * @type boolean
     * @var preventInBetweenAddBtns
     */
    preventInBetweenAddBtns = false;

    /**
     * Returns the task window instance
     *
     * @memberOf Tasks
     * @type TaskWindow
     * @var taskWindowInstance
     */
    taskWindowInstance = null;

    /**
     * Returns if the mouse is longer pressed at a task before an action occurs
     *
     * @memberOf Tasks
     * @type boolean
     * @var isMouseLongerPressedTask
     */
    isMouseLongerPressedTask = false;

    /**
     * The constructor
     *
     * @param object config The configuration object
     * @constructor
     * @method constructor
     * @memberOf Tasks
     */
    constructor(config) {

        this.config = Object.assign({
            canvas : document.body,
            language : 'en_US'
        }, config);
    }

    /**
     * Creates an unique id
     *
     * @method createId
     * @memberOf Tasks
     * @returns string
     */
    createId() {
        return 'task'+Date.now()+Math.random()*9999;
    }

    /**
     * Translates a string
     *
     * @memberOf Tasks
     * @method translate
     * @param string key The string to translate
     * @returns string
     */
    translate(key) {
        if (Tasks.Translations
            && Tasks.Translations[this.config.language]
            && Tasks.Translations[this.config.language][key]) {
            return Tasks.Translations[this.config.language][key];
        }
        return key;
    }

    /**
     * Handles the mouse up interaction
     *
     * @memberOf Tasks
     * @method mouseup
     * @param Event e The mouse event
     */
    mouseup(e) {
        this.isMouseLongerPressedTask = true;

        if(this.mouseDraggingColumn) {
            this.tempDrag.__ref__.parentNode.style.opacity = '';
            this.tempDrag.remove();
        }
        if(this.mouseDraggingTask) {

            this.tempDrag.__ref__.style.opacity = '';
            this.tempDrag.remove();
            this.updateCounts();
        }
        this.mouseDraggingColumn = false;
        this.mouseDraggingTask = false;
    }

    /**
     * Handles the mouse down interaction
     *
     * @memberOf Tasks
     * @method mousedown
     * @param Event e The mouse event
     */
    mousedown(e) {
        let taskContainer;
        if(taskContainer = e.target.closest('.tasks-column-body-tasks-task')) {
            if(taskContainer.dataset.onLabeling==1) return;
            this.isMouseLongerPressedTask = false;
            setTimeout(function () {
                if(this.isMouseLongerPressedTask) return;
                this.tempDrag = document.importNode(taskContainer,true);
                let rect = this.config.canvas.getBoundingClientRect(),
                    targetRect = taskContainer.getBoundingClientRect();
                this.tempDrag.classList.add('tempDrag');

                // left
                this.taskLeft = targetRect.left + (e.pageX - targetRect.left);
                this.targetTaskLeft = targetRect.left;
                // top
                this.taskTop = targetRect.top + (e.pageY - targetRect.top);
                this.targetTaskTop = targetRect.top;

                this.tempDrag.style.width = targetRect.width + 'px';
                this.tempDrag.style.height = targetRect.height + 'px';
                this.tempDrag.style.top = targetRect.top + 'px';
                this.tempDrag.style.left = targetRect.left + 'px';
                this.tempDrag.__ref__ = taskContainer;

                this.config.canvas.appendChild(this.tempDrag);

                this.mouseDraggingTask = true;
            }.bind(this),300);
        }
        if(e.target.classList.contains('tasks-column-title')
            && !e.target.parentNode.classList.contains('empty')) {
            this.tempDrag = document.importNode(e.target.parentNode,true);
            let rect = this.config.canvas.getBoundingClientRect(),
                targetRect = e.target.getBoundingClientRect();
            this.tempDrag.classList.add('tempDrag');
            this.tempDrag.style.width = targetRect.width + 'px';
            this.tempDrag.style.height = targetRect.height + 'px';
            this.tempDrag.style.top = (targetRect.top) + 'px';
            this.columnLeft = targetRect.left + (e.pageX - targetRect.left);
            this.targetColumnLeft = targetRect.left;
            this.tempDrag.style.left = targetRect.left + 'px';
            this.tempDrag.__ref__ = e.target;
            e.target.parentNode.style.opacity = '0.5';
            this.config.canvas.appendChild(this.tempDrag);

            this.mouseDraggingColumn = true;
        }
    }

    /**
     * Updates a task by id
     *
     * @method createId
     * @memberOf Tasks
     * @returns string
     */
    updateTask(id) {
        let taskNode = this.config.canvas.querySelector('[data-id="' + id + '"]'),
            label;
        if(taskNode) {
            label  = taskNode.querySelector('span');
            label.innerHTML = taskNode.__data__.headline;
        } else {
            console.log('Could not find task by id "' + id + '"');
        }

    }

    /**
     * Checks if a column can be dragged to another place
     *
     * @memberOf Tasks
     * @method sortingColumns
     */
    sortingColumns() {
        let left = parseFloat(this.tempDrag.style.left),
            columns = this.columnsNode.querySelectorAll('.tasks-column'),
            i = 0,
            column,
            rect,
            columnToMove = this.tempDrag.__ref__.parentNode,
            columnAfter;

        for(i; i < columns.length; ++i) {
            column = columns[i];
            rect = column.getBoundingClientRect();
            if(left > rect.left && !column.classList.contains('empty')) {
                columnAfter = column;
            }
        }

        if(columnAfter) {
            this.columnsNode.insertBefore(columnToMove, columnAfter.nextSibling);
        } else {
            this.columnsNode.insertBefore(columnToMove, columns[0]);
        }
    }

    /**
     * Handles the mouse move interaction
     *
     * @memberOf Tasks
     * @method mousemove
     * @param Event e The mouse event
     */
    mousemove(e) {
        if(this.mouseDraggingColumn) {

            this.tempDrag.style.left = (e.pageX - this.columnLeft + this.targetColumnLeft) + 'px';
            this.tempDrag.classList.remove('show');
            this.tempDrag.classList.add('show');

            this.sortingColumns();
        }
        if(this.mouseDraggingTask) {

            this.tempDrag.style.left = (e.pageX - this.taskLeft + this.targetTaskLeft) + 'px';
            this.tempDrag.style.top = (e.pageY - this.taskTop + this.targetTaskTop) + 'px';
            this.tempDrag.classList.remove('show');
            this.tempDrag.classList.add('show');
            this.tempDrag.__ref__.style.opacity = '0.5';

            this.movingTask();
        }

        this.isInBetweenTask(e.pageX, e.pageY);
    }

    /**
     * Adds a in between add task button
     *
     * @memberOf Tasks
     * @method addInBetweenAddTaskButton
     * @param HTMLElement task The task node
     */
    addInBetweenAddTaskButton(task) {
        let btn = document.createElement('a'),
            rect = task.getBoundingClientRect(),
            btnRect;
        btn.classList.add('tasks-inbetween-add-task');
        btn.innerText = '+';
        btn.onclick = function () {
            this.addTask(function (taskNode) {
                task.parentNode.insertBefore(taskNode,btn);
                btn.remove();
            });
        }.bind(this);
        task.parentNode.insertBefore(btn, task);
        btnRect = btn.getBoundingClientRect();
        btn.style.top = (rect.top - 20) + 'px';
        btn.style.left = (rect.left + rect.width/2 - btnRect.width/2) + 'px';
    }

    /**
     * Checks for in between tasks add buttons
     *
     * @memberOf Tasks
     * @method isInBetweenTask
     * @param number left The left position
     * @param number top The top position
     */
    isInBetweenTask(left, top) {
        let tasks = this.columnsNode.querySelectorAll('.tasks-column-body-tasks-task'),
            i = 0,
            task,
            rect,
            j,
            inBetweenAddBtns = this.columnsNode.querySelectorAll('.tasks-inbetween-add-task');

        for(j=0; j < inBetweenAddBtns.length; ++j) {
            inBetweenAddBtns[j].remove();
        }
        if(this.mouseDraggingTask || this.preventInBetweenAddBtns) return;
        for(i=0; i < tasks.length; ++i) {
            task = tasks[i];
            rect = task.getBoundingClientRect();
            if(left > rect.left && left < rect.left + rect.width
                && top > rect.top - 10
                && top < rect.top + 5) {
                if(task.dataset.inbetween=='true') return;
                this.addInBetweenAddTaskButton(task);
            }
        }
    }

    /**
     * Checks if the dragging task can be dropped in a column
     *
     * @memberOf Tasks
     * @method movingTask
     */
    movingTask() {
        let left = parseFloat(this.tempDrag.style.left),
            top = parseFloat(this.tempDrag.style.top),
            columnsTasks = this.columnsNode.querySelectorAll('.tasks-column-body-tasks'),
            tasks,
            task,
            i = 0,
            j,
            columnTasksContainer,
            rect,
            taskRect,
            taskToMove = this.tempDrag.__ref__,
            insertBefore = false;

        for(i; i < columnsTasks.length; ++i) {
            columnTasksContainer = columnsTasks[i];
            rect = columnTasksContainer.getBoundingClientRect();
            if(left > rect.left - 10) {
                tasks = columnTasksContainer.querySelectorAll('.tasks-column-body-tasks-task');
                if(tasks.length==0) {
                    columnTasksContainer.appendChild(taskToMove);
                } else {
                    insertBefore = false;
                    for(j=0; j < tasks.length; ++j) {
                        task = tasks[j];
                        taskRect = task.getBoundingClientRect();

                        if(top > taskRect.top) {
                            insertBefore  = true;
                            columnTasksContainer.insertBefore(taskToMove, task.nextSibling);
                        }
                    }

                    if(!insertBefore) {
                        columnTasksContainer.insertBefore(taskToMove, tasks[0]);
                    }
                }
            }
        }
    }

    /**
     * Destroys the instance
     *
     * @memberOf Tasks
     * @method destroy
     */
    destroy() {
        this.config.canvas.removeEventListener('mouseup', this.mouseupListener);
        this.config.canvas.removeEventListener('mousemove', this.mousemoveListener);
        this.config.canvas.removeEventListener('mousedown', this.mousedownListener);

        this.config.canvas.innerHTML = '';
    }

    /**
     * Load tasks and columns from a data source
     *
     * @example loadFromDataExample
     * @param array data The data
     * @memberOf Tasks
     * @method loadFromData
     */
    loadFromData(data) {
        let i = 0,
            col,
            tasks,
            j,
            tasksContainers,
            task;
        for(i; i < data.length; ++i) {
            col = data[i];
            tasks = col.tasks;
            this.addColumn(col.name);
            tasksContainers = this.columnsNode.querySelectorAll('.tasks-column-body-tasks');
            for(j=0; j < tasks.length; ++j) {
                task = tasks[j];
                this.addTask(tasksContainers[i], task.headline, task);
            }
        }
    }

    /**
     * Adds a task to a column
     *
     * tasksContainer callback signature:
     * void tasksContainer(taskNode)
     *
     * @param HTMLElement|Function The node to append to or the callback for own insertion of the task
     * @param string|null headline (optional) The headline, if set there wont be a textarea to focus
     * @param object data (optional) The data of the task
     * @memberOf Tasks
     * @method addTask
     */
    addTask(tasksContainer, headline, data) {
        let taskNode = document.createElement('div'),
            textarea = document.createElement('textarea'),
            preventDoubleBlur = false;
        taskNode.classList.add('tasks-column-body-tasks-task');
        taskNode.appendChild(textarea);

        taskNode.onclick = function (e) {
            if(!e.currentTarget.classList.contains('show')) {
                if(this.taskWindowInstance) this.taskWindowInstance.destroy();
                this.taskWindowInstance = new Tasks.TaskWindow({
                    language: this.config.language,
                    data : e.currentTarget.__data__
                });
                this.taskWindowInstance.render();
            }
        }.bind(this);

        if(typeof tasksContainer == 'function') {
            tasksContainer(taskNode);
        } else {
            tasksContainer.appendChild(taskNode);
        }

        textarea.onfocus = function () {
            this.preventInBetweenAddBtns = true;
        }.bind(this);
        textarea.onkeyup = function (e) {
            if(e.key === 'Enter') {
                textarea.onblur(e);
            }
        }
        textarea.onblur = function (e) {
            if(preventDoubleBlur) return;
            preventDoubleBlur = true;
            delete taskNode.dataset.onLabeling;
            this.preventInBetweenAddBtns = false;
            if(e.currentTarget.value.length==0) {
                taskNode.remove();
                this.updateCounts();
            } else {
                taskNode.__data__.headline = e.currentTarget.value;
                taskNode.innerHTML = '<span>'+e.currentTarget.value+'</span>';
            }
        }.bind(this);

        if(!data) {
            data = {
                headline : textarea.value,
                description : ''
            }
        }

        if(!data.id) {
            data.id = this.createId();
            taskNode.dataset.id = data.id;
        }

        taskNode.dataset.onLabeling = 1;
        taskNode.__data__ = data;

        if(!headline) {
            textarea.focus();
        } else {
            textarea.value = headline;
            textarea.onblur({
                currentTarget : textarea
            });
        }

        this.updateCounts();
    }

    /**
     * Updates all task counts of each column
     *
     * @memberOf Tasks
     * @method updateCounts
     */
    updateCounts() {
        let columns = this.columnsNode.querySelectorAll('.tasks-column'),
            i = 0,
            column,
            tasks,
            counterElm;

        for(i; i < columns.length; ++i) {
            column = columns[i];
            if(column.classList.contains('empty')) continue;
            counterElm = column.querySelector('.tasks-column-title-count');
            tasks = column.querySelectorAll('.tasks-column-body-tasks-task');
            counterElm.innerText = tasks.length;
        }

    }

    addColumn(title) {
        let tasksColumn = document.createElement('div'),
            template = `
            <div class="tasks-column-title">
                <input value="` + title + `">
                <span class="tasks-column-title-count">0</span>
            </div>
            <div class="tasks-column-body">
                <div class="tasks-column-body-tasks"></div>
                <a class="tasks-column-body-add-task" href="javascript:">+</a>
            </div>
        `,
            titleElm,
            addTaskElm,
            tasksContainerElm,
        emptyColumn = this.config.canvas.querySelector('.tasks-column.empty');
        tasksColumn.classList.add('tasks-column');
        tasksColumn.innerHTML = template;

        tasksContainerElm = tasksColumn.querySelector('.tasks-column-body-tasks');
        titleElm = tasksColumn.querySelector('.tasks-column-title');
        addTaskElm = tasksColumn.querySelector('.tasks-column-body-add-task');
        addTaskElm.onclick = function () {
            this.addTask(tasksContainerElm);
        }.bind(this);

        this.columnsNode.insertBefore(tasksColumn, emptyColumn);
    }

    /**
     * Adds a empty column where you can add real columns with
     *
     * @memberOf Tasks
     * @method addEmptyColumn
     */
    addEmptyColumn() {
        let tasksColumn = document.createElement('div'),
            template = `
            <div class="tasks-column-title">` + this.translate("+ Add column") + `</div>
            <div class="tasks-column-body"></div>
        `,
        titleElm;
        tasksColumn.classList.add('tasks-column');
        tasksColumn.classList.add('empty');
        tasksColumn.innerHTML = template;

        titleElm = tasksColumn.querySelector('.tasks-column-title');
        titleElm.onclick = function () {
            this.addColumn(this.translate('Untitled'));
        }.bind(this);

        this.columnsNode.appendChild(tasksColumn);
    }

    /**
     * Renders the tasks initially
     *
     * @memberOf Tasks
     * @method render
     */
    render() {
        this.config.canvas.classList.add('tasks');
        this.columnsNode = document.createElement('div');
        this.columnsNode.classList.add('tasks-columns');
        this.config.canvas.innerHTML = '';
        this.config.canvas.appendChild(this.columnsNode);
        this.addEmptyColumn();

        this.config.canvas.addEventListener('mouseup', this.mouseupListener = this.mouseup.bind(this));
        this.config.canvas.addEventListener('mousemove', this.mousemoveListener = this.mousemove.bind(this));
        this.config.canvas.addEventListener('mousedown', this.mousedownListener = this.mousedown.bind(this));

        this.loadFromData(this.config.data);
    }

}

var tasksInstance;

function tasks(config) {
    if(!tasksInstance) {
        tasksInstance = new Tasks.Tasks(config);
        tasksInstance.render();
    }
    return tasksInstance;
}