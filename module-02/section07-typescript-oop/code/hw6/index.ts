enum OrderStatus {
  Pending,
  Shipped,
  Delivered,
}

class Order {
  status: OrderStatus;

  constructor(status: OrderStatus) {
    this.status = status;
  }

  checkStatus(): void {
    if (this.status === OrderStatus.Delivered) {
      console.log("Order finished");
    }
  }
}

const order = new Order(OrderStatus.Delivered);
order.checkStatus();
