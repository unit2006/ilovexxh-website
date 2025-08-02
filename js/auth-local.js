/**
 * ilovexxh 本地存储认证系统
 * 
 * 这个文件提供基于localStorage的用户认证功能，包括：
 * - 用户注册
 * - 用户登录
 * - Google登录模拟
 * - 用户资料管理
 * - 会话管理
 */

// 存储键名常量
const STORAGE_KEYS = {
    USERS: 'ilovexxh_users',
    CURRENT_USER: 'ilovexxh_current_user'
};

/**
 * 注册新用户
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @param {string} username - 用户名
 * @param {Object} additionalInfo - 额外的用户信息
 * @returns {Promise<Object>} - 返回用户对象（不包含密码）
 */
function registerUser(email, password, username, additionalInfo = {}) {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            try {
                // 验证输入
                if (!email || !password) {
                    throw new Error('邮箱和密码不能为空');
                }
                
                if (password.length < 6) {
                    throw new Error('密码长度不能少于6个字符');
                }
                
                // 获取现有用户
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                
                // 检查邮箱是否已被使用
                if (users.some(user => user.email === email)) {
                    throw new Error('该邮箱已被注册');
                }
                
                // 创建用户对象（使用简单的哈希处理密码）
                const newUser = {
                    id: generateUserId(),
                    email,
                    password: hashPassword(password), // 对密码进行哈希处理
                    username: username || email.split('@')[0],
                    createdAt: new Date().toISOString(),
                    ...additionalInfo
                };
                
                // 保存用户
                users.push(newUser);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                
                // 自动登录
                const userWithoutPassword = { ...newUser };
                delete userWithoutPassword.password;
                
                // 保存当前用户会话
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
                
                resolve(userWithoutPassword);
            } catch (error) {
                reject(error);
            }
        }, 800); // 模拟网络延迟
    });
}

/**
 * 用户登录
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} - 返回用户对象（不包含密码）
 */
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            try {
                // 验证输入
                if (!email || !password) {
                    throw new Error('邮箱和密码不能为空');
                }
                
                // 获取用户
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                const user = users.find(u => u.email === email);
                
                // 检查用户是否存在
                if (!user) {
                    throw new Error('用户不存在');
                }
                
                // 验证密码（使用哈希比较）
                if (user.password !== hashPassword(password)) {
                    throw new Error('密码错误');
                }
                
                // 登录成功
                const userWithoutPassword = { ...user };
                delete userWithoutPassword.password;
                
                // 保存当前用户会话
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
                
                resolve(userWithoutPassword);
            } catch (error) {
                reject(error);
            }
        }, 800); // 模拟网络延迟
    });
}

/**
 * 使用Google账号登录（模拟）
 * @returns {Promise<Object>} - 返回用户对象
 */
function loginWithGoogle() {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            try {
                // 模拟Google登录过程
                const randomId = Math.random().toString(36).substring(2, 15);
                const randomName = `user_${randomId.substring(0, 5)}`;
                const googleEmail = `${randomName}@gmail.com`;
                
                // 获取现有用户
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                let user = users.find(u => u.email === googleEmail);
                
                // 如果用户不存在，创建新用户
                if (!user) {
                    user = {
                        id: generateUserId(),
                        email: googleEmail,
                        username: randomName,
                        createdAt: new Date().toISOString(),
                        provider: 'google',
                        displayName: `Google用户 ${randomName}`
                    };
                    
                    // 保存用户
                    users.push(user);
                    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                }
                
                // 保存当前用户会话
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
                
                resolve(user);
            } catch (error) {
                reject(new Error('Google登录失败，请稍后再试'));
            }
        }, 1200); // 模拟较长的网络延迟
    });
}

/**
 * 获取当前登录用户
 * @returns {Object|null} - 返回当前用户对象，如果未登录则返回null
 */
function getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * 退出登录
 * @returns {Promise<void>}
 */
function logoutUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            resolve();
        }, 300);
    });
}

/**
 * 更新用户资料
 * @param {Object} profileData - 要更新的资料数据
 * @returns {Promise<Object>} - 返回更新后的用户对象
 */
function updateUserProfile(profileData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 获取当前用户
                const currentUser = getCurrentUser();
                if (!currentUser) {
                    throw new Error('用户未登录');
                }
                
                // 获取所有用户
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                
                if (userIndex === -1) {
                    throw new Error('用户不存在');
                }
                
                // 更新用户资料
                const updatedUser = {
                    ...users[userIndex],
                    ...profileData,
                    updatedAt: new Date().toISOString()
                };
                
                // 不允许更新某些字段
                if (profileData.id) delete updatedUser.id;
                if (profileData.email) delete updatedUser.email;
                if (profileData.createdAt) delete updatedUser.createdAt;
                
                // 保存更新后的用户
                users[userIndex] = updatedUser;
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                
                // 更新当前用户会话
                const userWithoutPassword = { ...updatedUser };
                delete userWithoutPassword.password;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
                
                resolve(userWithoutPassword);
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}

/**
 * 生成唯一用户ID
 * @returns {string} - 唯一ID
 */
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

/**
 * 对密码进行简单的哈希处理
 * 注意：这只是一个简单的哈希实现，不适用于生产环境
 * 生产环境应使用bcrypt等专业的哈希算法
 * 
 * @param {string} password - 原始密码
 * @returns {string} - 哈希后的密码
 */
function hashPassword(password) {
    // 一个简单的哈希函数
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    // 添加一个固定的盐值（实际应用中应该为每个用户使用不同的盐值）
    const salt = "ilovexxh_salt_2025";
    const saltedHash = hash + salt;
    
    // 再次哈希
    let finalHash = 0;
    for (let i = 0; i < saltedHash.length; i++) {
        const char = saltedHash.charCodeAt(i);
        finalHash = ((finalHash << 5) - finalHash) + char;
        finalHash = finalHash & finalHash;
    }
    
    // 转换为十六进制字符串
    return finalHash.toString(16);
}

/**
 * 检查用户是否已登录
 * @returns {boolean} - 是否已登录
 */
function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * 重定向未登录用户
 * @param {string} redirectUrl - 重定向URL
 */
function redirectIfNotLoggedIn(redirectUrl = 'login.html') {
    if (!isUserLoggedIn()) {
        window.location.href = redirectUrl;
    }
}

/**
 * 重定向已登录用户
 * @param {string} redirectUrl - 重定向URL
 */
function redirectIfLoggedIn(redirectUrl = 'index.html') {
    if (isUserLoggedIn()) {
        window.location.href = redirectUrl;
    }
}