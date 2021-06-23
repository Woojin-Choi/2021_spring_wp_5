import {Button, TextField} from "@material-ui/core";
import React, {useEffect} from "react";

export default function LoginPanel(props) {

    const messagesLog = []
    const loadChatBox = []

    const handleChange = ({ target: { value } }) => props.setMyChat({id : props.user, chat : value, date : new Date()});

    const addMessages = (e) => {
        e.preventDefault();
        if (props.user) {
            props.db.collection("allChatLog").add(props.myChat)
            props.db.collection("allChatLog").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        messagesLog.push(doc.data())
                    })
                    messagesLog.slice(0).sort(function(a,b) {
                        return a.date < b.date ? 1 : a.date > b.date ? -1: 0;
                    }).map(elem => loadChatBox.push(elem.chat))
                    props.setMessages(loadChatBox)
                })
        } else {
            alert("로그인 이후 사용가능합니다")
        }
    }

    const loadMessages = () => {
        props.db.collection("allChatLog").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    messagesLog.push(doc.data())
                })
                messagesLog.slice(0).sort(function(a,b) {
                    return a.date < b.date ? -1 : a.date > b.date ? 1: 0;
                }).map(elem => loadChatBox.push(elem.chat))
                props.setMessages(loadChatBox)
            })
    }

    useEffect(() => {
        const intervalControl = setInterval(() => {loadMessages()}, 5000)
        return () => clearInterval(intervalControl);
    }, [props.messages]);


    return(
        <div id={"cheerChat"}>
            <div>
                <h2>전국민 응원 한마디!</h2>
            </div>
            <form id="chatForm" onSubmit={addMessages}>
                <TextField id="inputMessage" name="chat-message" type="text" variant="outlined" onChange={handleChange}/>
                {console.log(props.myChat)}
                <Button id="inputBtn" type="submit" variant={"outlined"}>입력</Button>
            </form>
            <div id={"chatBox"}>
                {props.messages.map(elem => {
                    return (<div> {elem} </div>)
                })}
            </div>
        </div>
    )

}