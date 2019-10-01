import React from 'react'

import { SketchPicker } from 'react-color'

class Sidebar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            displayColorPicker: false,
            colorPicked: '#4284f5',
        };
    }

    handleClickPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClosePicker = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChangeColor = (color) => {
        this.setState({ colorPicked: color.hex });
        this.props.onColorPicked(color.hex);
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
                <div onClick={this.handleClickPicker}>
                    Color
                    { this.state.displayColorPicker ? <div style={ popover }>
                        <div style={ cover } onClick={ this.handleClosePicker }/>
                        <SketchPicker
                            onChangeComplete={ this.handleChangeColor }
                        />
                    </div> : null }
                </div>
            </div>
        );
    }
}


export default Sidebar;
