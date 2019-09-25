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
            <Menu.Item as='a'>
                <Icon name='paint brush' />
                Pencil
            </Menu.Item>
            <Menu.Item as='a'>
                <Icon name='circle' />
                Size
            </Menu.Item>
            <Menu.Item as='a'>
                <Icon name='tint' />
                Color
            </Menu.Item>
        </Sidebar>

)

export default SidebarDrawing;
