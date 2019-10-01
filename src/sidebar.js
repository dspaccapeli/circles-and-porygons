import React from 'react'

import { SketchPicker } from 'react-color'

class SidebarDrawing extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            displayColorPicker: false,
        };
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    render() {
        const popover = {
            position: 'absolute',
        };
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        };

        return (
            <div>
                <div>
                    Pencil
                </div>
                <div>
                    Size
                </div>
                <div onClick={this.handleClick}>
                    Color
                    { this.state.displayColorPicker ? <div style={ popover }>
                        <div style={ cover } onClick={ this.handleClose }/>
                        <SketchPicker />
                    </div> : null }
                </div>
            </div>
        );
    }
}


export default SidebarDrawing;
