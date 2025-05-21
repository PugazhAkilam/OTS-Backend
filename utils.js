const axios=require("axios")

function generateOrderMessage(orderId, cartItems, totalPrice) {
    let message = `🛒 *Order Confirmation*\n\n`;
    message += `✅ Your order *#${orderId}* has been placed successfully.\n\n`;
    
    message += `📦 *Order Details:*\n`;
    message += `--------------------------------------------------------------\n`;
    message += `| Item Name        | Service Name    | Qty | Price  | Total  |\n`;
    message += `--------------------------------------------------------------\n`;
    
    cartItems.forEach(item => {
        const name = item.servSubType_Name ? item.servSubType_Name.padEnd(20, " ") : "N/A".padEnd(20, " ");
        const servname = item.serv_Name ? item.serv_Name.padEnd(15, " ") : "N/A".padEnd(15, " ");
        const qty = item.quantity.toString().padEnd(3, " ");
        const price = `₹${item.rate}`.padEnd(6, " ");
        const total = `₹${(item.quantity * item.rate).toFixed(2)}`.padEnd(7, " ");

        message += `| ${name} | ${servname} | ${qty} | ${price} | ${total} |\n`;
    });

    message += `--------------------------------------------------------------\n`;
    message += `💰 *Total Price:* ₹${totalPrice.toFixed(2)}\n\n`;
    message += `🙏 Thank you for shopping with us!`;

    return message;
}
const sendWhatsAppMessage = async (mobileNumber, message) => {
    try {
        const response = await axios.post("https://wav5.algotechnosoft.com/api/send", {
            number: `91${mobileNumber}`, // Format the number correctly
            type: "text",
            message: message,
            instance_id: "68258041C38DE", // Your instance ID
            access_token: "675fece35d27f", // Your access token
        });

        return response.data; // Return response if needed
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
        throw new Error("WhatsApp message sending failed.");
    }
};
module.exports = { generateOrderMessage ,sendWhatsAppMessage};

// function generateOrderMessage(orderId, cartItems, totalPrice) {
//     let message = `🛒 *Order Confirmation*\n\n`;
//     message += `✅ Your order *#${orderId}* has been placed successfully.\n\n`;

//     // Determine max column widths dynamically
//     let maxItemNameLength = Math.max(...cartItems.map(item => item.servSubType_Name?.length || 0), "Item Name".length);
//     let maxServiceNameLength = Math.max(...cartItems.map(item => item.serv_Name?.length || 0), "Service Name".length);
//     let maxQtyLength = Math.max(...cartItems.map(item => item.quantity.toString().length), "Qty".length);
//     let maxPriceLength = Math.max(...cartItems.map(item => `₹${item.rate}`.length), "Price".length);
//     let maxTotalLength = Math.max(...cartItems.map(item => `₹${(item.quantity * item.rate).toFixed(2)}`.length), "Total".length);

//     // Construct table header dynamically
//     let headerRow = `| ${"Item Name".padEnd(maxItemNameLength)} | ${"Service Name".padEnd(maxServiceNameLength)} | ${"Qty".padEnd(maxQtyLength)} | ${"Price".padEnd(maxPriceLength)} | ${"Total".padEnd(maxTotalLength)} |`;
//     let separatorRow = `-${"-".repeat(maxItemNameLength)}-+-${"-".repeat(maxServiceNameLength)}-+-${"-".repeat(maxQtyLength)}-+-${"-".repeat(maxPriceLength)}-+-${"-".repeat(maxTotalLength)}-+`;

//     message += `📦 *Order Details:*\n`;
//     message += `${separatorRow}\n`;
//     message += `${headerRow}\n`;
//     message += `${separatorRow}\n`;

//     // Generate table rows dynamically
//     cartItems.forEach(item => {
//         const name = (item.servSubType_Name || "N/A").padEnd(maxItemNameLength);
//         const servName = (item.serv_Name || "N/A").padEnd(maxServiceNameLength);
//         const qty = item.quantity.toString().padEnd(maxQtyLength);
//         const price = `₹${item.rate}`.padEnd(maxPriceLength);
//         const total = `₹${(item.quantity * item.rate).toFixed(2)}`.padEnd(maxTotalLength);

//         message += `| ${name} | ${servName} | ${qty} | ${price} | ${total} |\n`;
//     });

//     message += `${separatorRow}\n`;
//     message += `💰 *Total Price:* ₹${totalPrice.toFixed(2)}\n\n`;
//     message += `🙏 Thank you for shopping with us!`;

//     return message;
// }

// module.exports = { generateOrderMessage };
