import React, { useState, useEffect } from "react";
// import { ChatContext } from "../Context/context";
import {
  createLightNode,
  bytesToUtf8,
  utf8ToBytes,
  waitForRemotePeer,
  createDecoder,
  createEncoder,
} from "https://unpkg.com/@waku/sdk@0.0.18/bundle/index.js";
// import { useFilterMessages, useStoreMessages } from "@waku/react";
import protobuf from "protobufjs";



const ChatBox = ({ chat }) => {


  console.log("name = ", chat);
  const [status, setStatus] = useState("connecting...");
  const [localPeerId, setLocalPeerId] = useState("");
  const [remotePeerIds, setRemotePeerIds] = useState([]);
  const [contentTopic, setContentTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageObj, setMessageObj] = useState({});
  const [nodeD, setNode] = useState()
  const [decoderD, setDecoderD] = useState()
  const [nick, setNick] = useState("");
  const [messageText, setMessageText] = useState("");
  const CONTENT_TOPIC = `/toy-chat/1/${chat}/proto`;
  let sendMessageFunc = null;
  useEffect(() => {
    // Your initialization logic here
    setMessageObj(fetchData());
    // You can call functions such as initUI and runApp here
  }, []);
  async function fetchData() {
    try {
      const context = await initWakuContext({
        contentTopic: CONTENT_TOPIC,
        onMessageReceived: messages
      });
      setMessageObj(context);
      sendMessageFunc = context;
      setStatus("Connected");
      setLocalPeerId(context.info.localPeerId1);
      setRemotePeerIds(context.info.remotePeerIds1);
      setContentTopic(context.info.contentTopic);
      return context;
    } catch (error) {
      console.error("Error initializing Waku context:", error);
      setStatus(`Error: ${error.message}`);
    }
  }



  console.log("Node and Decoder = ", decoderD, nodeD);
  // const { messages: storeMessages } = useStoreMessages({ nodeD, decoderD });

  // Receive messages from Filter subscription
  // const { messages: filterMessages } = useFilterMessages({ nodeD, decoderD });

  
  // useEffect(() => {

  //   const allMessages = storeMessages.concat(filterMessages);
  //   console.log("aLL MSG = ", allMessages);

  //   setMessages(allMessages.map((wakuMessage) => {
  //     if (!wakuMessage.payload) return;
  //     return ChatMessage.decode(wakuMessage.payload);
  //   }));

  // }, [filterMessages, storeMessages, chat])




  console.log("messageObj ==> ", messageObj);
  async function initWakuContext({ contentTopic, onMessageReceived }) {
    console.log("init is running = ", contentTopic);
    const Decoder = createDecoder(contentTopic);
    setDecoderD(Decoder);
    const Encoder = createEncoder({ contentTopic }); // Pass contentTopic here
    const ChatMessage = new protobuf.Type("ChatApp")
      .add(new protobuf.Field("timestamp", 1, "uint64"))
      .add(new protobuf.Field("nick", 2, "string"))
      .add(new protobuf.Field("text", 3, "bytes"));
    const node = await createLightNode({ defaultBootstrap: true });
    console.log("node = ", node);
    setNode(node);
    await node.start();
    await waitForRemotePeer(node);
    // Set a filter by using Decoder for a given ContentTopic
    const unsubscribeFromMessages = await node.filter.subscribe(
      [Decoder],
      (wakuMessage) => {
        const messageObj = ChatMessage.decode(wakuMessage.payload);
        console.log("=-=-=-=-=-=-==-=", messageObj);


    




        const timestamp = new Date(messageObj.timestamp).toLocaleString();
        const text = bytesToUtf8(messageObj.text);
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some((msg) =>
            msg.nick === messageObj.nick && msg.text === text && msg.timestamp === timestamp
          );
          if (!messageExists) {
            // Message is unique, add to the array
            return [...prevMessages, { nick: messageObj.nick, text, timestamp }];
          }
          return prevMessages;
        });
      }
    );


    const localPeerId1 = node.libp2p.peerId.toString();
    console.log("local peer = ", localPeerId1);
    const remotePeers1 = await node.libp2p.peerStore.all();
    const remotePeerIds1 = remotePeers1.map((peer) => peer.id.toString());
    return {
      unsubscribeFromMessages,
      info: {
        localPeerId1,
        remotePeers1,
        remotePeerIds1,
        contentTopic,
      },
      sendMessage: async ({ messageText, nick }) => {
        if (!messageText || !nick) {
          return;
        }
        const protoMessage = ChatMessage.create({
          nick,
          timestamp: Date.now(),
          text: utf8ToBytes(messageText),
        });
        await node.lightPush.send(Encoder, {
          payload: ChatMessage.encode(protoMessage).finish(),
        });
      },
    };
  }
  const sendMessage = () => {
    if (!messageObj) {
      console.error("Waku context not initialized");
      return;
    }
    if (!nick || !messageText) {
      console.error("Nickname or message text cannot be empty");
      return;
    }
    messageObj.sendMessage({ messageText: messageText, nick: nick });
    setMessageText(""); // Clear the message text input after sending
  };
  const exitChat = () => {
    // Your exit chat logic here
  };
  //   const { name } = useContext(ChatContext);
  return (
    <div className="content">
      <div className="header">
        <h3>
          Status:
          <span id="status">{status}</span>
        </h3>
        <details>
          <summary>Peer's information</summary>
          <h4>Content topic</h4>
          <p id="contentTopic">{contentTopic}</p>
          <h4>Local Peer Id</h4>
          <p id="localPeerId">{localPeerId}</p>
          <h4>Remote Peer Id</h4>
          <p id="remotePeerId">{remotePeerIds.join("\n")}</p>
        </details>
      </div>
      <div id="messages">
        chats :
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.nick}: </strong> {message.text}  <em>({message.timestamp})</em>
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="inputArea">
          <input
            type="text"
            id="nickText"
            placeholder="Nickname"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <textarea
            id="messageText"
            placeholder="Message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          ></textarea>
        </div>
        <div className="controls">
          <button id="send" onClick={sendMessage}>
            Send
          </button>
          <button
            id="exit"
          // onClick={exitChat}
          >
            Exit chat
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatBox;