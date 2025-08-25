setTimeout(() => {
    console.log('🎯 Setting up signup handlers with email confirmation flow...');
    
    // DOMAIN-AWARE REDIRECT FUNCTION
    function getRedirectUrl(userType) {
        const isStaging = window.location.hostname.includes('webflow.io');
        const baseUrl = isStaging 
            ? 'https://nikobathrooms.webflow.io'
            : 'https://www.nikobathrooms.ie';
            
        console.log('🌐 Current domain:', window.location.hostname);
        console.log('📍 Environment:', isStaging ? 'STAGING' : 'PRODUCTION');
        console.log('🔗 Base URL:', baseUrl);
        
        // For new signups, redirect to email confirmation page instead of dashboard
        return `${baseUrl}/dev/app/auth/confirm-email`;
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
    
    // Show success message function
    function showSuccessMessage(message) {
        // Try to find existing success element or create one
        let successElement = document.querySelector('.success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            successElement.style.cssText = `
                background: #d4edda;
                color: #155724;
                padding: 12px;
                border-radius: 4px;
                margin: 10px 0;
                border: 1px solid #c3e6cb;
            `;
            document.querySelector('.w--tab-active').prepend(successElement);
        }
        successElement.innerHTML = message;
        successElement.style.display = 'block';
    }
    
    // Show error message function
    function showErrorMessage(message) {
        const errorElement = document.querySelector('.w--tab-active .error-text');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.parentElement.parentElement.style.display = 'block';
        }
    }
    
    // Signup button setup with email confirmation flow
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
                    // Instead of redirecting to dashboard, show confirmation message
                    showSuccessMessage(`
                        ✅ Account created successfully!<br>
                        📧 Please check your email (<strong>${email}</strong>) and click the confirmation link.<br>
                        🔒 You'll be able to log in after confirming your email.
                    `);
                    
                    // Optional: Redirect to confirmation page after a delay
                    setTimeout(() => {
                        const redirectUrl = getRedirectUrl('Customer');
                        console.log('🚀 Redirecting to confirmation page:', redirectUrl);
                        window.location.href = redirectUrl;
                    }, 3000);
                    
                } else {
                    showErrorMessage(result.error);
                }
            } catch (error) {
                console.error('Signup error:', error);
                showErrorMessage('Registration failed. Please try again.');
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
                    // Instead of redirecting to dashboard, show confirmation message
                    showSuccessMessage(`
                        ✅ Account created successfully!<br>
                        📧 Please check your email (<strong>${email}</strong>) and click the confirmation link.<br>
                        🔒 You'll be able to log in after confirming your email.
                    `);
                    
                    // Optional: Redirect to confirmation page after a delay
                    setTimeout(() => {
                        const redirectUrl = getRedirectUrl('Retailer');
                        console.log('🚀 Redirecting to confirmation page:', redirectUrl);
                        window.location.href = redirectUrl;
                    }, 3000);
                    
                } else {
                    showErrorMessage(result.error);
                }
            } catch (error) {
                console.error('Signup error:', error);
                showErrorMessage('Registration failed. Please try again.');
            }
        });
    }
    
    console.log('✅ Domain-aware signup handlers with email confirmation ready');
    
}, 3000);