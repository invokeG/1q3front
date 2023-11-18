import axios from 'axios'
import { ElMessage } from 'element-plus'

const authItemName: string = "access_token";

const defaultFaliure = (message: string, code: number, url: string) => {
    console.warn(`请求地址：${url}，状态码：${code}，错误信息：${message}`);
    ElMessage.warning(message);
}

const defaultError = (err: any) => {
    console.error(err);
    ElMessage.warning("发生了一些错误，请联系管理员");
}

function storeAccessToken(token: string, remember: boolean, expire: any) {
    const authObj = {
        token: token,
        expire: expire,
    }
    const str: string = JSON.stringify(authObj);
    if (remember) {
        localStorage.setItem(authItemName, str);
    } else {
        sessionStorage.setItem(authItemName, str);
    }
}

function getAccessToken() {
    const str: string = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
    if(!str) return null
    const authObj = JSON.parse(str)
    console.log(authObj.expire)
    if(new Date(authObj.expire) <= new Date()) { //new Date(authObj.expire) <= new Date()
        deleteAccessToken()
        ElMessage.warning("登录过期，请重新登录")
        return null
    }
    return authObj.token

    // if (new Date(authObj.expire) > new Date()) {
    //     return authObj.token;
    // }
    // deleteAccessToken();
    // ElMessage.warning("登录过期，请重新登录");
    // return null;
    

    // const str: string = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
    // if (str) {
    //     const authObj = JSON.parse(str);
    //     if (new Date(authObj.expire) > new Date()) {
    //         return authObj.token;
    //     } else {
    //         deleteAccessToken();
    //         ElMessage.warning("登录过期，请重新登录");
    //         return null;
    //     }
    // }
    // return null;
}

function deleteAccessToken() {
    localStorage.removeItem(authItemName);
    sessionStorage.removeItem(authItemName);
}

function getHeader() {
    const token = getAccessToken();
    return token ? {
        'Authrization': `Bearer ${getAccessToken()}`
    } : {};
}

function internalPost(url: string, data: any, header: any, success: any, failure: Function, error = defaultError) {
    axios.post(url, data, { headers: header }).then(({ data }) => {
        if (data.code == 200) {
            success(data.data)
        } else {
            failure(data.message, data.code, url)
        }
    }).catch((err) => {
        error(err)
    })
}

function internalGet(url: string, header: any, success: any, failure: Function, error = defaultError) {
    axios.get(url, { headers: header }).then(({ data }) => {
        if (data.code == 200) {
            success(data.data)
        } else {
            failure(data.message, data.code, url);
        }
    }).catch((err) => {
        error(err);
    })
}

function get(url: string, success: any, failure = defaultFaliure) {
    internalGet(url, getHeader(), success, failure);
}

function post(url: string, data: any, success: any, failure = defaultFaliure) {
    internalPost(url, data, getHeader(), success, failure);
}

function login(username: string, password: string, remember: boolean, success: any, failure = defaultFaliure) {
    internalPost("/api/auth/login", {
        username: username,
        password: password,
    }, {
        "Content-Type": "application/x-www-form-urlencoded"
    }, (data) => {
        console.log(data)
        storeAccessToken(data.token, remember, data.expire);
        ElMessage.success(`登录成功，欢迎 ${data.username} 来到我们的系统`);
        success(data);
    }, failure)
}

function logout(success: any, failure = defaultFaliure) {
    get("/api/auth/logout", () => {
        deleteAccessToken();
        ElMessage.success("退出成功");
        success();
    }, failure)
}

function unauthorized() {
    return !getAccessToken();
}

export { login, logout, get, post, unauthorized }

