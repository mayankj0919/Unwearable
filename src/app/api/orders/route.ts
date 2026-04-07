import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  slug: string;
  sku?: string;
  quantity: number;
  price?: number;
  selectedSize?: string;
  selectedColorId?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderPayload {
  customer: CustomerInfo;
  items: OrderItem[];
  totalOrderValue?: number;
}

interface QikinkLineItem {
  sku: string;
  quantity: number;
  price: number;
  search_from_my_products: number;
}

interface QikinkShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  phone: string;
  email: string;
  city: string;
  zip: number;
  province: string;
  country_code: string;
}

interface QikinkOrderPayload {
  order_number: string;
  qikink_shipping: number;
  gateway: string;
  total_order_value: number;
  line_items: QikinkLineItem[];
  shipping_address: QikinkShippingAddress;
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `UNW${ts}${rand}`.substring(0, 15);
}

async function getProductStoreSku(slug: string, colorId?: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("products")
    .select("sku, store_skus")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(`Failed to fetch SKU for slug ${slug}:`, error);
    return null;
  }

  // Use variant-specific Store SKU if available, otherwise fall back to generic sku
  if (colorId && data.store_skus && data.store_skus[colorId]) {
    return data.store_skus[colorId];
  }

  return data.sku;
}

const QIKINK_BASE_URL = process.env.QIKINK_API_URL || "https://api.qikink.com";

async function getQikinkAccessToken(): Promise<{ token?: string; error?: string }> {
  const clientId = process.env.QIKINK_CLIENT_ID;
  const clientSecret = process.env.QIKINK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return { error: "Qikink API credentials not configured" };
  }

  try {
    const tokenUrl = `${QIKINK_BASE_URL}/api/token`;
    console.log("QIKINK TOKEN URL:", tokenUrl);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        ClientId: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    const data = await response.json();
    console.log("QIKINK TOKEN RESPONSE:", response.status, JSON.stringify(data));

    if (!response.ok || !data.Accesstoken) {
      return { error: data.error || data.message || `Token request failed: ${response.status}` };
    }

    return { token: data.Accesstoken };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { error: `Token fetch error: ${errorMessage}` };
  }
}

async function createQikinkOrder(payload: QikinkOrderPayload): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const clientId = process.env.QIKINK_CLIENT_ID;
  const tokenResult = await getQikinkAccessToken();

  if (tokenResult.error || !tokenResult.token) {
    return { success: false, error: tokenResult.error || "Failed to obtain access token" };
  }

  try {
    const response = await fetch(`${QIKINK_BASE_URL}/api/order/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ClientId": clientId!,
        "Accesstoken": tokenResult.token,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || data.message || `API error: ${response.status}` 
      };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: `Network error: ${errorMessage}` };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json();

    const { customer, items } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing customer details or cart items" },
        { status: 400 }
      );
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.pincode) {
      return NextResponse.json(
        { error: "Missing required customer fields: name, email, phone, address, pincode" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.slug || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: "Each item must have a valid slug and quantity" },
          { status: 400 }
        );
      }
    }

    // Build line items with variant-specific Store SKU lookup
    const lineItems: QikinkLineItem[] = await Promise.all(
      items.map(async (item) => {
        const sku = await getProductStoreSku(item.slug, item.selectedColorId);
        if (!sku) {
          throw new Error(`SKU not found for product: ${item.slug}`);
        }
        return {
          sku,
          quantity: item.quantity,
          price: item.price || 0,
          search_from_my_products: 1,
        };
      })
    );

    // Split customer name into first/last
    const nameParts = customer.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const orderNumber = generateOrderId();
    const totalOrderValue = body.totalOrderValue || lineItems.reduce((sum, li) => sum + li.price * li.quantity, 0);

    const qikinkPayload: QikinkOrderPayload = {
      order_number: orderNumber,
      qikink_shipping: 1,
      gateway: "Prepaid",
      total_order_value: totalOrderValue,
      line_items: lineItems,
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address1: customer.address,
        address2: "",
        phone: customer.phone,
        email: customer.email,
        city: customer.city || "",
        zip: parseInt(customer.pincode, 10) || 0,
        province: customer.state || "Chhattisgarh",
        country_code: "IN",
      },
    };

    console.log("QIKINK PAYLOAD:", JSON.stringify(qikinkPayload, null, 2));

    const result = await createQikinkOrder(qikinkPayload);

    if (!result.success) {
      console.error("QIKINK ERROR:", result.error);
      return NextResponse.json(
        { 
          error: "Failed to create order with Qikink",
          details: result.error,
          order_id: orderNumber
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order_id: orderNumber,
      qikink_response: result.data,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Order creation error:", errorMessage);

    return NextResponse.json(
      { error: "Invalid request payload", details: errorMessage },
      { status: 400 }
    );
  }
}