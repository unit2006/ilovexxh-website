// Firebase 配置
// 请将下面的配置替换为您从Firebase控制台获取的实际配置
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_ACTUAL_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_ACTUAL_PROJECT_ID",
    storageBucket: "YOUR_ACTUAL_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 获取 Firebase 服务引用
const auth = firebase.auth();
const db = firebase.firestore();

/**
 * 注册新用户
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @param {string} username - 用户名
 * @returns {Promise} - 包含用户信息的Promise
 */
function registerUser(email, password, username) {
    // 创建用户
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // 获取用户
            const user = userCredential.user;
            
            // 更新用户资料
            return user.updateProfile({
                displayName: username
            }).then(() => {
                // 在Firestore中创建用户文档
                return db.collection('users').doc(user.uid).set({
                    username: username,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    authProvider: 'email'
                });
            }).then(() => {
                return user;
            });
        });
}

/**
 * 用户登录
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise} - 包含用户信息的Promise
 */
function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

/**
 * 用户登出
 * @returns {Promise} - 登出操作的Promise
 */
function logoutUser() {
    return auth.signOut();
}

/**
 * 检查用户认证状态
 * @param {Function} callback - 状态变化时的回调函数
 */
function checkAuthState(callback) {
    auth.onAuthStateChanged(callback);
}

/**
 * 获取当前登录用户
 * @returns {Object|null} - 当前用户对象或null
 */
function getCurrentUser() {
    return auth.currentUser;
}

/**
 * 重置密码
 * @param {string} email - 用户邮箱
 * @returns {Promise} - 重置密码操作的Promise
 */
function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
}

/**
 * 更新用户资料
 * @param {Object} profileData - 要更新的资料数据
 * @returns {Promise} - 更新操作的Promise
 */
function updateUserProfile(profileData) {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error('用户未登录'));
    
    const updates = {};
    
    // 更新Firebase Auth用户资料
    const authUpdates = {};
    if (profileData.displayName) authUpdates.displayName = profileData.displayName;
    if (profileData.photoURL) authUpdates.photoURL = profileData.photoURL;
    
    // 更新Firestore中的用户数据
    if (profileData.username) updates.username = profileData.username;
    if (profileData.bio) updates.bio = profileData.bio;
    if (profileData.website) updates.website = profileData.website;
    
    // 更新时间戳
    updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    
    return Promise.all([
        Object.keys(authUpdates).length > 0 ? user.updateProfile(authUpdates) : Promise.resolve(),
        Object.keys(updates).length > 0 ? db.collection('users').doc(user.uid).update(updates) : Promise.resolve()
    ]);
}

/**
 * 获取用户资料
 * @param {string} userId - 用户ID
 * @returns {Promise} - 包含用户资料的Promise
 */
function getUserProfile(userId) {
    return db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                throw new Error('用户资料不存在');
            }
        });
}

/**
 * 更新用户邮箱
 * @param {string} newEmail - 新邮箱地址
 * @param {string} password - 当前密码（用于重新验证）
 * @returns {Promise} - 更新操作的Promise
 */
function updateUserEmail(newEmail, password) {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error('用户未登录'));
    
    // 重新验证用户
    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email, 
        password
    );
    
    return user.reauthenticateWithCredential(credential)
        .then(() => {
            // 更新邮箱
            return user.updateEmail(newEmail);
        })
        .then(() => {
            // 更新Firestore中的邮箱
            return db.collection('users').doc(user.uid).update({
                email: newEmail,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
}

/**
 * 更新用户密码
 * @param {string} currentPassword - 当前密码
 * @param {string} newPassword - 新密码
 * @returns {Promise} - 更新操作的Promise
 */
function updateUserPassword(currentPassword, newPassword) {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error('用户未登录'));
    
    // 重新验证用户
    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email, 
        currentPassword
    );
    
    return user.reauthenticateWithCredential(credential)
        .then(() => {
            // 更新密码
            return user.updatePassword(newPassword);
        });
}

/**
 * 删除用户账号
 * @param {string} password - 当前密码（用于重新验证）
 * @returns {Promise} - 删除操作的Promise
 */
function deleteUserAccount(password) {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error('用户未登录'));
    
    // 重新验证用户
    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email, 
        password
    );
    
    return user.reauthenticateWithCredential(credential)
        .then(() => {
            // 删除Firestore中的用户数据
            return db.collection('users').doc(user.uid).delete();
        })
        .then(() => {
            // 删除用户账号
            return user.delete();
        });
}