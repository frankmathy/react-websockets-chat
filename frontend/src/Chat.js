import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const url = 'ws://localhost:3030'

class Chat extends Component {
    state = {
        name: 'Bob',
        messages: []
    }

    ws = new WebSocket(url)

    componentDidMount() {
        this.ws.onopen = () => {
            console.log("Connected to WebSocket server")
        }
        this.ws.onmessage = evt => {
            const message = JSON.parse(evt.data)
            this.addMessage(message)
        }
        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket server, reconnecting...')
            this.setState({
                ws: new WebSocket(url)
            })
        }
    }

    addMessage = message => {
        this.setState(state => ({ messages: [ message, ...state.messages ]}))
    }

    submitMessage = messageString => {
        const message = {
            name: this.state.name,
            message: messageString
        }
        this.ws.send(JSON.stringify(message))
        this.addMessage(message)
    }

    render() {
        return (
            <div>
                <label htmlFor="name">Name: &nbsp;</label>
                <input type="text" id={'name'} placeHolder={'Enter your name...'} value={this.state.name} onChange={ e => this.setState( { name: e.target.value} )}/>
                <ChatInput ws={this.ws} onSubmitMessage={ messageString => this.submitMessage(messageString) }/>
                {
                    this.state.messages.map((message, index) => 
                        <ChatMessage key={index} message={message.message} name={message.name}/>
                    )
                }
            </div>
        )
    }
}

export default Chat
