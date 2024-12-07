// models/CouponModel.js
class CouponModel {
  constructor(
    COUPON_ID,
    LOT_DATE,
    TICKET_DATE,
    TICKET_NUMBER,
    USER_ID,
    USER_NAME,
    VALIDITY,
    WINNING_STATUS,
    ORDER_ID
  ) {
    this.COUPON_ID = COUPON_ID;
    this.LOT_DATE = LOT_DATE;
    this.TICKET_DATE = TICKET_DATE;
    this.TICKET_NUMBER = TICKET_NUMBER;
    this.USER_ID = USER_ID;
    this.USER_NAME = USER_NAME;
    this.VALIDITY = VALIDITY;
    this.WINNING_STATUS = WINNING_STATUS;
    this.ORDER_ID = ORDER_ID;
  }
}

export default CouponModel;
