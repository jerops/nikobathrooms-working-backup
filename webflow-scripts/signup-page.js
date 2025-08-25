setTimeout(() => {
    console.log('🎯 Setting up signup handlers with domain detection...');
    
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
    
    // Password toggle setup (same as login)
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
    
    // Signup button setup with domain-aware redirects
    const customerSignupBtn = document.getElementById('customer-signup-btn');
    if (customerSignupBtn) {
        customerSignupBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('📝 Customer signup attempt...');
            
            const name = document.getElementById('customer-name-input').value;
            const email = document.getElementById('customer-email-input').value;
            const password = document.getElementById('customer-password-input').value;
            
            try {
                const result = await window.NikoPIM.register(email, password, name, 'Customer');
                console.log('Signup result:', result);
                
                if (result.success) {
                    const redirectUrl = getRedirectUrl('Customer');
                    console.log('🚀 Redirecting to:', redirectUrl);
                    window.location.href = redirectUrl;
                } else {
                    console.error('Signup failed:', result.error);
                }
            } catch (error) {
                console.error('Signup error:', error);
            }
        });
    }
    
    const retailerSignupBtn = document.getElementById('retailer-signup-btn');
    if (retailerSignupBtn) {
        retailerSignupBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('📝 Retailer signup attempt...');
            
            const name = document.getElementById('retailer-name-input').value;
            const email = document.getElementById('retailer-email-input').value;
            const password = document.getElementById('retailer-password-input').value;
            
            try {
                const result = await window.NikoPIM.register(email, password, name, 'Retailer');
                console.log('Signup result:', result);
                
                if (result.success) {
                    const redirectUrl = getRedirectUrl('Retailer');
                    console.log('🚀 Redirecting to:', redirectUrl);
                    window.location.href = redirectUrl;
                } else {
                    console.error('Signup failed:', result.error);
                }
            } catch (error) {
                console.error('Signup error:', error);
            }
        });
    }
    
    console.log('✅ Domain-aware signup handlers ready');
    
}, 3000);