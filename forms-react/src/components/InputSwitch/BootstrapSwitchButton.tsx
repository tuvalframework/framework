
import React from 'react';
import './style.css';

export default class BootstrapSwitchButton extends React.Component<any, any> {
	constructor(props) {
		super(props);

		this.state = {
			checked: typeof this.props.checked === 'boolean' ? this.props.checked : false,
			disabled: typeof this.props.disabled === 'boolean' ? this.props.disabled : false,
			onlabel: this.props.onlabel || 'On',
			offlabel: this.props.offlabel || 'Off',
			onstyle: this.props.onstyle || 'primary',
			offstyle: this.props.offstyle || 'light',
			size: this.props.size || '',
			style: this.props.style || '',
			width: this.props.width || null,
			height: this.props.height || null,
		};
	}

	componentDidUpdate(_, prevState) {
		const { checked } = this.props;
		if (typeof checked === 'boolean' && checked !== prevState.checked) {
			this.setState({ checked });
		}
	}

	toggle = event => {
		this.state.checked ? this.off() : this.on();
	};
	off = () => {
		if (!this.state.disabled) {
			this.setState({
				checked: false,
			});
			if (this.props.onChange) this.props.onChange(false);
		}
	};
	on = () => {
		if (!this.state.disabled) {
			this.setState({
				checked: true,
			});
			if (this.props.onChange) this.props.onChange(true);
		}
	};
	enable = () => {
		this.setState({
			disabled: false,
		});
	};
	disable = () => {
		this.setState({
			disabled: true,
		});
	};

	render = () => {
		let switchStyle: any = {};
		this.state.width ? (switchStyle.width = this.state.width + 'px') : null;
		this.state.height ? (switchStyle.height = this.state.height + 'px') : null;

		let labelStyle: any = {};
		//if (this.state.height) labelStyle.lineHeight = 'calc(' + this.state.height + 'px * 0.8)';

		return (
			<div
				className={
					'switch btn ' +
					(this.state.checked ? 'on btn-' + this.state.onstyle : 'off btn-' + this.state.offstyle) +
					(this.state.size ? ' btn-' + this.state.size : '') +
					(this.state.style ? ' ' + this.state.style : '')
				}
				style={switchStyle}
				onClick={this.toggle}
			>
				<div className="switch-group">
					<label className={'switch-on btn btn-' + this.state.onstyle + (this.state.size ? ' btn-' + this.state.size : '')} style={labelStyle}>
						{this.state.onlabel}
					</label>
					<label className={'switch-off btn btn-' + this.state.offstyle + (this.state.size ? ' btn-' + this.state.size : '')} style={labelStyle}>
						{this.state.offlabel}
					</label>
					<span className={'switch-handle btn btn-light' + (this.state.size ? 'btn-' + this.state.size : '')} />
				</div>
			</div>
		);
	};
}