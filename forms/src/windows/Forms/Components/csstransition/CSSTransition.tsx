import { Teact } from "../Teact";
import { TeactCSSTransition } from "./TeactCSSTransition";
import React, { createElement } from '../../../../preact/compat';

export  function hasClass(
    element: Element | SVGElement,
    className: string
  ) {
    if (element.classList)
      return !!className && element.classList.contains(className)

    return (
      ` ${element.className.baseVal || element.className} `.indexOf(
        ` ${className} `
      ) !== -1
    )
  }

export  function addOneClass(
    element: Element | SVGElement,
    className: string
  ) {
    if (element.classList) element.classList.add(className)
    else if (!hasClass(element, className))
      if (typeof element.className === 'string')
        (element as Element).className = `${element.className} ${className}`
      else
        element.setAttribute(
          'class',
          `${(element.className && element.className.baseVal) || ''} ${className}`
        )
  }

function replaceClassName(origClass: string, classToRemove: string) {
  return origClass
    .replace(new RegExp(`(^|\\s)${classToRemove}(?:\\s|$)`, 'g'), '$1')
    .replace(/\s+/g, ' ')
    .replace(/^\s*|\s*$/g, '')
}

/**
 * Removes a CSS class from a given element.
 *
 * @param element the element
 * @param className the CSS class name
 */
export function removeOneClass(
  element: Element | SVGElement,
  className: string
) {
  if (element.classList) {
    element.classList.remove(className)
  } else if (typeof element.className === 'string') {
    (element as Element).className = replaceClassName(
      element.className,
      className
    )
  } else {
    element.setAttribute(
      'class',
      replaceClassName(
        (element.className && element.className.baseVal) || '',
        className
      )
    )
  }
}

export const addClass = (node, classes) =>
  node && classes && classes.split(' ').forEach((c) => addOneClass(node, c));
export const removeClass = (node, classes) =>
  node && classes && classes.split(' ').forEach((c) => removeOneClass(node, c));

export class CSSTransition extends React.Component {

    constructor(props) {
        super(props);

        this.onEnter = this.onEnter.bind(this);
        this.onEntering = this.onEntering.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    onEnter(node, isAppearing) {
        this.props.onEnter && this.props.onEnter(node, isAppearing); // component
        this.props.options && this.props.options.onEnter && this.props.options.onEnter(node, isAppearing); // user option
    }

    onEntering(node, isAppearing) {
        this.props.onEntering && this.props.onEntering(node, isAppearing); // component
        this.props.options && this.props.options.onEntering && this.props.options.onEntering(node, isAppearing); // user option
    }

    onEntered(node, isAppearing) {
        this.props.onEntered && this.props.onEntered(node, isAppearing); // component
        this.props.options && this.props.options.onEntered && this.props.options.onEntered(node, isAppearing); // user option
    }

    onExit(node) {
        this.props.onExit && this.props.onExit(node); // component
        this.props.options && this.props.options.onExit && this.props.options.onExit(node); // user option
    }

    onExiting(node) {
        this.props.onExiting && this.props.onExiting(node); // component
        this.props.options && this.props.options.onExiting && this.props.options.onExiting(node); // user option
    }

    onExited(node) {
        this.props.onExited && this.props.onExited(node); // component
        this.props.options && this.props.options.onExited && this.props.options.onExited(node); // user option
    }

    public static getTeactInstance(props: any) {
        return new CSSTransition(props);
    }
    render() {
        const immutableProps = { nodeRef: this.props.nodeRef, in: this.props.in, onEnter: this.onEnter, onEntering: this.onEntering, onEntered: this.onEntered, onExit: this.onExit, onExiting: this.onExiting, onExited: this.onExited };
        const mutableProps = { classNames: this.props.classNames, timeout: this.props.timeout, unmountOnExit: this.props.unmountOnExit };
        const props = { ...mutableProps, ...(this.props.options || {}), ...immutableProps };

        return (
            <TeactCSSTransition {...props}>
                {this.props.children}
            </TeactCSSTransition>
        )
    }
}