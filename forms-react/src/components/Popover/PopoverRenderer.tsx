import { css } from '@emotion/css';
import * as Popover from '@radix-ui/react-popover';

import React, { Fragment } from "react";
import { PopoverClass } from "./PopoverClass";
import './styles.css';

export interface IControlProperties {
    control: PopoverClass
}



function PopoverRenderer({ control }: IControlProperties) {



    const WrapperComponent = () => {
        return (
            <Fragment>
                {control.vp_View.render()}
            </Fragment>
        )
    }

    return (

        <Popover.Root>
            <Popover.Trigger asChild>
                <div>
                    <WrapperComponent></WrapperComponent>
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="PopoverContent" sideOffset={5}>
                    <Fragment>
                        {
                            control.vp_Children.map(view => <Fragment>{view.render()}</Fragment>)
                        }
                    </Fragment>
                    <Popover.Arrow className='PopoverArrow ' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>

    )

}

export default PopoverRenderer;