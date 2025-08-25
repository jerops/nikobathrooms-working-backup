// Email Confirmation Handler - Handles users returning from email confirmation
// This script should run on a dedicated confirmation landing page

setTimeout(() => {
    console.log('📧 Email confirmation handler loading...');
    
    // Wait for NikoPIM to be ready
    function waitForNikoPIM() {
        if (window.NikoPIM && window.NikoPIM.getCurrentUser) {
            handleEmailConfirmation();
        } else {
            setTimeout(waitForNikoPIM, 100);
        }
    }
    
    async function handleEmailConfirmation() {
        try {
            console.log('🔍 Checking confirmation status...');
            
            // Check URL for confirmation tokens (Supabase adds these)
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get('access_token');
            const refreshToken = urlParams.get('refresh_token');
            const type = urlParams.get('type');
            
            if (type === 'signup' && accessToken) {
                console.log('✅ Email confirmation detected');
                
                // Wait a moment for Supabase to process the tokens
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Get the confirmed user
                const currentUser = window.NikoPIM.getCurrentUser();
                
                if (currentUser) {
                    console.log('👤 Confirmed user:', currentUser.email);
                    console.log('🔍 User metadata:', currentUser.user_metadata);
                    
                    // Get user role from metadata
                    const userRole = currentUser.user_metadata?.user_type || 
                                   currentUser.user_metadata?.role || 
                                   'Customer';
                    
                    console.log('🎭 User role:', userRole);
                    
                    // Show success message
                    showSuccessMessage(userRole);
                    
                    // Redirect to appropriate dashboard after delay
                    setTimeout(() => {
                        const redirectUrl = getDashboardUrl(userRole);
                        console.log('🚀 Redirecting to dashboard:', redirectUrl);
                        window.location.href = redirectUrl;
                    }, 3000);
                    
                } else {
                    console.log('⚠️ No user found after confirmation');
                    showErrorAndRedirect('Confirmation successful, please log in.');
                }
            } else {
                console.log('ℹ️ No confirmation tokens found, checking if user is already confirmed');
                
                // Check if user is already logged in and confirmed
                const currentUser = window.NikoPIM.getCurrentUser();
                if (currentUser && currentUser.email_confirmed_at) {
                    const userRole = currentUser.user_metadata?.user_type || 
                                   currentUser.user_metadata?.role || 
                                   'Customer';
                    const redirectUrl = getDashboardUrl(userRole);
                    window.location.href = redirectUrl;
                } else {
                    showErrorAndRedirect('Please log in to continue.');
                }
            }
            
        } catch (error) {
            console.error('❌ Error handling confirmation:', error);
            showErrorAndRedirect('Something went wrong. Please try logging in.');
        }
    }
    
    function getDashboardUrl(userRole) {
        const isStaging = window.location.hostname.includes('webflow.io');
        const baseUrl = isStaging 
            ? 'https://nikobathrooms.webflow.io'
            : 'https://www.nikobathrooms.ie';
        
        return userRole === 'Customer' 
            ? `${baseUrl}/dev/app/customer/dashboard`
            : `${baseUrl}/dev/app/retailer/dashboard`;
    }
    
    function getLoginUrl() {
        const isStaging = window.location.hostname.includes('webflow.io');
        const baseUrl = isStaging 
            ? 'https://nikobathrooms.webflow.io'
            : 'https://www.nikobathrooms.ie';
        
        return `${baseUrl}/dev/app/auth/log-in`;
    }
    
    function showSuccessMessage(userRole) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                background: #f8f9fa;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
                    <h2 style="color: #27ae60; margin-bottom: 20px;">Email Confirmed!</h2>
                    <p style="margin-bottom: 30px; line-height: 1.5; color: #555;">
                        Welcome to Niko Bathrooms!<br>
                        Your ${userRole.toLowerCase()} account is now active.
                    </p>
                    <p style="color: #888; font-size: 14px;">
                        Redirecting to your dashboard in 3 seconds...
                    </p>
                </div>
            </div>
        `;
    }
    
    function showErrorAndRedirect(message) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                background: #f8f9fa;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                    <h2 style="color: #e74c3c; margin-bottom: 20px;">Confirmation Issue</h2>
                    <p style="margin-bottom: 30px; line-height: 1.5; color: #555;">
                        ${message}
                    </p>
                    <button onclick="window.location.href='${getLoginUrl()}'" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Go to Login</button>
                </div>
            </div>
        `;
    }
    
    waitForNikoPIM();
    
}, 500);