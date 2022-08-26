import { foreach, is } from "@tuval/core";
import { System } from "@tuval/core";
import { createElement as c } from "../../../preact/compat";
import { TComponent } from "./AAA/Control";
import { ComponentCollection } from "./AAA/ControlCollection";

let rootDOMElement, rootReactElement;
const classMap = {};
let classCounter = 0;
const REACT_CLASS = 'REACT_CLASS';

function isStateLessComponent(element) {
    return !isClass(element) && typeof element === 'function'
}

function isClass(func: any) {
    return typeof func === 'function' && func['getTeactInstance'];
}

function shouldAddEventListener(property) {
    return /^on.*$/.test(property);
}


function anElement(element, props, children) {
    if (isClass(element)) {
        return handleClass(element, props, children);
    } else if (isStateLessComponent(element)) {
        return new element(props);
    } else {
        return handleHtmlElement(element, props, children);
    }
}

function handleClass(clazz: any, props, children) {
    classCounter++;
    if (classMap[classCounter]) {
        return classMap[classCounter];
    }
    props.children = children || [];
    const reactElement = clazz.getTeactInstance(props);
    const htmlElement = reactElement.elt ? reactElement.elt : reactElement.render();
    if (props && props.ref) {
        props.ref(reactElement);
        delete props.ref;
    }

    //reactElement.children = children;
    //reactElement.children.forEach(child => appendChild(htmlElement, child));
    reactElement.type = REACT_CLASS;
    classMap[classCounter] = reactElement;
    return htmlElement;
}

function handleHtmlElement(element, props, children) {
    const anElement = document.createElement(element);
    if (props && props.ref) {
        props.ref(anElement);
        delete props.ref;
    }

    children.forEach(child => appendChild(anElement, child));
    if (props != null) {
        const keyNames = Object.getOwnPropertyNames(props);
        for (let i = 0; i < keyNames.length; i++) {
            let keyName = keyNames[i];
            /* if (keyName.startsWith('on')) {
                keyName = keyName.toLowerCase();
            } */
            appendProp(anElement, keyName, props[keyNames[i]])
        }
    }
    return anElement;
}

function appendChild(element: any, child: any) {
    if (child == null) {
        return;
    }
    if (child.type === REACT_CLASS || is.typeof(child, System.Types.Windows.Forms.Components.TuElement)) {
        appendChild(element, child.render());
    } else if (Array.isArray(child)) {
        (child as any).forEach(ch => appendChild(element, ch));
    } else if (typeof (child) === 'object') {
        element.appendChild(child);
    } else {
        element.innerHTML += child;
    }
}

function appendProp(element, propName, propVal) {
    if (shouldAddEventListener(propName)) {
        const eName = propName.substring(2).toLowerCase();
        element.addEventListener(eName, propVal);
    } else if (propName === 'style') {
        if (typeof propVal === 'object' && propVal != null) {
            let styles: string = '';
            const keyNames = Object.getOwnPropertyNames(propVal);
            for (let i = 0; i < keyNames.length; i++) {
                styles += keyNames + ':' + propVal[keyNames[i]] + ';';
            }
            element.setAttribute(propName, styles);
        } else {
            if (propVal != null) {
                element.setAttribute(propName, propVal);
            }
        }

    }
    else {
        if (propName === 'className') {
            propName = 'class';
        }
        if (propName === 'disabled' && !propVal) {
            return;
        }
        if (propName === 'visible' && propVal === true) {
            return;
        }
        if (propName === 'readOnly' && propVal === false) {
            return;
        }
        if (propVal != null) {
            element.setAttribute(propName, propVal);
        }
    }
}



function reRender() {
    while (rootDOMElement.hasChildNodes()) {
        rootDOMElement.removeChild(rootDOMElement.lastChild);
    }
    //Skip the root. It is only rendered once.
    classCounter = 1;
    //ReactDOM.render(rootReactElement, rootDOMElement);
}

function createElement(el: any, props, ...children) {
    for (let i = 0; i < children.length; i++) {

        if (is.array(children[i]) && children[i] instanceof TComponent) {
            const result = [];
            for (let j = 0; j < children[i].length; j++) {
                result.push(children[i][j].CreateMainElement());
            }
            children[i] = result;
        } else if (children[i] instanceof TComponent) {
            children[i] = children[i].CreateMainElement();
        } else if (children[i] instanceof ComponentCollection) {
            const col: ComponentCollection<any> = children[i];
            const result = col.ToArray().map(item => {
                return item.CreateMainElement();
            });
            children[i] = result;
        } else if (is.typeof(children[i], System.Types.Collections.Enumeration.IEnumerable)) {
            const result = [];
            foreach(children[i], (item: TComponent) => {
                if (item instanceof TComponent) {
                    result.push(item.CreateMainElement());
                }
            });
            children[i] = result;
        }
    }
    return c(el, props || {}, ...children);
}

export const Teact = { createElement };



