export class OrdersModel {
    constructor(orderId, customerId, orderDate, orderPrice, productId, productImage, productPrice, productQuantity, status) {
      this.orderId = orderId;
      this.customerId = customerId;
      this.orderDate = orderDate;
      this.orderPrice = orderPrice;
      this.productId = productId;
      this.productImage = productImage;
      this.productPrice = productPrice;
      this.productQuantity = productQuantity;
      this.status = status;
    }
  }
  