import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { EventsByDate, cancelMeeting, createMeeting, updateMeeting, getAllUsers, getMeetingEvents, getMeetingEventsList, getUpcomingOrPastEvent } from "../../redux/actions/meeting";
import { getAllRoomList } from "../../redux/actions/message";
import Select from "react-select";
import { toast } from "react-toastify";
import { saveAs } from "file-saver"; // Import file-saver for downloading files
import Loading from "../../components/loader";
import userIcon from '../../assets/images/candidate-profile-3.png';
import calenderIcon from '../../assets/images/CalendarBlank.svg';
import copyIcon from '../../assets/images/copyIcon.svg';
import meetingIcon from '../../assets/images/video-call.svg';
import { useTranslation } from "react-i18next";
import { getCalenderEventTimeZone, getCalenderEventwithTimeZone } from "../../util/UtilFunction";
import { useLocation } from "react-router-dom";
import FeedbackModal from "../../components/FeedbackModal";


moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function EmployerCalendar() {
    const [eventsData, setEventsData] = useState([]);
    const [loader, setLoader] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [page, setPage] = useState(1);  // To track pagination
    const [hasMoreUsers, setHasMoreUsers] = useState(true);  // Check if there are more users to load
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("Todays")
    const [pageSize, setPageSize] = useState(5)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [members, setMembers] = useState(null);
    const [hostId, setHostId] = useState(null);

    const { t, i18n } = useTranslation();
    const landingContent = t('landingPage')
    console.log('landingContent', landingContent)

    // Redux State
    const { userList } = useSelector((state) => state.user);
    const { userDetails } = useSelector((state) => state.user);
    const { roomList } = useSelector((state) => state.message);
    const { meetingEvents, meetingUpcommingandPast, meetingEventsByDate, meetingEventsList } = useSelector((state) => state.meeting);
    console.log("🚀 ~ EmployerCalendar ~feedback meetingUpcommingandPast:", meetingUpcommingandPast)
    console.log("🚀 ~ EmployerCalendar ~ meetingEvents:", meetingEvents, 'activeTab', activeTab, 'meetingEventsByDate', meetingEventsByDate)
    console.log("🚀 ~ EmployerCalendar ~ meetingEventsList:", meetingEventsList

    )

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId') || userDetails?._id;
    const handleClose = () => setShowModal(false);

    const location = useLocation();
    const { selectedMember } = location.state || {};
    console.log("🚀 ~ EmployerCalendar ~ selectedMember:", selectedMember)

    const handleSelect = ({ start, end }) => {
        const currentDate = new Date();
        const startDateOnly = new Date(start).setHours(0, 0, 0, 0);
        const currentDateOnly = new Date(currentDate).setHours(0, 0, 0, 0);
        const currentTime = moment().format("HH:mm A"); // Get current time in HH:mm A format
        console.log('called', currentTime)
        if (startDateOnly < currentDateOnly) {
            toast.error("You cannot select past dates.");
        } else {
            setSelectedEvent({
                title: "",
                start,
                end,
                time: "12:00 AM",
                members: selectedMember?.id ? [selectedMember.id] : [], // ✅ default to selectedMember 
                meetLink: "",
                notes: "",
                type: "Interview Schedule"
            });

            // Show modal only if the user is an employer
            if (userDetails?.role === 'employer') {
                setShowModal(true);
            } else {
                toast.error("Only employers can create meetings.");
            }
        }
    };

    const getRoomListOptions = () => {
        return userList?.docs?.map(user => ({
            value: user?._id,
            label: `${user?.firstname} ${user?.lastname}`
        })) || [];
    };

    const selectedMembersOptions = getRoomListOptions().filter(option =>
        (selectedEvent?.members || []).includes(option.value)
    );

    //Get All User List 
    const getAllUserList = (pageNumber = 1) => {
        setLoader(true);
        let param = {
            sortBy: -1,
            limit: 500,
            page: pageNumber,
        };

        dispatch(
            getAllUsers(param, (result) => {
                if (result.status) {
                    setLoader(false);
                    if (result.data.docs.length > 0) {
                        // Append new users to the list
                        setAllUsers(prevUsers => [...prevUsers, ...result.data.docs]);
                        setPage(pageNumber);  // Update the page number
                        setHasMoreUsers(result.data.hasNextPage);  // Check if more users are available
                    } else {
                        setHasMoreUsers(false);  // No more users to load
                    }
                } else {
                    setLoader(false);
                    setHasMoreUsers(false);
                    toast.error("Failed to fetch users.");
                }
            })
        );
    };


    useEffect(() => {
        getAllUserList()
    }, [])

    const handleSaveEvent = async () => {
        // Check if all required fields are filled
        console.log("🚀 ~ handleSaveEvent ~ selectedEvent:", selectedEvent.title)
        console.log("🚀 ~ handleSaveEvent ~ selectedEvent:", selectedEvent.time)
        console.log("🚀 ~ handleSaveEvent ~ selectedEvent:", selectedEvent.members)
        console.log("🚀 ~ handleSaveEvent ~ selectedEvent:", selectedEvent.meetLink)
        console.log("🚀 ~ handleSaveEvent ~ selectedEvent:", selectedEvent.notes)


        if (selectedEvent.title && selectedEvent.time && selectedEvent.members && selectedEvent.meetLink) {
            // Format the time before saving
            // const formattedStart = moment(selectedEvent.start).format("HH:mm A");
            const formattedStart = moment(selectedEvent.start).format("hh:mm A"); // 12
            const formattedDate = moment(selectedEvent.start).format("YYYY-MM-DD");

            // Check if the selected time is in the past
            const now = moment();
            const selectedDateTime = moment(`${formattedDate} ${formattedStart}`, "YYYY-MM-DD hh:mm A");
            if (selectedDateTime.isBefore(now)) {
                toast.error("You cannot schedule a meeting in the past.");
                return;
            }
            // Ensure the meeting link is a valid URI
            let meetingLinkValidation = selectedEvent.meetLink.trim();
            if (!/^https?:\/\//i.test(meetingLinkValidation)) {
                toast.error("Please provide a valid meeting link");
                return;
            }

            if (userDetails?.role === 'employer') {
                let param = {
                    "title": selectedEvent.title,
                    "hostId": userId,
                    "attendees": selectedEvent?.members,
                    "date": formattedDate,
                    "startTime": formattedStart,
                    "note": selectedEvent.notes || "",
                    "meetingLink": selectedEvent.meetLink,
                    "status": "Scheduled"
                };
                if (selectedEvent?.eventId) {
                    console.log("🚀 ~ handleSaveEvent ~ selectedEvent.eventId:", selectedEvent.eventId);

                    await UpdateEvent(param, selectedEvent.eventId);
                } else {
                    await CreateEvent(param);
                }
                handleClose();
            } else {
                alert("Only employers can create meetings.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    };

    const handleEventClick = (event) => {
        console.log("🚀 ~ handleEventClick ~ event:", event)
        setSelectedEvent(event);
        setShowModal(true);
    };

    const toggleExpand = (eventId) => {
        setExpandedEventId(prevId => (prevId === eventId ? null : eventId));
    };

    // Create Events
    const CreateEvent = (param) => {
        try {
            setLoader(true)
            dispatch(createMeeting(param, (result) => {
                if (result.status) {
                    setEventsData(prevEvents => {
                        const eventExists = prevEvents.find(evt => evt.id === selectedEvent.id);
                        const updatedEvent = {
                            ...selectedEvent,
                            time: `${param.startTime}`
                        };
                        if (eventExists) {
                            return prevEvents.map(evt => (evt.id === selectedEvent.id ? updatedEvent : evt));
                        } else {
                            return [...prevEvents, { ...updatedEvent, id: prevEvents.length }];
                        }
                    });
                    setLoader(false)
                    toast.success("Created successfully")
                    getMeetingEvent(userId);
                }
            }));
        }
        catch (error) {
            console.log('Error:', error);
        }
        finally {
        }
    };

    const UpdateEvent = (param, id) => {
        console.log("id", id)
        try {
            setLoader(true);
            dispatch(updateMeeting(id, param, (result) => {
                if (result.status) {
                    setEventsData(prevEvents => {
                        const eventExists = prevEvents.find(evt => evt.id === selectedEvent.id);
                        const updatedEvent = {
                            ...selectedEvent,
                            time: `${param.startTime}`
                        };
                        if (eventExists) {
                            return prevEvents.map(evt => (evt.id === selectedEvent.id ? updatedEvent : evt));
                        } else {
                            return [...prevEvents, { ...updatedEvent, id: prevEvents.length }];
                        }
                    });
                    setLoader(false);
                    toast.success("Updated successfully");
                    getMeetingEvent(userId);
                }
            }));
        } catch (error) {
            console.log('Error:', error);
        }
    };


    // Get Meeting Events
    const getMeetingEvent = (user_id) => {
        try {
            setLoader(true)
            let param = {
                order_by: -1,
                order: 1,
                page_size: 20,
                page: 1,
            };
            dispatch(getMeetingEvents(user_id, param, (result) => {
                if (result.status) {
                    setLoader(false)
                }
            }));
        }
        catch (error) {
            console.log('Error:', error);
        }
    };

    // Get Meeting Events
    const getMeetingEventList = (user_id) => {
        try {
            setLoader(true)
            let param = {
                order_by: -1,
                order: 1,
                page_size: 20,
                page: currentPage,
            };
            dispatch(getMeetingEventsList(user_id, param, (result) => {
                if (result.status) {
                    setLoader(false)
                    setTotalPages(result?.data?.totalPages);
                }
            }));
        }
        catch (error) {
            console.log('Error:', error);
        }
    };



    // Get Upcomming and Past Events
    const getUpcommingAndPastEvents = (type) => {
        try {
            setLoader(true)
            let param = {
                "id": userId,
                "type": (type || "upcoming"),
                "sortBy": -1,
                "limit": 5,
                "page": currentPage
            }
            dispatch(getUpcomingOrPastEvent(param, (result) => {
                if (result.status) {
                    setLoader(false)
                    setTotalPages(result?.data?.totalPages);
                }
            }));
        }
        catch (error) {
            console.log('Error:', error); ``
        }
    };

    //Get Meeting Events
    const getMeetEvents = (date) => {

        let param = {
            "id": userId,
            "date": date,
            "sortBy": -1,
            "limit": 5,
            "page": currentPage
        }

        dispatch(EventsByDate(param, (result) => {
            if (result.status) {
                console.log('result', result)
            }
        }))
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleActiveEvents = (type) => {

        console.log('asdasdsad', type)
        setActiveTab(type)
        if (type == 'Upcoming') {
            getUpcommingAndPastEvents('upcoming')
        } else if (type == 'All') {
            getMeetingEventList(userId)
        }
        else if (type == 'Past') {
            getUpcommingAndPastEvents('past')
        }
        else if (type == 'Todays') {
            const today = new Date();
            const formattedDate = today.toISOString().slice(0, 10);
            getMeetEvents(formattedDate)
        }
    }


    useEffect(() => {
        handleActiveEvents(activeTab)
    }, [currentPage])

    useEffect(() => {
        if (meetingEvents) {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log("🚀 ~ useEffect ~ timezone:", timezone)
            const filterData = meetingEvents?.docs?.map((meet, index) => {
                const utcTime = moment.utc(meet.meetingTime);
                console.log("🚀 ~ filterData ~ utcTime:", utcTime.format());
                const cestTime = utcTime.tz(timezone);
                console.log("🚀 ~ filterData ~ cestTime:", cestTime.format());
                const end = cestTime.clone().add(1, 'hour').toDate();

                return {
                    id: index,
                    title: meet.title,
                    start: cestTime.toDate(),
                    end: end,
                    time: `${cestTime.format("HH:mm A")} - ${moment(end).format("HH:mm A")}`,
                    members: meet.attendees,// Adjust as needed
                    meetLink: meet.meetingLink,
                    notes: meet.note,
                    type: meet.status,
                    hostId: meet?.HostData?._id,
                    attendees: meet?.EmployeeData[0]?._id,
                    eventId: meet?._id
                };
            });

            setEventsData(filterData);
        }
    }, [meetingEvents]);


    const handleScrollToBottom = () => {
        if (hasMoreUsers) {
            getAllUserList(page + 1);  // Fetch next page of users
        }
    };


    const handleScrollToTop = () => {
        if (initialLoadComplete && page > 1 && !loader) {
            getAllUserList(page - 1, false);  // Load the previous page of users and replace current list
        }
    };


    useEffect(() => {
        if (userId) {
            getMeetingEvent(userId);
        }
    }, [userId]);

    const getChatroomList = () => {
        dispatch(getAllRoomList());
    };

    useEffect(() => {
        getChatroomList();
    }, [dispatch]);

    //Cancle Meeting
    const cancelEvent = (meet_Id) => {
        try {
            const today = new Date();
            const formattedDate = today.toISOString().slice(0, 10);

            dispatch(cancelMeeting(meet_Id, (result) => {
                if (result.status) {
                    console.log(result)
                    getMeetEvents(formattedDate)
                    setShowModal(false)
                    toast.success(result?.message)
                    getMeetingEvent(userId);
                }
            }))
        }
        catch (error) {
            console.log('Error:', error)
        }
    }

    const handleCancleEvent = () => {
        if (selectedEvent?.eventId)
            cancelEvent(selectedEvent?.eventId)
    }


    console.log('selectedEvent', selectedEvent)

    //ICS Generator
    const generateICSFile = () => {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//Your Application//EN\n";

        eventsData.forEach(event => {
            // Ensure that event start and end times are correctly formatted in UTC
            const start = moment(event.start).utc().format("YYYYMMDDTHHmmss[Z]");
            const end = moment(event.end).utc().format("YYYYMMDDTHHmmss[Z]");

            // Concatenate the meeting link with the event description
            let description = event.notes.replace(/[\n\r]+/g, " "); // Replace newlines in notes with spaces
            if (event.meetLink) {
                description += `\\nMeeting Link: ${event.meetLink}`;  // Append the meeting link to the description, use "\\n" for line breaks in ICS format
            }

            // Generate the event block with proper formatting
            icsContent += `BEGIN:VEVENT\n`;
            icsContent += `UID:${event.id}@yourapp.com\n`;  // Ensure the UID is unique and properly formatted
            icsContent += `SUMMARY:${event.title.replace(/[\n\r]+/g, " ")}\n`;  // Remove line breaks from the title
            icsContent += `DTSTART:${start}\n`;
            icsContent += `DTEND:${end}\n`;
            icsContent += `DESCRIPTION:${description}\n`;  // Include the full description with the meeting link
            icsContent += `END:VEVENT\n`;
        });

        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        saveAs(blob, "events.ics");
    };

    //Handle Copy link
    const handleCopyLink = () => {
        if (selectedEvent?.meetLink) {
            navigator.clipboard.writeText(selectedEvent.meetLink).then(() => {
                toast.success("Copied successfully.")

            }).catch(err => {
                console.error("Failed to copy link: ", err);
            });
        }
    };

    //Handle Copy link
    const CopyLink = (meetLink) => {
        if (meetLink) {
            navigator.clipboard.writeText(meetLink).then(() => {
                toast.success("Copied successfully.")
            }).catch(err => {
                console.error("Failed to copy link: ", err);
            });
        }
    };

    console.log('eventsData', eventsData)

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
    }

    useEffect(() => {
        scrollToTop()
    }, [])

    const handleFeedbackModal = (event) => {
        console.log('event', event);
        setMembers(event.attendees); // Assuming attendees are part of the event object
        setHostId(event.hostId); // Get the hostId from the event
        setShowFeedbackModal(true);
    };

    const closeFeedbackModal = () => {
        setShowFeedbackModal(false);
    };

    return (
        <>
            <div className="job-main-col">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            {/* <h3 className="calender-heading mb-0">ActiveAge Calendar</h3> */}
                        </div>
                        <div className="col-md-6 text-end">
                            <ul class="nav nav-tabs tabs-custom d-inline-flex justify-content-center calender-tabs" id="calenderTab" role="tablist">
                                <li class="nav-item newTabs-view" role="presentation">
                                    <button class="nav-link active" id="calender-tab" data-bs-toggle="tab" data-bs-target="#calender-tab-pane" type="button" role="tab" aria-controls="calender-tab-pane" aria-selected="true">Calendar View </button>
                                </li>
                                <li class="nav-item newTabs-view" role="presentation">
                                    <button class="nav-link" id="list-tab" data-bs-toggle="tab" data-bs-target="#list-tab-pane" type="button" role="tab" aria-controls="list-tab-pane" aria-selected="false">List View </button>
                                </li>

                            </ul>
                        </div>
                    </div>




                </div>
            </div>


            {/* Tabs Body */}

            <div className="tab-body-content">
                <div className="container">
                    {loader && <Loading />}
                    <div class="tab-content py-5" id="calenderTabContent">
                        <div class="tab-pane fade show active" id="calender-tab-pane" role="tabpanel" aria-labelledby="calender-tab" tabindex="0">

                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'end', paddingBottom: '5px' }}>
                                <Button variant="secondary" className="me-0" onClick={generateICSFile}  >
                                    Export & sync calendar
                                </Button>
                            </div>

                            <Calendar
                                selectable
                                localizer={localizer}
                                defaultDate={new Date()}
                                defaultView="month"
                                events={eventsData}
                                style={{ height: "100vh" }}
                                onSelectSlot={handleSelect}
                                onSelectEvent={handleEventClick}
                                views={{
                                    month: true,
                                    week: true,
                                    day: true,
                                    agenda: false, // Exclude the agenda view
                                }}
                                className="calender"
                            />


                            <Modal show={showModal} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    {userDetails?.role == 'employee' && <Modal.Title>{"Event Details"}</Modal.Title>}
                                    {userDetails?.role == 'employer' && <Modal.Title>{selectedEvent?.id !== undefined ? "Edit Event" : "Add New Event"}</Modal.Title>}
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Event Title</Form.Label>
                                            <Form.Control className="authfields"
                                                type="text"
                                                disabled={userDetails?.role == 'employee'}
                                                value={selectedEvent?.title || ""}
                                                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mt-3">
                                            <Form.Label>Event Date</Form.Label>
                                            <Form.Control className="authfields"
                                                type="date"
                                                disabled={userDetails?.role == 'employee'}
                                                value={selectedEvent?.start ? moment(selectedEvent.start).format("YYYY-MM-DD") : ""}
                                                onChange={(e) => {
                                                    const newDate = moment(e.target.value, "YYYY-MM-DD").toDate();
                                                    setSelectedEvent({
                                                        ...selectedEvent,
                                                        start: moment(selectedEvent.start).set({
                                                            year: newDate.getFullYear(),
                                                            month: newDate.getMonth(),
                                                            date: newDate.getDate(),
                                                        }).toDate(),
                                                    });
                                                }}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mt-3">
                                            <Form.Label>Start Time</Form.Label>
                                            <Form.Control className="authfields"
                                                type="time"
                                                disabled={userDetails?.role == 'employee'}
                                                value={selectedEvent?.start ? moment(selectedEvent.start).format("HH:mm") : ""}
                                                onChange={(e) => {
                                                    const updatedStart = moment(selectedEvent.start)
                                                        .set({
                                                            hour: moment(e.target.value, "HH:mm").hour(),
                                                            minute: moment(e.target.value, "HH:mm").minute(),
                                                        })
                                                        .toDate();

                                                    setSelectedEvent({
                                                        ...selectedEvent,
                                                        start: updatedStart,
                                                        time: `${moment(updatedStart).format("HH:mm A")} - ${selectedEvent.end ? moment(selectedEvent.end).format("HH:mm A") : ""}`,
                                                    });
                                                }}
                                            />
                                        </Form.Group>


                                        {userDetails?.role == 'employer' && (
                                            <Form.Group className="mt-3 member-chips-block">
                                                <Form.Label>Members</Form.Label>
                                                <Select
                                                    className="authfields react-select-container"
                                                    classNamePrefix="react-select"
                                                    id="Type-of-Opportunity"
                                                    value={selectedMembersOptions}
                                                    onChange={selectedOptions => setSelectedEvent({
                                                        ...selectedEvent,
                                                        members: selectedOptions ? selectedOptions.map(option => option.value) : []
                                                    })}
                                                    options={getRoomListOptions()}
                                                    placeholder="Select Members"
                                                    isClearable
                                                    isSearchable
                                                    isMulti={true}
                                                />
                                            </Form.Group>
                                        )}

                                        <Form.Group className="mt-3">
                                            <Form.Label>Meeting Link</Form.Label>
                                            <div className="d-flex">
                                                <Form.Control className="authfields"
                                                    type="text"
                                                    disabled={userDetails?.role == 'employee'}
                                                    value={selectedEvent?.meetLink || ""}
                                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, meetLink: e.target.value })}
                                                />
                                                {selectedEvent?.id !== undefined && <Button
                                                    variant="outline-secondary"
                                                    onClick={handleCopyLink}
                                                    className="ml-2">
                                                    Copy Link
                                                </Button>
                                                }                            </div>
                                        </Form.Group>

                                        <Form.Group className="mt-3">
                                            <Form.Label>Notes</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                disabled={userDetails?.role == 'employee'}
                                                value={selectedEvent?.notes || ""}
                                                onChange={(e) => setSelectedEvent({ ...selectedEvent, notes: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                {userDetails?.role == 'employer' && <Modal.Footer>
                                    {selectedEvent?.id !== undefined && <Button variant="primary" onClick={handleCancleEvent}>
                                        Cancel Event
                                    </Button>}

                                    {selectedEvent?.id === undefined && <Button variant="primary" onClick={handleSaveEvent}>
                                        Save Event
                                    </Button>}
                                    {selectedEvent?.id !== undefined && <Button variant="primary" onClick={handleSaveEvent}>
                                        Update Event
                                    </Button>}
                                </Modal.Footer>}
                            </Modal>


                        </div>
                        <div class="tab-pane fade" id="list-tab-pane" role="tabpanel" aria-labelledby="list-tab" tabindex="0">

                            {/* Events Tabs */}

                            <div className="calender-inner-wrapper-tabs">
                                <div className="calender-tabs-col">
                                    <nav>
                                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button class="nav-link active" id="nav-todaysEvents-tab" data-bs-toggle="tab" data-bs-target="#nav-todaysEvents"
                                                type="button" role="tab" aria-controls="nav-todaysEvents" aria-selected="true" onClick={() => { handleActiveEvents("Todays"); setCurrentPage(1) }}>Todays Events</button>
                                            <button class="nav-link" id="nav-allEvents-tab" data-bs-toggle="tab" data-bs-target="#nav-allEvents"
                                                type="button" role="tab" aria-controls="nav-allEvents" aria-selected="false" onClick={() => { handleActiveEvents("All"); setCurrentPage(1) }}>All  Events </button>
                                            <button class="nav-link" id="nav-upcomingEvents-tab" data-bs-toggle="tab" data-bs-target="#nav-upcomingEvents"
                                                type="button" role="tab" aria-controls="nav-upcomingEvents" aria-selected="false" onClick={() => { handleActiveEvents("Upcoming"); setCurrentPage(1) }}>Upcoming Events </button>
                                            <button class="nav-link" id="nav-pastEvents-tab" data-bs-toggle="tab" data-bs-target="#nav-pastEvents"
                                                type="button" role="tab" aria-controls="nav-pastEvents" aria-selected="false" onClick={() => { handleActiveEvents("Past"); setCurrentPage(1) }}>Past Events  </button>

                                        </div>
                                    </nav>
                                </div>

                                {/* Events Tab Body */}

                                {/* Today Events */}
                                <div class="tab-content" id="nav-tabContent">
                                    <div class="tab-pane fade show active" id="nav-todaysEvents" role="tabpanel" aria-labelledby="nav-todaysEvents-tab" tabindex="0">
                                        {meetingEventsByDate?.docs?.map((o) => (
                                            <div className="inner-job-wrapper-candidate calender-wrapper">
                                                <div className="job-details-col candidate-job-details">
                                                    <div className="d-flex flex-col justify-content-between ">
                                                        <div>
                                                            <div className="name-col-candidate candidate-icon-col d-flex align-items-center gap-2 new-name-col">
                                                                <h5 className="mb-0 candidate-name">{`${o.title}`}</h5>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <img src={calenderIcon} alt="calender" />
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0">{getCalenderEventwithTimeZone(o.meetingTime)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <span><img src={meetingIcon} alt="meeting-link" /></span>
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0 link-col">{o.meetingLink}</p>
                                                                    <button className="copy-btn" type="button" onClick={() => CopyLink(o.meetingLink)}><img src={copyIcon} alt="copy-icon" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="d-flex gap-2 candidate-icon-col">
                                                                <button className="btn btn-outline" type="button" onClick={() => cancelEvent(o?._id)}> Cancel Event</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {meetingEventsByDate?.totalDocs == 0 && <div className="no-candidate-info">{landingContent?.employerDashbaord?.No_events_found}</div>}
                                        <hr />
                                    </div>

                                    {/* ALL Events */}
                                    <div class="tab-pane fade" id="nav-allEvents" role="tabpanel" aria-labelledby="nav-allEvents-tab" tabindex="0">
                                        {meetingEventsList?.docs?.map((o) => (
                                            <div className="inner-job-wrapper-candidate calender-wrapper">
                                                <div className="job-details-col candidate-job-details">
                                                    <div className="d-flex flex-col justify-content-between ">
                                                        <div>
                                                            <div className="name-col-candidate candidate-icon-col d-flex align-items-center gap-2 new-name-col">
                                                                <h5 className="mb-0 candidate-name">{`${o.title}`}</h5>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <img src={calenderIcon} alt="calender" />
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0">{getCalenderEventwithTimeZone(o.meetingTime)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <span><img src={meetingIcon} alt="meeting-link" /></span>
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0 link-col">{o.meetingLink}</p>
                                                                    <button className="copy-btn" type="button" onClick={() => CopyLink(o.meetingLink)}><img src={copyIcon} alt="copy-icon" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="d-flex gap-2 candidate-icon-col">
                                                                <button className="btn btn-outline" type="button" onClick={() => cancelEvent(o?._id)}> Cancel Event</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {meetingEventsList.totalDocs == 0 && <div className="no-candidate-info">{landingContent?.employerDashbaord?.No_events_found}</div>}
                                    </div>

                                    {/* Upcomming Events */}
                                    <div class="tab-pane fade" id="nav-upcomingEvents" role="tabpanel" aria-labelledby="nav-upcomingEvents-tab" tabindex="0">
                                        {meetingUpcommingandPast?.docs?.map((o) => (
                                            <div className="inner-job-wrapper-candidate calender-wrapper">
                                                <div className="job-details-col candidate-job-details">
                                                    <div className="d-flex flex-col justify-content-between ">
                                                        <div>
                                                            <div className="name-col-candidate candidate-icon-col d-flex align-items-center gap-2 new-name-col">
                                                                <h5 className="mb-0 candidate-name">{`${o.title}`}</h5>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <img src={calenderIcon} alt="calender" />
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0">{getCalenderEventwithTimeZone(o.meetingTime)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <img src={meetingIcon} alt="calender" />
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0 link-col" >{o.meetingLink}</p>
                                                                    <button className="copy-btn" type="button" onClick={() => CopyLink(o.meetingLink)}><img src={copyIcon} alt="copy-icon" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="d-flex gap-2 candidate-icon-col">
                                                                <button className="btn btn-outline" type="button" onClick={() => cancelEvent(o?._id)}> Cancel Event</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {meetingUpcommingandPast?.totalDocs == 0 && <div className="no-candidate-info">{landingContent?.employerDashbaord?.No_events_found}</div>}
                                    </div>

                                    {/* Past Events */}
                                    <div class="tab-pane fade" id="nav-pastEvents" role="tabpanel" aria-labelledby="nav-pastEvents-tab" tabindex="0">
                                        {meetingUpcommingandPast?.docs?.map((o) => (
                                            <div className="inner-job-wrapper -candidate calender-wrapper ">
                                                <div className="job-details-col candidate-job-details">
                                                    <div className="d-flex flex-col justify-content-between">
                                                        <div>
                                                            <div className="name-col-candidate candidate-icon-col d-flex align-items -center gap-2 new-name-col">
                                                                <h5 className="mb-0 candidate-name">{`${o.title}`}</h5>
                                                                <div className="name-badge-col">
                                                                </div>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <img src={calenderIcon} alt="calender" />
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0">{getCalenderEventwithTimeZone(o.meetingTime)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="appointment-details-col d-flex gap-2 flex-wrap  align-items-center">
                                                                <div className="appointment-img-col">
                                                                    <img src={meetingIcon} alt="calender" />
                                                                </div>
                                                                <div className="appointment-text-col d-flex flex-wrap gap-2 align-items-center">
                                                                    <p className="date-time-col name-col-candidate mb-0 link-col">{o.meetingLink}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-primary" type="button" onClick={() => handleFeedbackModal(o)}>Provide Feedback</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {meetingUpcommingandPast?.totalDocs == 0 && <div className="no-candidate-info">{landingContent?.employerDashbaord?.No_events_found}</div>}
                                    </div>
                                </div>
                                <div className="calender-tab-actionBtn">
                                    <div className="text-center candidate-icon-col mb-5 mt-5 d-flex flex-column flex-md-row align-items-center">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            {landingContent?.pagination?.previousButton}
                                        </button>
                                        <span className="mx-3 my-3 my-md-0">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            {landingContent?.pagination?.nextButton}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Feedback Modal */}
            <FeedbackModal show={showFeedbackModal} onHide={closeFeedbackModal} host={hostId} members={members} />
        </>
    );
}
