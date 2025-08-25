setTimeout(() => {
    console.log('Setting up signup handlers with Webflow modal...');
    
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
    
    // Function to show your Webflow confirmation modal
    function showWebflowConfirmationModal(email, userType) {
        // Find your modal component
        const modal = document.querySelector('[niko-data], .main-confirmation-modal_component');
        
        if (modal) {
            // Update modal content to show success message instead of contact form
            const titleElement = modal.querySelector('h2');
            const descriptionElement = modal.querySelector('p');
            const formWrapper = modal.querySelector('.main-confirmation-modal_form_component');
            
            if (titleElement) {
                titleElement.textContent = 'Account Created Successfully!';
            }
            
            if (descriptionElement) {
                descriptionElement.innerHTML = `Welcome to <strong>Niko Bathrooms</strong>!<br>We've sent a confirmation email to <strong>${email}</strong><br><br>Please check your email and click the confirmation link to activate your ${userType.toLowerCase()} account.`;
            }
            
            // Hide the form and show success content
            if (formWrapper) {
                formWrapper.style.display = 'none';
            }
            
            // Show the modal
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            
            // Add close functionality
            const closeButton = modal.querySelector('.main-confirmation-modal_close-button');
            const overlay = modal.querySelector('.main-confirmation-modal_background-overlay');
            
            const closeModal = () => {
                modal.style.display = 'none';
                modal.style.opacity = '0';
                // Reset form visibility for next time
                if (formWrapper) formWrapper.style.display = 'block';
            };
            
            if (closeButton) {
                closeButton.addEventListener('click', closeModal);
            }
            
            if (overlay) {
                overlay.addEventListener('click', closeModal);
            }
        }
    }
    
    // Show error message function
    function showErrorMessage(message) {
        const errorElement = document.querySelector('.w--tab-active .error-text');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.parentElement.parentElement.style.display = 'block';
        }
    }
    
    // Signup button setup with Webflow modal
    const customerSignupBtn = document.getElementById('customer-signup-btn');
    if (customerSignupBtn) {
        customerSignupBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Customer signup attempt...');
            
            const name = document.getElementById('customer-name-input').value;
            const email = document.getElementById('customer-email-input').value;
            const password = document.getElementById('customer-password-input').value;
            
            try {
                const result = await window.NikoPIM.register(email, password, name, 'Customer');
                console.log('Signup result:', result);
                
                if (result.success) {
                    showWebflowConfirmationModal(email, 'Customer');
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
            console.log('Retailer signup attempt...');
            
            const name = document.getElementById('retailer-name-input').value;
            const email = document.getElementById('retailer-email-input').value;
            const password = document.getElementById('retailer-password-input').value;
            
            try {
                const result = await window.NikoPIM.register(email, password, name, 'Retailer');
                console.log('Signup result:', result);
                
                if (result.success) {
                    showWebflowConfirmationModal(email, 'Retailer');
                } else {
                    showErrorMessage(result.error);
                }
            } catch (error) {
                console.error('Signup error:', error);
                showErrorMessage('Registration failed. Please try again.');
            }
        });
    }
    
    console.log('Domain-aware signup handlers with Webflow modal ready');
    
}, 3000);