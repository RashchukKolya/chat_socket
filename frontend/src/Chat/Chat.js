import React, { Component } from 'react';
import { Container, MessageHeader, Segment, Comment, Input, Button, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import socket from "socket.io-client";
import uuid from 'uuid/v4';
// import axios from "axios";
window.socket = socket(window.location.origin, {
    path: "/chat/"
}, {transports: ['websocket']}
);

class Chat extends Component {
    state = {
        online: 1,
        input:'',
        messages:[],
        newMessage: true,
        editMessage: {}
    }

    componentDidMount(){
        // axios.get('http://localhost:3003/')
        //     .then( data => this.setState({messages: data.data}))
        //     .catch( err => console.log(err))
        window.socket.on("all-messages", (docs) => {
            this.setState({
                messages: docs
            })
        })
        window.socket.on('messageWasDeleted', messageId =>
        this.setState(prev => ({
            messages: prev.messages.filter(el=> el.frontId !== messageId)
        }))
        )

        window.socket.on("message-was-edited", (editMess) => {
            this.setState(prev =>({
                messages: prev.messages.map(el => el.frontId === editMess.frontId ? editMess : el)
            }))
        });

        window.socket.on("change-online", (online) => {
            this.setState({
                online: online
            })
        })
        window.socket.on("all-masseges", (data) => {
            this.setState({
                messages: data.data
            })
        })
        window.socket.on("new-message", (message) => {
            // this.props.getMessage(message);
            this.setState (prev => ({
                messages: [...prev.messages, message],
            }))
        });
    }
    

    handlerChange=(e)=>{
      this.setState({
          input:e.target.value
      })
    }

    recMessage=()=>{
        if(this.state.newMessage){
        let content = {
            time: moment().format('LTS'),
            message:this.state.input,
            author: this.props.login,
            frontId: uuid()
        }
        this.setState(prev =>({
            messages:[...prev.messages,content],
            input: '',
        }))
        window.socket.emit("message", content);        
        } else {
            let editMess = {...this.state.editMessage, message: this.state.input}
            // console.log(mess)
            this.setState(prev =>({
                messages: prev.messages.map(el => el.frontId === editMess.frontId ? editMess : el),
                newMessage: true,
                editMessage: {},
                input: ''
            }))
            window.socket.emit("editMessage", editMess.frontId, editMess);    
        }
}
    deleteMessage=(e) => {
        let messageId = e.target.id;
        // console.log(messageId);
        window.socket.emit('deleteMessage', messageId);
        this.setState(prev => ({
            messages: prev.messages.filter(el=> el.frontId !== messageId)
        }))
    }

    editMessage = (e) => {
        let id = e.target.id
        console.log(id)
        let message = this.state.messages.find(el => el.frontId === id)
        console.log(message)
        this.setState({
            input: message.message,
            newMessage: false,
            editMessage: message,
        })
    }


  render() {
      const {messages}= this.state;
    return (
      <div className='container'>
        <Container fluid>

        <MessageHeader/>
           <Segment>

           <Segment clearing>
                <Header 
                fluid='true'
                as='h2'
                floated='left'
                style={{
                    marginBottom: 0
                }}>
                <Header.Subheader>
                    Our Chat / Online Users: {this.state.online}
                </Header.Subheader>
                </Header>
            </Segment>

             <Comment.Group className='messages'>
             {messages.map( el =>
                 <Comment key={el.frontId}>
                 <Comment.Avatar/>
                 <Comment.Content>
                     <Comment.Author as='a'>
                         {el.author}
                     </Comment.Author>
                     <Comment.Metadata>
                        {el.time}
                     </Comment.Metadata>
                <Comment.Text>{el.message}</Comment.Text>
                {this.props.login=== el.author?
                <Comment.Actions>
                    <Comment.Action id={el.frontId} onClick={this.deleteMessage}><Icon id={el.frontId} name='delete'/>Delete</Comment.Action>
                    <Comment.Action id={el.frontId} onClick={this.editMessage}><Icon id={el.frontId} name='edit'/>Edit</Comment.Action>
                </Comment.Actions> : null}
                </Comment.Content>
                </Comment>)}

             </Comment.Group>
           </Segment>


           <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    style={{
                        marginBottom: '.7rem'
                    }}
                    label={<Button icon='add'/>}
                    labelPosition='left'
                    placeholder='Write your message'
                    onChange={this.handlerChange}
                    value={this.state.input}
                   />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.recMessage} />
                </Button.Group>
            </Segment>
        </Container>
      </div>
    )
  }
}

export default Chat
