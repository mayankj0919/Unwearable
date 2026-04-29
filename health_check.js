const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
    console.log('--- Testing Supabase ---');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.from('products').select('*').limit(1);

        if (error) {
            console.error('Supabase Error:', error.message);
            return false;
        } else {
            console.log('Supabase SUCCESS: Connected and queried products table.');
            return true;
        }
    } catch (e) {
        console.error('Supabase Exception:', e.message);
        return false;
    }
}

async function testQikink() {
    console.log('\n--- Testing Qikink ---');
    const clientId = process.env.QIKINK_CLIENT_ID;
    const clientSecret = process.env.QIKINK_CLIENT_SECRET;
    const baseUrl = process.env.QIKINK_API_URL || "https://sandbox.qikink.com";

    try {
        const tokenUrl = `${baseUrl}/api/token`;
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
        if (!response.ok || !data.Accesstoken) {
            console.error('Qikink Error:', data.error || data.message || `Status: ${response.status}`);
            return false;
        } else {
            console.log('Qikink SUCCESS: Obtained access token from ' + (baseUrl.includes('sandbox') ? 'Sandbox' : 'Live') + ' API.');
            return true;
        }
    } catch (e) {
        console.error('Qikink Exception:', e.message);
        return false;
    }
}

async function testClerk() {
    console.log('\n--- Testing Clerk ---');
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!publishableKey || !secretKey) {
        console.error('Clerk Error: Keys are missing in .env.local');
        return false;
    }

    try {
        // Simple fetch to Clerk API to verify Secret Key
        const response = await fetch('https://api.clerk.com/v1/users?limit=1', {
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Clerk SUCCESS: Secret Key is valid and API is reachable.');
            return true;
        } else {
            const data = await response.json();
            console.error('Clerk Error:', data.errors?.[0]?.message || `Status: ${response.status}`);
            return false;
        }
    } catch (e) {
        console.error('Clerk Exception:', e.message);
        return false;
    }
}

async function run() {
    const s = await testSupabase();
    const q = await testQikink();
    const c = await testClerk();

    console.log('\n==============================');
    console.log(`FINAL REPORT:`);
    console.log(`Supabase: ${s ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Qikink:   ${q ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Clerk:    ${c ? '✅ WORKING' : '❌ FAILED'}`);
    console.log('==============================');
}

run();
