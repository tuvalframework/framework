import { Teact } from "./Teact";
import React  from '../../../preact/compat';

const touchX = (event) =>
  event.touches[0].clientX

const touchY = (event) =>
  event.touches[0].clientY

export class PointTarget extends React.Component {

  static defaultProps = {
    tolerance: 10
  }

  handleClick = () => {
    if (!this.usingTouch && this.props.onPoint)
      this.props.onPoint()
  }

  handleTouchStart = (event) => {
    this.usingTouch = true

    if (this.touchStarted)
      return

    this.touchStarted = true

    this.touchMoved = false
    this.startX = touchX(event)
    this.startY = touchY(event)
  }

  handleTouchMove = (event) => {
    if (!this.touchMoved) {
      const { tolerance } = this.props

      this.touchMoved = Math.abs(this.startX - touchX(event)) > tolerance ||
                        Math.abs(this.startY - touchY(event)) > tolerance
    }
  }

  handleTouchCancel = () => {
    this.touchStarted = this.touchMoved = false
    this.startX = this.startY = 0
  }

  handleTouchEnd = () => {
    this.touchStarted = false

    if (!this.touchMoved && this.props.onPoint)
      this.props.onPoint()
  }
    usingTouch: any;
    touchStarted: any;
    touchMoved: any;
    startX: number;
    startY: any;

  componentWillMount() {
    this.usingTouch = false
  }

  render() {
    const { children } = this.props

    const element = children ? React.Children.only(children) : <button/>

    return React.cloneElement(element, {
      onClick: this.handleClick,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchCancel: this.handleTouchCancel,
      onTouchEnd: this.handleTouchEnd
    })
  }
}
