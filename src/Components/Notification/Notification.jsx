import React, { useEffect, useState } from 'react'
import "./Notification.css"
import HeaderWeb from '../Header/HeaderWeb'
import { Header } from '../Header/Header'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../firebase'
import { format, isToday, isYesterday } from 'date-fns';
import {Assets} from '../Assets/Assets'
import Footer from '../../Pages/Footer/Footer'
import TopnavWeb from '../TopNav/TopnavWeb'
import { TopNav } from '../TopNav/TopNav'
import { useNavigate } from 'react-router-dom'

const Notification = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth > 480);

    const [notificationList, setNotificationList] = useState([]);
    const [newNotificationList, setNewNotificationList] = useState([]);
    const [previousNotificationList, setPreviousNotificationList] = useState([]);


    
    const custId = localStorage.getItem("loginUserId");



    // Define your NotificationModel

const createNotificationModel = (id, customerId, customerName, customerPhone, title, subTitle, date, isOpen) => ({
    id,
    customerId,
    customerName,
    customerPhone,
    title,
    subTitle,
    date,
    isOpen,
  });


  const formatNotificationDate = (date) => {
    if (isToday(date)) {
      return `Today ${format(date, 'hh:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'hh:mm a')}`;
    } else {
      return format(date, 'yyyy-MM-dd');
    }
  };




  
    const fetchNotifications = async (custId) => {
      try {
        const notificationQuery = query(
          collection(firestore, 'NOTIFICATIONS'),
          where('CUSTOMER_ID', '==', custId)
        );
  
        const notificationSnapshot = await getDocs(notificationQuery);
        const notifications = [];
  
        if (!notificationSnapshot.empty) {
          notificationSnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.DATE.toDate();
            const customerName = data.CUSTOMER_NAME || '';
            const customerPhone = (data.CUSTOMER_PHONE || 0).toString();
            const title = data.TITLE || '';
            const subTitle = data.SUB_TITLE || '';
            const isOpen = data.IS_OPEN || false;
  
            notifications.push(
              createNotificationModel(doc.id, custId, customerName, customerPhone, title, subTitle, date, isOpen)
            );
          });

          console.log(notifications, "notification.........................")
  
          setNotificationList(notifications);
          setNewNotificationList(notifications.filter((item) => item.isOpen === false));
          setPreviousNotificationList(notifications.filter((item) => item.isOpen === true));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    useEffect(() => {
      if (custId) {
        fetchNotifications(custId);
      }
    }, [custId]);

    
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth > 870);
        };
    
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

     console.log(newNotificationList, "new notification ............................")
     console.log(previousNotificationList, "previousNotificationList ====================")

     const navigate = useNavigate()

     const handleNavigateBack = () => {
      navigate('/home')
     }



  return (

    <>

     {isMobile ? <HeaderWeb/> : <Header/>}
  
    <div className='notification'>


       {!isMobile ? (
          <div className="header_cart">
            <div onClick={handleNavigateBack} className="back_arrow">
              <img src={Assets.arrow_back} alt="" />
            </div>
            <h6>Go Back</h6>
          </div>
       ) :  ""}

      { newNotificationList.length > 1 ? 
        <div className="notification_container">
            <div className="new_notification_container">
            <div className="h3"> New </div>

            {newNotificationList.map((notification) => (
        <div key={notification.id} className="notification_box">
          <h5>{notification.title}</h5> {/* Make sure you're using `notification.title` and `notification.subTitle` */}
          <p>{notification.subTitle}</p>
          <div className="notification_time">
            <span>{formatNotificationDate(notification.date)}</span>
          </div>
        </div>
      ))}

{/*             
            <div className="notification_box">
                <h5>You Redeemed ₹10,000</h5>
                <p>
                Lorem ipsum dolor sit amet consectetur. Sit fames tincidunt nisl nullam. Fermentum rhoncus augue ornare volutpat viverra euismod. Diam.
                </p>
                <div className="notification_time">
                    <span>Today 10:55 am</span>
                </div>
            </div> */}

            </div>
            <div className="previous_notification_container">

<div className="h3"> Previous </div>

    {previousNotificationList.map((notification) => (
        <div key={notification.id} className="notification_box">
          <h5>{notification.title}</h5> {/* Make sure you're using `notification.title` and `notification.subTitle` */}
          <p>{notification.subTitle}</p>
          <div className="notification_time">
          <span>{formatNotificationDate(notification.date)}</span>
          </div>
        </div>
      ))}




{/* 
<div className="notification_box">
    <h5>You Redeemed ₹10,000</h5>
    <p>
    Lorem ipsum dolor sit amet consectetur. Sit fames tincidunt nisl nullam. Fermentum rhoncus augue ornare volutpat viverra euismod. Diam.
    </p>
    <div className="notification_time">
        <span>Today 10:55 am</span>
    </div>
</div> */}



</div>

        </div> : 
        <div className='empty-notification'>
          <div className='notificationContent_wrapper'>
            <img src={Assets.emptyBell} alt="" />
            <span>No updates for you right now</span>
          </div>

        </div>
      }
    </div>
    <Footer/>
    </>
  )
}

export default Notification