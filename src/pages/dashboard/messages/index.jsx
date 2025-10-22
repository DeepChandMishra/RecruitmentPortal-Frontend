import React, { useEffect, useState } from 'react';
import { ListGroup, Badge, Button, InputGroup, FormControl } from 'react-bootstrap';
import MessageSidebar from '../../../components/chat/sidebar';
import ChatList from '../../../components/chat/chatList';
import ActionBar from '../../../components/chat/actionBar';
import { getAllRoomList, getReceiverUserDetails, getRoomDetails } from '../../../redux/actions/message';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../context/socketContext';
import blankChatImg from "../../../assets/images/ChatsCircle.svg";
import "./messages.css";
import ModalChat from '../../../components/ModalChat';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const Messages = () => {
    const [file, setFile] = useState();
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [receiverData, setReceiverData] = useState(null);
    const [roomListFilter, setRoomListFilter] = useState([]);
    const timezoneOffset = new Date().getTimezoneOffset();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')

    const userId = localStorage.getItem('userId');
    const { userDetails } = useSelector((state) => state.user);
    const { roomList, roomDetails , roomId} = useSelector((state) => state.message);
    console.log({roomId})

    const socket = useSocket();
    const params = useParams()
    const dispatch = useDispatch();
    const location = useLocation()


    useEffect(() => {
        if (roomDetails) {
            setMessageList(roomDetails[0]?.messages || []);
        }
    }, [roomDetails]);

    useEffect(() => {
        if (params.id) {
            getReceiverUserDetail(params.id)
        }
    }, [params.id])

    const getReceiverUserDetail = (user_id) => {
        let param = {
            "timezone": timezone,
            "timezoneOffset": timezoneOffset
        }
        dispatch(getReceiverUserDetails(user_id, param, (result) => {
            console.log('receiver data:', result)
            setReceiverData(result.data)
        }));
    }

    useEffect(() => {
        console.log('called called')
        setMessageList([])
    }, [])

    useEffect(() => {
        setRoomListFilter(roomList);
    }, [roomList]);

    const handleSendMessage = async (message, type) => {
        try {
            if (message || file) {
                const _data = {
                    receiverId: receiverData?._id,
                    senderId: userId,
                    message: message,
                    type: type,
                    createdAt: new Date().toISOString(),
                };
                const _dataFile = {
                    receiverId: receiverData?._id,
                    senderId: userId,
                    file: file,
                    type: "file",
                    uploadedFile: {
                        fileName: file?.name,
                        fileType: file?.type,
                    },
                    createdAt: new Date().toISOString(),
                };

                console.log('~ handleNewMessage ~ data:', _data, 'adasdasd', _dataFile)

                if (socket) {
                    socket.emit("message", file ? _dataFile : _data);
                    if (messageList.length === 0) {
                        await getChatroomList();
                    }
                    setMessageList((oldMessages) => [...oldMessages, file ? _dataFile : _data]);
                } else {
                    console.error('Socket is not initialized.');
                }
            }
            setMessage('');
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            getChatroomList();
        }
    };

    useEffect(() => {
        if (socket) {
            const handleNewMessage = (data) => {
                console.log("🚀 ~ handleNewMessage ~ data:", data, 'roomId', roomId)
                if (data?.roomId == roomId) {
                    setMessageList((oldMessages) => [...oldMessages, data]);
                }
            };
            socket.on('newMessage', handleNewMessage);
            // socket.on('newMessage', (data) => {
            //     console.log({data})
            // })
            return () => {
                socket.off('newMessage', handleNewMessage);
            };
        } else {
            console.error('Socket is not initialized.');
        }
    }, [socket]);

    const getChatRoomDetails = (id) => {
        dispatch(getRoomDetails(id));
    };

    const getChatroomList = () => {
        dispatch(getAllRoomList());
    };

    useEffect(() => {
        getChatroomList();
    }, [dispatch]);

    //Download File
    const handleDownloadFile = (downloadUrl, fileName) => {
        console.log("🚀 ~ handleDownloadFile ~ downloadUrl:", downloadUrl, fileName)

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    //Search Receiver
    const handleSearch = (searchText) => {
        const filterData = roomList?.filter((room) =>
            `${room.receiver.firstname} ${room.receiver.lastname}`.toLowerCase().includes(searchText.toLowerCase())
        );
        setRoomListFilter(filterData);
    };


    return (
        <div className="container-fluid backdrop-blur pt-2">
            <div className="offcanvas chat-list-opening offcanvas-start" tabIndex="-1" id="offcanvasChat" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <MessageSidebar roomList={roomListFilter} getChatRoomDetails={getChatRoomDetails} setReceiverData={setReceiverData} handleSearchFun={handleSearch} setMessageList={setMessageList} landingContent={landingContent}  />
                </div>
            </div>

            <div className="d-flex">
                <div className="chatlist-col py-3 px-2 border-end">
                    <MessageSidebar roomList={roomListFilter} getChatRoomDetails={getChatRoomDetails} setReceiverData={setReceiverData} handleSearchFun={handleSearch} setMessageList={setMessageList} landingContent={landingContent}  />
                </div>
                <div className="messages-col">
                    <ChatList roomDetails={messageList} userId={userId} handleSendMessage={handleSendMessage} message={message} setMessage={setMessage} receiverData={receiverData} file={file} setFile={setFile} handleDownloadFile={handleDownloadFile} landingContent={landingContent} />
                </div>
            </div>

        </div>

    );
};

export default Messages;
