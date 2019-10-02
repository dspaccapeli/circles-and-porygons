import React from 'react'
import { SketchPicker, BlockPicker } from 'react-color'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Sidebar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            displayColorPicker: false,
            colorPicked: '#4284f5',
            value: 5,
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

    handleChange = (value) => {
        this.setState({ value: value })
        this.props.onStrokePicked(value);
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

        const patata = {
            //backgroundColor:'blue',
            zIndex: 0,
        };

        const { value } = this.state

        return (
            <div style={ sidebar }>
                <div style={ sidebarMenuElement }>
                    Clear Canvas
                </div>
                <div className='slider orientation-reversed' style={ patata }>
                    <div className='slider-group'>
                        <div className='slider-vertical'>
                            <Slider
                                min={1}
                                max={20}
                                value={value}
                                orientation='vertical'
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div  style={ sidebarMenuElement } onClick={this.handleClickPicker}>
                    Color
                    { this.state.displayColorPicker ? <div style={ popover }>
                        <div style={ cover } onClick={ this.handleClosePicker }/>
                        <BlockPicker
                            onChangeComplete={ this.handleChangeColor }
                        />
                    </div> : null }
                </div>
            </div>
        );
    }
}


export default Sidebar;
