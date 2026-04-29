async function testOrderCreation() {
  const url = "http://localhost:3000/api/orders";
  const payload = {
    customer: {
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      address: "123 Brutal Street",
      city: " रायपुर",
      state: "Chhattisgarh",
      pincode: "492001"
    },
    items: [
      {
        slug: "404-not-found-tee",
        quantity: 1,
        price: 3500
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Order Creation SUCCESS!");
    } else {
      console.log("❌ Order Creation FAILED!");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testOrderCreation();
