const { getAllOrderDetails ,getOrderIdDetails,updateOrderStatus} = require('../../models/admin/OrderModel');
const { sendWhatsAppMessage } = require("../../utils.js");

const fetchAllOrderDetails = async (req, res) => {
  try {
    const allOrders = await getAllOrderDetails();

    if (allOrders.length > 0) {
      res.status(200).json({
        success: true,
        data: allOrders
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No orders found'
      });
     
      
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
    console.log(error);
  }
};
const fetchOrderIdDetails = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const orderDetails = await getOrderIdDetails(orderId);
  
      if (orderDetails) {
        res.status(200).json({
          success: true,
          data: orderDetails
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching order details',
        error: error.message
      });
    }
  };
  

  // Update order status to "Ready to Drop"
// const setReadyToDrop = async (req, res) => {
//   const { mobile_Number } = req.body; // Extract mobile number from request body
//   console.log(mobile_Number);
  
//   if (!mobile_Number) {
//       return res.status(400).json({ message: "Mobile number is required." });
//   }
//   try {
//       const { order_id } = req.params;
//       const updatedOrder = await updateOrderStatus(order_id, 5); // Status 4 is 'Ready to Drop'
//       res.status(200).json({ message: 'Order status updated to Ready to Drop', updatedOrder });
//   } catch (error) {
//       res.status(500).json({ error: 'Failed to update order status' });
//   }
// };
const setReadyToDrop = async (req, res) => {
  const { mobile_Number } = req.body; // Extract mobile number from request body

  if (!mobile_Number) {
      return res.status(400).json({ message: "Mobile number is required." });
  }

  try {
      const { order_id } = req.params;
      const updatedOrder = await updateOrderStatus(order_id, 5); // Status 5 is 'Ready to Drop'

      // WhatsApp message content
      const message = `🚚 Your order #${order_id} is now *Ready for Pickup*! Please collect it at your convenience. Thank you! 😊`;

      // Send WhatsApp message
      await sendWhatsAppMessage(mobile_Number, message);

      res.status(200).json({ message: "Order status updated and WhatsApp message sent.", updatedOrder });
  } catch (error) {
      res.status(500).json({ error: "Failed to update order status or send WhatsApp message" });
  }
};
// Update order status to "Completed"
const setCompleted = async (req, res) => {
  try {
      const { order_id } = req.params;
      const updatedOrder = await updateOrderStatus(order_id, 6); // Status 6 is 'Completed'
      res.status(200).json({ message: 'Order status updated to Completed', updatedOrder });
  } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
  }
};

module.exports = { fetchAllOrderDetails,fetchOrderIdDetails ,setReadyToDrop,setCompleted};
