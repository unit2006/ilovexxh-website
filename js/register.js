/**
 * ilovexxh 注册页面脚本
 * 
 * 这个文件提供注册页面的表单验证和交互功能
 */

// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取表单元素
    const registerForm = document.getElementById('registerForm');
    const accountNameInput = document.getElementById('accountName');
    const accountNameFeedback = document.getElementById('accountNameFeedback');
    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('emailFeedback');
    const passwordInput = document.getElementById('password');
    const passwordFeedback = document.getElementById('passwordFeedback');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');
    
    // 账号名验证
    if (accountNameInput) {
        accountNameInput.addEventListener('input', function() {
            validateAccountName(this.value);
        });
    }
    
    // 邮箱验证
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this.value);
        });
    }
    
    // 密码验证
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }
    
    // 确认密码验证
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validateConfirmPassword(this.value, passwordInput.value);
        });
    }
    
    // 表单提交验证
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            // 阻止默认提交行为
            event.preventDefault();
            
            // 获取表单数据
            const accountName = accountNameInput ? accountNameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
            
            // 验证所有字段
            const isAccountNameValid = validateAccountName(accountName);
            const isEmailValid = validateEmail(email);
            const isPasswordValid = validatePassword(password);
            const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);
            
            // 如果所有验证通过，提交表单
            if (isAccountNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
                // 使用本地存储认证系统注册用户
                registerUser(email, password, accountName)
                    .then(user => {
                        // 注册成功，显示成功消息
                        showSuccess('注册成功！正在跳转到首页...');
                        
                        // 延迟后跳转到首页
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    })
                    .catch(error => {
                        // 注册失败，显示错误消息
                        showError(error.message || '注册失败，请稍后再试');
                    });
            }
        });
    }
    
    /**
     * 验证账号名
     * @param {string} accountName - 账号名
     * @returns {boolean} - 验证是否通过
     */
    function validateAccountName(accountName) {
        // 清除之前的验证状态
        if (accountNameInput) {
            accountNameInput.classList.remove('is-valid', 'is-invalid');
        }
        
        // 账号名为空
        if (!accountName) {
            if (accountNameFeedback) {
                accountNameFeedback.textContent = '请输入账号名';
                accountNameFeedback.className = 'invalid-feedback';
            }
            if (accountNameInput) {
                accountNameInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 账号名长度验证
        if (accountName.length < 3 || accountName.length > 20) {
            if (accountNameFeedback) {
                accountNameFeedback.textContent = '账号名长度应为3-20个字符';
                accountNameFeedback.className = 'invalid-feedback';
            }
            if (accountNameInput) {
                accountNameInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 账号名格式验证（只允许字母、数字、下划线）
        const accountNameRegex = /^[a-zA-Z0-9_]+$/;
        if (!accountNameRegex.test(accountName)) {
            if (accountNameFeedback) {
                accountNameFeedback.textContent = '账号名只能包含字母、数字和下划线';
                accountNameFeedback.className = 'invalid-feedback';
            }
            if (accountNameInput) {
                accountNameInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 验证通过
        if (accountNameFeedback) {
            accountNameFeedback.textContent = '账号名格式正确！您的访问地址将是：https://deepseek.ilovexxh.com/' + accountName + '/文件名';
            accountNameFeedback.className = 'valid-feedback';
        }
        if (accountNameInput) {
            accountNameInput.classList.add('is-valid');
        }
        return true;
    }
    
    /**
     * 验证邮箱
     * @param {string} email - 邮箱
     * @returns {boolean} - 验证是否通过
     */
    function validateEmail(email) {
        // 清除之前的验证状态
        if (emailInput) {
            emailInput.classList.remove('is-valid', 'is-invalid');
        }
        
        // 邮箱为空
        if (!email) {
            if (emailFeedback) {
                emailFeedback.textContent = '请输入邮箱';
                emailFeedback.className = 'invalid-feedback';
            }
            if (emailInput) {
                emailInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (emailFeedback) {
                emailFeedback.textContent = '请输入有效的邮箱地址';
                emailFeedback.className = 'invalid-feedback';
            }
            if (emailInput) {
                emailInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 验证通过
        if (emailFeedback) {
            emailFeedback.textContent = '邮箱格式正确';
            emailFeedback.className = 'valid-feedback';
        }
        if (emailInput) {
            emailInput.classList.add('is-valid');
        }
        return true;
    }
    
    /**
     * 验证密码
     * @param {string} password - 密码
     * @returns {boolean} - 验证是否通过
     */
    function validatePassword(password) {
        // 清除之前的验证状态
        if (passwordInput) {
            passwordInput.classList.remove('is-valid', 'is-invalid');
        }
        
        // 密码为空
        if (!password) {
            if (passwordFeedback) {
                passwordFeedback.textContent = '请输入密码';
                passwordFeedback.className = 'invalid-feedback';
            }
            if (passwordInput) {
                passwordInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 密码长度验证
        if (password.length < 6) {
            if (passwordFeedback) {
                passwordFeedback.textContent = '密码长度不能少于6个字符';
                passwordFeedback.className = 'invalid-feedback';
            }
            if (passwordInput) {
                passwordInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 验证通过
        if (passwordFeedback) {
            passwordFeedback.textContent = '密码格式正确';
            passwordFeedback.className = 'valid-feedback';
        }
        if (passwordInput) {
            passwordInput.classList.add('is-valid');
        }
        return true;
    }
    
    /**
     * 验证确认密码
     * @param {string} confirmPassword - 确认密码
     * @param {string} password - 原密码
     * @returns {boolean} - 验证是否通过
     */
    function validateConfirmPassword(confirmPassword, password) {
        // 清除之前的验证状态
        if (confirmPasswordInput) {
            confirmPasswordInput.classList.remove('is-valid', 'is-invalid');
        }
        
        // 确认密码为空
        if (!confirmPassword) {
            if (confirmPasswordFeedback) {
                confirmPasswordFeedback.textContent = '请确认密码';
                confirmPasswordFeedback.className = 'invalid-feedback';
            }
            if (confirmPasswordInput) {
                confirmPasswordInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 两次密码不一致
        if (confirmPassword !== password) {
            if (confirmPasswordFeedback) {
                confirmPasswordFeedback.textContent = '两次输入的密码不一致';
                confirmPasswordFeedback.className = 'invalid-feedback';
            }
            if (confirmPasswordInput) {
                confirmPasswordInput.classList.add('is-invalid');
            }
            return false;
        }
        
        // 验证通过
        if (confirmPasswordFeedback) {
            confirmPasswordFeedback.textContent = '密码一致';
            confirmPasswordFeedback.className = 'valid-feedback';
        }
        if (confirmPasswordInput) {
            confirmPasswordInput.classList.add('is-valid');
        }
        return true;
    }
    
    /**
     * 显示成功消息
     * @param {string} message - 成功消息
     */
    function showSuccess(message) {
        const alertContainer = document.getElementById('alertContainer');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    function showError(message) {
        const alertContainer = document.getElementById('alertContainer');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});