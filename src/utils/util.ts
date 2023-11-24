const validatePassword = (_rule: any, value: any, callback: any, form) => {
    console.log(`value = ${value}`, `password = ${form.password}`)
    if (value == '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== form.password) {
        callback(new Error('两次输入的密码不一致，请重新输入'))
    } else {
        callback()
    }
}

export { validatePassword }