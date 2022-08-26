import { Teact } from "../Teact";
import React, { createElement } from '../../../../preact/compat';
import TransitionGroupContext from "./TransitionGroupContext";
export const UNMOUNTED = 'unmounted';
export const EXITED = 'exited';
export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';


export class Transition extends React.Component {
  static contextType = React.createContext(null);

  public static defaultProps = {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,

    onEnter: noop,
    onEntering: noop,
    onEntered: noop,

    onExit: noop,
    onExiting: noop,
    onExited: noop,
  };
  appearStatus: any;
  nextCallback: any;

  constructor(props, context) {
    super(props, context);

    let parentGroup = context;
    // In the context of a TransitionGroup all enters are really appears
    let appear =
      parentGroup && !parentGroup.isMounting ? props.enter : props.appear;

    let initialStatus;

    this.appearStatus = null;

    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }

    this.state = { status: initialStatus };

    this.nextCallback = null;
  }

  static getDerivedStateFromProps({ in: nextIn }, prevState) {
    if (nextIn && prevState.status === UNMOUNTED) {
      return { status: EXITED };
    }
    return null;
  }


  componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  }

  componentDidUpdate(prevProps) {
    let nextStatus: any = null;
    if (prevProps !== this.props) {
      const { status } = this.state;

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }
    this.updateStatus(false, nextStatus);
  }

  componentWillUnmount() {
    this.cancelNextCallback();
  }

  getTimeouts() {
    const { timeout } = this.props;
    let exit, enter, appear;

    exit = enter = appear = timeout;

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit;
      enter = timeout.enter;
      // TODO: remove fallback for next major
      appear = timeout.appear !== undefined ? timeout.appear : enter;
    }
    return { exit, enter, appear };
  }

  updateStatus(mounting = false, nextStatus) {
    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback();

      if (nextStatus === ENTERING) {
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({ status: UNMOUNTED });
    }
  }

  performEnter(mounting) {
    const { enter } = this.props;
    const appearing = this.context ? this.context.isMounting : mounting;
    const [maybeNode, maybeAppearing] = this.props.nodeRef
      ? [appearing]
      : [React.findDOMNode(this), appearing];

    const timeouts = this.getTimeouts();
    const enterTimeout = appearing ? timeouts.appear : timeouts.enter;
    // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set
    if ((!mounting && !enter) || false/* config.disabled */) {
      this.safeSetState({ status: ENTERED }, () => {
        this.props.onEntered(maybeNode);
      });
      return;
    }

    this.props.onEnter(maybeNode, maybeAppearing);

    this.safeSetState({ status: ENTERING }, () => {
      this.props.onEntering(maybeNode, maybeAppearing);

      this.onTransitionEnd(enterTimeout, () => {
        this.safeSetState({ status: ENTERED }, () => {
          this.props.onEntered(maybeNode, maybeAppearing);
        });
      });
    });
  }

  performExit() {
    const { exit } = this.props;
    const timeouts = this.getTimeouts();
    const maybeNode = this.props.nodeRef
      ? undefined
      : React.findDOMNode(this);

    // no exit animation skip right to EXITED
    if (!exit || false/* config.disabled */) {
      this.safeSetState({ status: EXITED }, () => {
        this.props.onExited(maybeNode);
      });
      return;
    }

    this.props.onExit(maybeNode);

    this.safeSetState({ status: EXITING }, () => {
      this.props.onExiting(maybeNode);

      this.onTransitionEnd(timeouts.exit, () => {
        this.safeSetState({ status: EXITED }, () => {
          this.props.onExited(maybeNode);
        });
      });
    });
  }

  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  }

  safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback);
    this.setState(nextState , callback );
  }

  setNextCallback(callback) {
    let active = true;

    this.nextCallback = (event) => {
      if (active) {
        active = false;
        this.nextCallback = null;

        callback(event);
      }
    };

    this.nextCallback.cancel = () => {
      active = false;
    };

    return this.nextCallback;
  }

  onTransitionEnd(timeout, handler) {
    this.setNextCallback(handler);
    const node = this.props.nodeRef
      ? this.props.nodeRef.current
      : React.findDOMNode(this);

    const doesNotHaveTimeoutOrListener =
      timeout == null && !this.props.addEndListener;
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }

    if (this.props.addEndListener) {
      const [maybeNode, maybeNextCallback] = this.props.nodeRef
        ? [this.nextCallback]
        : [node, this.nextCallback];
      this.props.addEndListener(maybeNode, maybeNextCallback);
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  }

  public static getTeactInstance(props: any) {
    return new Transition(props, null);
  }

  render() {
    const status = this.state.status;

    if (status === UNMOUNTED) {
      return null;
    }

    const {
      children,
      // filter props for `Transition`
      in: _in,
      mountOnEnter: _mountOnEnter,
      unmountOnExit: _unmountOnExit,
      appear: _appear,
      enter: _enter,
      exit: _exit,
      timeout: _timeout,
      addEndListener: _addEndListener,
      onEnter: _onEnter,
      onEntering: _onEntering,
      onEntered: _onEntered,
      onExit: _onExit,
      onExiting: _onExiting,
      onExited: _onExited,
      nodeRef: _nodeRef,
      ...childProps
    } = this.props;

    return (
      // allows for nested Transitions
      <TransitionGroupContext.Provider value={null}>
      {typeof children === 'function'
        ? children(status, childProps)
        : React.cloneElement(React.Children.only(children), childProps)}
    </TransitionGroupContext.Provider>
    );
  }
}

function noop() { }


