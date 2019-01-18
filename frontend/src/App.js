import React, { Component } from 'react';
import './App.css';
import Chat from './Chat/Chat';
import Login from './Modal/Modal';


class App extends Component {
  state = {
    modal: true,
    login: ''
  }
  componentDidMount(){

  }

  toggleModal = () => {
    this.setState(prev=> ({
      modal: !prev.modal
    }))
  }

  handlerChange = (e)=> {
    this.setState({
      login: e.target.value
    })
  }
  render() {
    const {modal, login} = this.state
    return (
      <div className="App">
        {modal ? <Login modal={modal} toggleModal={this.toggleModal} handlerChange={this.handlerChange} login={login}/> : <Chat login={login}/>}
      </div>
    );
  }
}

export default App;
