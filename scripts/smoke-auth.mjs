const baseUrl = process.env.APP_URL || "http://localhost:3000";

async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, options);
    return response;
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function parseCookie(setCookieHeader, key) {
    if (!setCookieHeader) return null;
    const parts = setCookieHeader.split(";")[0].split("=");
    if (parts[0] !== key) return null;
    return `${parts[0]}=${parts.slice(1).join("=")}`;
}

async function run() {
    console.log(`Running auth smoke tests on ${baseUrl}`);

    const loginPage = await request("/login");
    assert(loginPage.status === 200, `Expected /login 200, got ${loginPage.status}`);

    const dashboardAnon = await request("/dashboard", { redirect: "manual" });
    assert(dashboardAnon.status === 307, `Expected /dashboard redirect for anon, got ${dashboardAnon.status}`);

    const authRes = await request("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: process.env.DEMO_ADMIN_EMAIL || "admin@eskooly.com",
            password: process.env.DEMO_ADMIN_PASSWORD || "admin123",
        }),
    });

    assert(authRes.status === 200, `Expected /api/auth 200, got ${authRes.status}`);
    const setCookie = authRes.headers.get("set-cookie");
    const authCookie = parseCookie(setCookie, "auth_token");
    assert(authCookie, "Expected auth_token cookie from /api/auth");

    const dashboardAuth = await request("/dashboard", {
        headers: { Cookie: authCookie },
        redirect: "manual",
    });
    assert(dashboardAuth.status === 200, `Expected /dashboard 200 for auth user, got ${dashboardAuth.status}`);

    const studentsAuth = await request("/api/students", {
        headers: { Cookie: authCookie },
    });
    assert(studentsAuth.status === 200, `Expected /api/students 200 for auth user, got ${studentsAuth.status}`);

    const logout = await request("/api/auth/logout", {
        method: "POST",
        headers: { Cookie: authCookie },
    });
    assert(logout.status === 200, `Expected /api/auth/logout 200, got ${logout.status}`);

    const logoutSetCookie = logout.headers.get("set-cookie");
    const clearedCookie = parseCookie(logoutSetCookie, "auth_token");

    const dashboardAfterLogout = await request("/dashboard", {
        headers: clearedCookie ? { Cookie: clearedCookie } : {},
        redirect: "manual",
    });
    assert(
        dashboardAfterLogout.status === 307,
        `Expected /dashboard redirect after logout, got ${dashboardAfterLogout.status}`
    );

    console.log("Auth smoke tests passed.");
}

run().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
