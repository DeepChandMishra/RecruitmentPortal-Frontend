import React, { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import filterIcon from "../../assets/images/filter-icon.svg";
import searchIcon from "../../assets/images/search-icon.svg";
import useDebounce from '../../customHook/useDebounce';
import { useParams } from 'react-router-dom';
import { blankProfile, getSidebarTimeAgo } from '../../util/UtilFunction';
import { ActionType } from '../../redux/action-types';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomDetails } from '../../redux/actions/message';
import Loading from "../../components/loader";
import { ClipLoader } from 'react-spinners';


export default function MessageSidebar(props) {
    const { roomList, handleSendMessage, getChatRoomDetails, setReceiverData, handleSearchFun, setMessageList, landingContent } = props;
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 500);
    const [filteredRoomList, setFilteredRoomList] = useState('');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [loader, setLoader] = useState(false)


    const param = useParams();
    const dispatch = useDispatch();


    useEffect(() => {

        setFilteredRoomList(roomList);
        console.log('roomList', roomList);

        const roomDetails = async () => {
            if (param?.id) {
                let roomDetails = await roomList?.filter((me) => me.receiver?._id === param?.id);
                if (roomDetails[0]?._id) {
                    getChatRoomDetails(roomDetails[0]?._id);
                } else {
                    setMessageList([]);
                }
            }
        };

        roomDetails();
    }, [param, roomList]);

    const handleSearchBar = (e) => {
        setSearchText(e.target.value);
    };

    useEffect(() => {
        if (debouncedSearchText !== undefined) {
            handleSearchFun(debouncedSearchText);
        }
    }, [debouncedSearchText]);

    const handleRoom = (chat) => {
        console.log('chat', chat);
        console.log('chat?.receiver', chat?.receiver);


        getChatRoomDetails(chat?._id);
        setReceiverData(chat?.receiver);
        dispatch({
            type: ActionType.ROOM_ID,
            payload: chat?._id
        });
    };

    const filterUnreadMessages = async () => {
        setLoader(true);
        const detailsList = [];

        for (const room of roomList) {
            await dispatch(getRoomDetails(room._id, (res) => {
                if (res?.status && res?.data?.length > 0) {
                    detailsList.push(res.data[0]);
                }
            }));
        }

        console.log("All Room Details", detailsList);
        if (showUnreadOnly) {
            setFilteredRoomList(detailsList);
        } else {
            const unread = detailsList.filter(room => room.unreadMessageCount > 0);
            setFilteredRoomList(unread);
        }

        setShowUnreadOnly(!showUnreadOnly);
        setLoader(false);
    };

    return (
        <>
            <InputGroup className="mb-3 input-search">
                <input
                    type="search"
                    placeholder={landingContent?.message?.search}
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    onChange={handleSearchBar}
                />
                <img src={searchIcon} alt="search-icon" />
            </InputGroup>

            <div className="chat-sidebar-header">
                <div className="d-flex justify-content-between">
                    <div>
                        <h4 className='heading-col mt-2'>{landingContent?.message?.liveChatLabel}</h4>
                    </div>
                    <div>
                        <button className='border-0 bg-transparent heading-col mt-1' onClick={filterUnreadMessages}>
                            {showUnreadOnly ? "Show all" : "Show unread"}
                        </button>
                    </div>
                </div>
                {filteredRoomList.length > 0 && (
                    <p className='m-0 bg-transparent heading-col text-sm text-center'>
                        <small>{!showUnreadOnly ? "Showing All Messages" : "Showing Unread Messages"}</small>
                    </p>
                )}
            </div>

            {loader ? (
                <div className='small-loader'>
                    <ClipLoader size={30} color={"#697865"} loading={true} />
                </div>
            ) : (
                <>
                    {filteredRoomList && filteredRoomList.map((chat, index) => (
                        <div
                            className="d-flex gap-2 chat-details-wrapper align-items-center"
                            key={index}
                            onClick={() => { handleRoom(chat) }}
                        >
                            <div className='img-wrapper'>
                                <img src={chat?.receiver?.image ? chat?.receiver?.image : blankProfile()} alt="profile" />
                            </div>
                            <div className='details-wrapper'>
                                <div className="d-flex align-items-center justify-content-between details-wrapper-block">
                                    <div className="user-name-col">
                                        <h4>{`${chat.receiver.firstname} ${chat.receiver.lastname}`}</h4>
                                    </div>
                                    <div className="last-seen-col">
                                        <span>{getSidebarTimeAgo(chat?.lastMessageDate)}</span>
                                    </div>
                                </div>
                                <p className='message-col'>{chat?.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                    {filteredRoomList.length === 0 && !loader && (
                        <p className='message-col mt-3'>{landingContent?.message?.noListMessage}</p>
                    )}
                </>
            )}

        </>
    );
}