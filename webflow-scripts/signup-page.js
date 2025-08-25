setTimeout(() => {
    console.log('🎯 Setting up signup handlers with Webflow popup...');
    
    // DOMAIN-AWARE REDIRECT FUNCTION (for confirmed users)
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
    
    // Create Webflow-styled success popup
    function showWebflowSuccessPopup(email, userType) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            backdrop-filter: blur(4px);
        `;
        
        // Create popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            max-width: 480px;
            margin: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slideIn 0.3s ease-out;
            position: relative;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        popup.innerHTML = `
            <div style="
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #10B981, #059669);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                font-size: 28px;
            ">✅</div>
            
            <h2 style="
                margin: 0 0 16px;
                font-size: 24px;
                font-weight: 600;
                color: #111827;
                line-height: 1.2;
            ">Account Created Successfully!</h2>
            
            <p style="
                margin: 0 0 24px;
                font-size: 16px;
                color: #6B7280;
                line-height: 1.5;
            ">
                Welcome to <strong>Niko Bathrooms</strong>!<br>
                We've sent a confirmation email to<br>
                <strong style="color: #10B981;">${email}</strong>
            </p>
            
            <div style="
                background: #F3F4F6;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 24px;
                border-left: 4px solid #10B981;
            ">
                <p style="
                    margin: 0;
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.4;
                ">
                    📧 <strong>Please check your email</strong> and click the confirmation link to activate your ${userType.toLowerCase()} account.
                </p>
            </div>
            
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: linear-gradient(135deg, #10B981, #059669);
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            " 
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 8px -1px rgba(0, 0, 0, 0.15)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
            >Got it!</button>
            
            <p style="
                margin: 20px 0 0;
                font-size: 12px;
                color: #9CA3AF;
            ">
                Didn't receive the email? Check your spam folder.
            </p>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
    
    // Show error message function
    function showErrorMessage(message) {
        const errorElement = document.querySelector('.w--tab-active .error-text');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.parentElement.parentElement.style.display = 'block';
        }
    }
    
    // Signup button setup with Webflow popup
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
                    // Show beautiful Webflow-styled popup instead of redirect
                    showWebflowSuccessPopup(email, 'Customer');
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
                    // Show beautiful Webflow-styled popup instead of redirect
                    showWebflowSuccessPopup(email, 'Retailer');
                } else {
                    showErrorMessage(result.error);
                }
            } catch (error) {
                console.error('Signup error:', error);
                showErrorMessage('Registration failed. Please try again.');
            }
        });
    }
    
    console.log('✅ Domain-aware signup handlers with Webflow popup ready');
    
}, 3000);