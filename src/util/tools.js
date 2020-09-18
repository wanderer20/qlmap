/**
 * Метод возвращает элемент из строки
 * @param htmlString
 * @returns {ChildNode}
 */
export function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

/**
 * Метод возвращает
 * @param item
 * @returns {*|boolean}
 */
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Метод мерджит два объекта
 * @param target
 * @param source
 * @returns {*}
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Метод возвращает выборку из нескольких тегов
 * @param tags
 * @returns {[]}
 */
Node.prototype.getElementsByTagNames = function (tags) {
    var elements = [];

    for (var i = 0, n = tags.length; i < n; i++) {
        // Concatenate the array created from a HTMLCollection object
        elements = elements.concat(Array.prototype.slice.call(this.getElementsByTagName(tags[i])));
    }

    return elements;
};