// Page Protection Script - Blocks access to protected pages for unconfirmed users
setTimeout(() => {
    console.log('🛡️ Initializing page protection...');
    
    // Wait for NikoPIM to be ready
    function waitForNikoPIM() {
        if (window.NikoPIM && window.NikoPIM.getCurrentUser) {
            checkUserAccess();
        } else {
            setTimeout(waitForNikoPIM, 100);
        }
    }
    
    async function checkUserAccess() {
        try {
            console.log('🔍 Checking user authentication status...');
            
            // Get current user from NikoPIM
            const currentUser = window.NikoPIM.getCurrentUser();
            
            if (!currentUser) {
                console.log('❌ No authenticated user - redirecting to login');
                redirectToLogin();
                return;
            }
            
            console.log('✅ User authenticated:', currentUser.email);
            console.log('📧 Email confirmed:', currentUser.email_confirmed_at ? 'Yes' : 'No');
            
            // Check if email is confirmed
            if (!currentUser.email_confirmed_at) {
                console.log('⚠️ Email not confirmed - blocking access');
                showEmailNotConfirmedMessage();
                return;
            }
            
            console.log('🎉 Access granted - user has confirmed email');
            
        } catch (error) {
            console.error('🚨 Error checking user access:', error);
            redirectToLogin();
        }
    }
    
    function redirectToLogin() {
        const isStaging = window.location.hostname.includes('webflow.io');
        const baseUrl = isStaging 
            ? 'https://nikobathrooms.webflow.io'
            : 'https://www.nikobathrooms.ie';
        
        window.location.href = `${baseUrl}/dev/app/auth/log-in`;
    }
    
    function showEmailNotConfirmedMessage() {
        // Hide page content
        document.body.style.opacity = '0.3';
        document.body.style.pointerEvents = 'none';
        
        // Create overlay message
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        
        const message = document.createElement('div');
        message.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        message.innerHTML = `
            <h2 style="color: #e74c3c; margin-bottom: 20px;">🔒 Email Confirmation Required</h2>
            <p style="margin-bottom: 20px; line-height: 1.5;">
                Please confirm your email address before accessing this page.<br>
                Check your inbox for the confirmation link.
            </p>
            <button onclick="window.location.href='${getLoginUrl()}'" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
            ">Back to Login</button>
            <button onclick="window.NikoPIM.logout().then(() => window.location.href='${getLoginUrl()}')" style="
                background: #95a5a6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
            ">Logout</button>
        `;
        
        overlay.appendChild(message);
        document.body.appendChild(overlay);
    }
    
    function getLoginUrl() {
        const isStaging = window.location.hostname.includes('webflow.io');
        const baseUrl = isStaging 
            ? 'https://nikobathrooms.webflow.io'
            : 'https://www.nikobathrooms.ie';
        
        return `${baseUrl}/dev/app/auth/log-in`;
    }
    
    waitForNikoPIM();
    
}, 1000); // Slightly faster than form handlers to check protection first