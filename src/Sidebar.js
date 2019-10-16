import React from 'react'
import { BlockPicker } from 'react-color'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Sidebar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            displayColorPicker: false,
            colorPicked: '#4284f5',
            width: 5,
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

    handleChangeWidth = (width) => {
        this.setState({ width: width });
        this.props.onStrokePicked(width);
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
            cursor: 'pointer',
            height: '60px',
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '60px',
        };

        return (
            <div style={ sidebar }>
                <div className="sidebarItemMenu"
                    style={ sidebarMenuElement }
                    onClick={() => this.props.onClearCanvas()}
                >
                    Clear
                </div>
                <div className="sidebarItemMenu"
                    style={ sidebarMenuElement }
                    onClick={() => this.props.onToggleHandDrawing()}
                >
                    HandsDraw
                </div>
                <div className='slider orientation-reversed'>
                    <div className='slider-group'>
                        <div className='slider-vertical'>
                            <Slider
                                min={1}
                                max={20}
                                value={this.state.width}
                                orientation='vertical'
                                onChange={this.handleChangeWidth}
                            />
                        </div>
                    </div>
                </div>
                <div className="sidebarItemMenu"
                     style={ sidebarMenuElement }
                     onClick={this.handleClickPicker}
                >
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
