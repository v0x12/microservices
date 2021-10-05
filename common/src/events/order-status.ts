export enum OrderStatus {
  // Order has been created, the ticket which trying to order is not reserved yet.
  Created = "CREATED",
  // 1. If the ticket is already been reserved or when user cancelling it.
  // 2. The order expires before payment.
  Cancelled = "CANCELLED",
  // The ticket is reserved and waiting an precisious ammount of time which
  // gave for the user to complete the payment
  AwaitingPayment = "AWAITING:PAYMENT",
  // The order is reserved the ticket and the user completed the payment
  Complete = "CANCELLED",
}
