import React from 'react'
import { Icon, Menu, Sidebar } from 'semantic-ui-react'

const SidebarDrawing = () => (
        <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            vertical
            visible
            width='thin'
        >

            <Menu.Item as='a' id={"clear_canvas_button"}>
                <Icon name='refresh' />
                Clear canvas
            </Menu.Item>
            <Menu.Item as='a' id={"pencil_type_button"}>
                <Icon name='paint brush' />
                Pencil
            </Menu.Item>
            <Menu.Item as='a' id={"pencil_size_button"}>
                <Icon name='circle' />
                Size
            </Menu.Item>
            <Menu.Item as='a' id={"pencil_color_button"}>
                <Icon name='tint' />
                Color
            </Menu.Item>
        </Sidebar>

)

export default SidebarDrawing;
