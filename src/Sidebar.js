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
        const sidebar = {
            width: '10%',
            backgroundColor: 'royalblue',
            position: 'absolute',
            height: '100vh',
            border: '3px solid royalblue',
            alignItems: 'center',

        };

        const sidebarMenuElement = {
            color: 'white',
            cursor: 'pointer',
            height: '60px',
            fontSize: '20px',
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '60px',


        };

        return (
            <div style={ sidebar }>
                <div style={ sidebarMenuElement }>
                    Clear Canvas
                </div>
                <div style={ sidebarMenuElement }>
                    Pencil
                </div>
                <div style={ sidebarMenuElement }>
                    Size
                </div>
                <div  style={ sidebarMenuElement } onClick={this.handleClickPicker}>
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
