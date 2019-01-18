import React from 'react';
import { Button, Header, Image, Modal, Form } from 'semantic-ui-react';

const Login = ({toggleModal, modal, handlerChange, login}) => {
    return (
        <Modal open={modal}>
            <Modal.Content image>
            <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
            <Modal.Description>
                <Header>Chat</Header>
                <p>Для входа введите свое имя</p>
            </Modal.Description>
            <Form success>
                <Form.Input value={login} placeholder='Enter your login' onChange={handlerChange}/>
                <Button onClick={toggleModal}>Submit</Button>
            </Form>
            </Modal.Content>
        </Modal>
    );
};

export default Login;