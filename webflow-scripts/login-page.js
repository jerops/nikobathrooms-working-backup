setTimeout(() => {
    console.log('🎯 Setting up login handlers with domain detection...');
    
    // DOMAIN-AWARE REDIRECT FUNCTION
    function getRedirectUrl(userType) {
        const isStaging = window.location.hostname.includes('webflow.io');
        const baseUrl = isStaging 
            ? 'https://nikobathrooms.webflow.io'
            : 'https://www.nikobathrooms.ie';
            
        console.log('🌐 Current domain:', window.location.hostname);
        console.log('📍 Environment:', isStaging ? 'STAGING' : 'PRODUCTION');
        console.log('🔗 Base URL:', baseUrl);
        
        return userType === 'Customer' 
            ? `${baseUrl}/dev/app/customer/dashboard`
            : `${baseUrl}/dev/app/retailer/dashboard`;
    }
    
    // Password toggle setup
    const toggleButtons = document.querySelectorAll('.input-visibility-toggle');
    toggleButtons.forEach(button => {
        const showIcon = button.querySelector('[wized="icon_show_password"]');
        const hideIcon = button.querySelector('[wized="icon_hide_password"]');
        const passwordInput = button.closest('.form_field-wrapper').querySelector('input[type="password"], input[type="text"]');
        
        if (passwordInput && showIcon && hideIcon) {
            hideIcon.style.display = 'none';
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    showIcon.style.display = 'none';
                    hideIcon.style.display = 'block';
                } else {
                    passwordInput.type = 'password';
                    showIcon.style.display = 'block';
                    hideIcon.style.display = 'none';
                }
            });
        }
    });
    
    // Login button setup with domain-aware redirects
    const customerLoginBtn = document.getElementById('customer-login-btn');
    if (customerLoginBtn) {
        customerLoginBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('🔐 Customer login attempt...');
            
            const email = document.getElementById('customer-email-input').value;
            const password = document.getElementById('customer-password-input').value;
            
            try {
                const result = await window.NikoPIM.login(email, password);
                console.log('Login result:', result);
                
                if (result.success) {
                    const redirectUrl = getRedirectUrl('Customer');
                    console.log('🚀 Redirecting to:', redirectUrl);
                    window.location.href = redirectUrl;
                } else {
                    console.error('Login failed:', result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }
    
    const retailerLoginBtn = document.getElementById('retailer-login-btn');
    if (retailerLoginBtn) {
        retailerLoginBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('🔐 Retailer login attempt...');
            
            const email = document.getElementById('retailer-email-input').value;
            const password = document.getElementById('retailer-password-input').value;
            
            try {
                const result = await window.NikoPIM.login(email, password);
                console.log('Login result:', result);
                
                if (result.success) {
                    const redirectUrl = getRedirectUrl('Retailer');
                    console.log('🚀 Redirecting to:', redirectUrl);
                    window.location.href = redirectUrl;
                } else {
                    console.error('Login failed:', result.error);
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }
    
    console.log('✅ Domain-aware login handlers ready');
    
}, 3000);