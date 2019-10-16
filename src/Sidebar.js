import React from 'react'
import { TwitterPicker } from 'react-color'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import Button from 'react-bootstrap/Button';

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
            width: '15%',
            backgroundColor: 'royalblue',
            position: 'absolute',
            height: '100vh',
            border: '3px solid royalblue',
            alignItems: 'center',
            display: 'grid',
            paddingRight: '20px',
            paddingLeft: '20px',
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
        };

        const sidebarMenuElement = {
            cursor: 'pointer',
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '40px',
            gridRowGap: '5px'
        };

        const smallColoredSquare = {
            width: '14px',
            height: '14px',
            borderRadius: '2px',
            background: this.state.colorPicked,
        };

        const squareContainer = {
            padding: '2px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
            marginLeft: '10px'
        };

        return (
            <div style={ sidebar }>
                <Button
                    style={ sidebarMenuElement }
                    onClick={() => this.props.onClearCanvas()}
                    variant="light"
                >
                    Clear Canvas
                </Button>
                <div style={ Object.assign({}, sidebarMenuElement, {color: 'white'})}>
                    Color
                    <div
                        style={ squareContainer }
                        onClick={this.handleClickPicker}
                    >
                        <div style={ smallColoredSquare } />
                    </div>
                    { this.state.displayColorPicker ? <div style={ popover }>
                        <div style={ cover } onClick={ this.handleClosePicker }/>
                        <TwitterPicker
                            onChangeComplete={ this.handleChangeColor }
                        />
                    </div> : null }
                </div>
                <div style={ Object.assign({}, sidebarMenuElement, {color: 'white'}) }>
                    Width
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
                <Button
                    style={ sidebarMenuElement }
                    onClick={() => this.props.onToggleHandDrawing()}
                    disabled={this.props.onModelLoading() == "loading..."}
                >
                    { this.props.onModelLoading() ? <div dangerouslySetInnerHTML={{__html: this.props.onModelLoading()}}/> : <div> Hand Drawing </div> }
                    {/* this.props.onModelWorking ? <div dangerouslySetInnerHTML={{__html: this.props.onModelWorking}}/> : null */}
                </Button>
            </div>
        );
    }
}


export default Sidebar;
