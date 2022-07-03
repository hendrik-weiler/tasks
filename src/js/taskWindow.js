if(!Tasks) var Tasks = {};

/**
 * Creates a task window
 *
 * Options:
 * HTMLELement canvas - The node where the window will be created
 * string language - The ISO 639-1 code for example de_DE
 * object data - The task node data object
 *
 * @class TaskWindow
 * @author Hendrik Weiler
 * @namespace Tasks
 */
Tasks.TaskWindow = class {
    /**
     * Returns the configuration object
     *
     * @memberOf TaskWindow
     * @type object
     * @var config
     */
    config = {};

    /**
     * Returns overlay node
     *
     * @memberOf TaskWindow
     * @type HTMLElement
     * @var overlay
     */
    overlay = document.createElement('div');

    /**
     * Returns window node
     *
     * @memberOf TaskWindow
     * @type HTMLElement
     * @var window
     */
    window = document.createElement('div');

    /**
     * Translates a string
     *
     * @memberOf TaskWindow
     * @method translate
     * @param string key The string to translate
     * @returns string
     */
    translate(key) {
        console.log(this.config)
        if (Tasks.Translations
            && Tasks.Translations[this.config.language]
            && Tasks.Translations[this.config.language][key]) {
            return Tasks.Translations[this.config.language][key];
        }
        return key;
    }

    /**
     * The constructor
     *
     * @param object config The configuration object
     * @constructor
     * @method constructor
     * @memberOf TaskWindow
     */
    constructor(config) {
        this.config = Object.assign({
            canvas : document.body,
            language : 'en_US',
            data : {}
        }, config);
    }

    /**
     * Renders the task window
     *
     * @memberOf TaskWindow
     * @method render
     */
    render() {
        this.window.classList.add('task-window');
        this.overlay.classList.add('task-overlay');
        this.overlay.appendChild(this.window);

        this.window.innerHTML = `
            <form action="javascript:" name="taskWindow">
                <input type="hidden" name="mode">
                <div class="task-window-headline">
                    <input name="headline" type="text">
                </div>
                <div class="task-window-description">
                    <label for="description">` + this.translate('Description') + `</label>
                    <textarea name="description" cols="30" rows="10"></textarea>
                </div>
                <div class="task-window-options">
                    <button onclick="this.form.mode.value='cancel'" type="submit">` + this.translate('Cancel') + `</button>
                    <button class="primary" onclick="this.form.mode.value='save'" formnovalidate type="submit">` + this.translate('Save') + `</button>
                </div>
            </form>
        `;

        this.config.canvas.appendChild(this.overlay);

        document.forms.taskWindow.headline.value = this.config.data.headline;
        document.forms.taskWindow.description.value = this.config.data.description;

        document.forms.taskWindow.onsubmit = function (e) {
            e.preventDefault();

            if(e.currentTarget.mode.value == 'cancel') {
                this.destroy();
            }
            if(e.currentTarget.mode.value == 'save') {
                this.config.data.description = document.forms.taskWindow.description.value;
                this.config.data.headline = document.forms.taskWindow.headline.value;
                tasks().updateTask(this.config.data.id);
                this.destroy();
            }
        }.bind(this);
    }

    /**
     * Destroys the task window
     *
     * @memberOf TaskWindow
     * @method destroy
     */
    destroy() {
        this.overlay.remove();
    }
}