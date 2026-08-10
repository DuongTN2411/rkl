abstract class PaymentMethod {
  abstract processPayment(): void;
}

class CreditCardPayment extends PaymentMethod {
  processPayment(): void {
    console.log("Processing credit card payment.");
  }
}

class PaypalPayment extends PaymentMethod {
  processPayment(): void {
    console.log("Processing PayPal payment.");
  }
}

const creditCard = new CreditCardPayment();
creditCard.processPayment();

const paypal = new PaypalPayment();
paypal.processPayment();
