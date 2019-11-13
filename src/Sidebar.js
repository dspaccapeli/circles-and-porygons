// Import React components
import React from 'react'
// Import a Color Picker implementation
import { TwitterPicker } from 'react-color'
// Adding css styling
import './Sidebar.css';
// Import a Slider implementation
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Sidebar extends React.Component {
    constructor(props){
        super(props);
        // Initialize React state - they trigger re-rendering
        this.state = {
            displayColorPicker: false,
            colorPicked: '#4284f5',
            width: 5,
        };
    }

    // Setup event handlers
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
        // Initialize inline styling to change dynamically the picker color
        const smallColoredSquare = {
            width: '14px',
            height: '14px',
            borderRadius: '2px',
            background: this.state.colorPicked,
        };

        // Render the sidebar element by element
        return (
            <div className="sidebar" >
                <button
                    className="sidebar-menu-element btn-secondary"
                    onClick={() => this.props.onClearCanvas()}
                    variant="light"
                >
                    Clear Canvas
                </button>
                <div className="sidebar-menu-element picker-text-style row">
                    <p>Color</p>
                    <div
                        className="square-container"
                        onClick={this.handleClickPicker}
                    >
                        <div style={ smallColoredSquare } />
                    </div>
                    { this.state.displayColorPicker ? <div className="popover">
                        <div className="cover" onClick={ this.handleClosePicker }/>
                        <TwitterPicker
                            onChangeComplete={ this.handleChangeColor }
                        />
                    </div> : null }
                </div>
                <div className="sidebar-menu-element picker-text-style">
                    <p>Width</p>
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
                <button
                    className="sidebar-menu-element btn-danger"
                    onClick={() => this.props.onToggleHandDrawing()}
                    disabled={this.props.onModelLoading() == "loading..."}
                >
                    { this.props.onModelLoading() ? <div dangerouslySetInnerHTML={{__html: this.props.onModelLoading()}}/> : <div> Hand Drawing </div> }
                </button>
            </div>
        );
    }
}


export default Sidebar;
