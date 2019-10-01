import React from 'react'
import { Icon, Menu, Sidebar } from 'semantic-ui-react'

import { SketchPicker } from 'react-color'

class SidebarDrawing extends React.Component {

    render() {
        return (
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                visible
                width='thin'
            >
                <Menu.Item as='a'>
                    <Icon name='paint brush'/>
                    Pencil
                    <SketchPicker/>
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='circle'/>
                    Size
                </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='tint'/>
                    Color
                </Menu.Item>
            </Sidebar>
        );
    }
}

export default SidebarDrawing;
