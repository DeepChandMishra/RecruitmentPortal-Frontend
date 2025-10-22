// import moment from 'moment';

// import moment from "moment";
import moment from "moment-timezone";
import backImage from '../assets/images/blank-profile.png';
import euroIcon from "../assets/images/euro.svg";


export const formatDate = (dateString) => {

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;

}


export const calculateDaysBetween = (start, expiry) => {
  const startDate = new Date(start);
  const expiryDate = new Date(expiry);
  const timeDifference = expiryDate - startDate;
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return dayDifference;
};


export const sortFunction = (rowA, rowB) => {
  const employeeA = rowA || '';
  const employeeB = rowB || '';

  if (employeeA < employeeB) {
    return -1;
  }
  if (employeeA > employeeB) {
    return 1;
  }
  return 0;
}


export const sortFunctionNumber = (rowA, rowB) => {
  const employeeA = rowA?.hired_employee || '';
  const employeeB = rowB?.hired_employee || '';

  if (employeeA < employeeB) {
    return -1;
  }
  if (employeeA > employeeB) {
    return 1;
  }
  return 0;
}


// export const formatDateTime = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
//     const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
//     const hours = String(date.getHours()).padStart(2, '0'); // Add leading zero if necessary
//     const minutes = String(date.getMinutes()).padStart(2, '0'); // Add leading zero if necessary
//     const seconds = String(date.getSeconds()).padStart(2, '0'); // Add leading zero if necessary
//     const formattedDateTime = `${year}-${month}-${day} Time: ${hours}:${minutes}:${seconds}`;
//     return formattedDateTime;
// }

export function formatDateTime(datetime, format = "YYYY/MM/DD hh:mm a") {
  const localTime = moment(datetime).local();
  if (localTime.isSame(moment(), 'day')) {
    return `Today, ${localTime.format('hh:mm A')}`;
  }
  return localTime.format(format);
}

export function formatTime(datetime) {
  const localTime = moment(datetime).local();
  return localTime.format('LT'); // 'LT' formats as 'hh:mm A' (e.g., '12:30 PM')
}

const formatRate = (rate) => {
  if (!rate) return '';
  return rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};



export const GetSalaryFormat = (payType, payScale) => {
  if (payType == "Annual salary") {
    return <>
      <img src={euroIcon} alt="icon" className="pe-2" />
      {`${formatRate(payScale.from)} - ${formatRate(payScale.to)} p.a.`}
    </>
  }
  else if (payType == "Hourly rate") {
    return <>
      <img src={euroIcon} alt="icon" className="pe-2" />
      {`${formatRate(payScale.from)} - ${formatRate(payScale.to)} p.a.`}
    </>
  }
  else if (payType == "Prefer not to say") {
    return `Prefer not to say`
  }
  else {
    return `Unpaid`
  }
}

// export const GetSalaryFormat = (payType, payScale) => {
//   // Helper function to format the rate with Euro symbol
//   const formatRateWithEuro = (amount) => {
//     return `€${amount.toFixed(2)}`; // Format the amount as a number with two decimal places and prepend the Euro symbol
//   };

//   if (payType == "Annual salary") {
//     return `€${formatRateWithEuro(payScale.from)} - ${formatRateWithEuro(payScale.to)} p.a.`;
//   } else if (payType == "Hourly rate") {
//     return `€${formatRateWithEuro(payScale.from)} - ${formatRateWithEuro(payScale.to)} h.r.`;
//   } else if (payType == "Prefer not to say") {
//     return `Prefer not to say`;
//   } else {
//     return `Unpaid`;
//   }
// };


export const bytesToMB = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 1; // Number of decimal places
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const isValidURL = (string) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|(localhost)|' + // domain name and extension or localhost
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(string);
};

export const containsHttps = (string) => {
  return string?.includes("https");
};

export const blankProfile = () => {
  return backImage;
}

export function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) {
    return 'Active just now';
  } else if (diffInMinutes < 60) {
    return `Active ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `Active ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `Active ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks < 4) {
    return `Active ${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else {
    return `Active ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
}

export function getNotificationTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
}

export function getSidebarTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) {
    return 'Last message just now';
  } else if (diffInMinutes < 60) {
    return `Last message ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `Last message ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `Last message ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks < 4) {
    return `Last message ${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else {
    return `Last message ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
}

// funtion to format the faq response in array format
export function formatFaqArray(faqArray, lang = "en") {
  return faqArray?.reduce((acc, item) => {
    // handle lang mapping
    const langKey = lang === "en" ? "content" : `${lang}Content`;
    const localizedContent = item?.[langKey] || item?.content; // fallback to English if missing

    if (item?.heading?.startsWith("Ques")) {
      acc.faqs.push({
        question: localizedContent
      });
    }
    else if (item?.heading?.startsWith("Ans")) {
      if (acc.faqs.length > 0) {
        acc.faqs[acc.faqs.length - 1].answer = localizedContent;
      }
    }
    else {
      acc.heading = item?.heading;
      acc.contentType = item?.contentType;
      acc.content = localizedContent;
    }

    return acc;
  }, { faqs: [] });
}

// funtion to get the particular content based on heading
export function getContentByHeading(array, type, lang) {
  const matchedObject = array?.find(item => item.heading === type);
  if (lang == 'en')
    return matchedObject?.content || "";
  else if (lang == 'es')
    return matchedObject?.esContent || "";
  else if (lang == 'fr')
    return matchedObject?.frContent || "";
  else if (lang == 'nl')
    return matchedObject?.nlContent || "";
};


//Format Date
export function formatDateValue(value) {
  const date = new Date(value);

  // Extract year, month, and day and format as YYYY-MM-DD
  const formattedDate = date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');

  return formattedDate;
}

export const getCalenderEventTimeZone = (meetingTime) => {
  // Get the user's local timezone
  // const timezone = 'Europe/Berlin';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("User Timezone:", timezone);

  // Parse the meeting time in UTC
  const utcTime = moment.utc(meetingTime);
  console.log("🚀 ~ UTC Time:", utcTime.format());

  // Convert to the user's local timezone
  const localTime = utcTime.clone().tz(timezone);
  console.log("🚀 ~ Local Time:", localTime.format());

  // Add 1 hour to the local time to get the end time
  const end = localTime.clone().add(1, 'hour');
  console.log("🚀 ~ End Time:", end.format());

  // Return the formatted time range in local time with AM/PM
  return `${localTime.format('hh:mm A')} - ${end.format('hh:mm A')}`;
};

export const getCalenderEventwithTimeZone = (meetingTime) => {
  // Get the user's local timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("User Timezone:", timezone);

  // Parse the meeting time in UTC
  const utcTime = moment.utc(meetingTime);
  console.log("🚀 ~ UTC Time:", utcTime.format());

  // Convert to the user's local timezone
  const localTime = utcTime.clone().tz(timezone);
  console.log("🚀 ~ Local Time:", localTime.format());

  // Add 1 hour to the local time to get the end time
  const end = localTime.clone().add(1, 'hour');
  console.log("🚀 ~ End Time:", end.format());

  // Format the date in the required format 'MM/DD/YYYY' and the day of the week
  const formattedDate = localTime.format('MM/DD/YYYY');
  const dayOfWeek = localTime.format('dddd'); // This will give the day name, e.g., Monday

  // Return the formatted time range with the date and day of the week
  return `${localTime.format('hh:mm A')} - ${formattedDate} ${dayOfWeek}`;
};

export const logoutUser = () => {
  console.log('called called new')
  // Clear all local storage items
  localStorage.clear();

  // Redirect to the login page
  window.location.href = '/login';
};
