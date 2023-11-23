<template>
    <div style="text-align: center; margin: 0 20px;">
        <div style="margin-top: 100px;">
            <div style="font-size: 25px; font-weight: bold;">注册新用户</div>
            <div style="font-size: 14px; font-weight: grey;">欢迎注册我们的平台系统，请在下方填写相关信息。</div>
        </div>
        <div style="margin-top: 50px;">
            <el-form :model="form" :rules="rule" ref="formRef">
                <el-form-item prop="username">
                    <el-input v-model="form.username" maxlength="10" type="text" placeholder="请输入用户">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" maxlength="20" type="password" placeholder="请输入密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password_repeat">
                    <el-input v-model="form.password_repeat" maxlength="20" type="password" placeholder="请再次输入密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="form.email" type="text" placeholder="请输入电子邮件">
                        <template #prefix>
                            <el-icon>
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row :gutter="15" style="width: 100%;">
                        <el-col :span="17">
                            <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                                <template #prefix>
                                    <el-icon>
                                        <EditPen />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="success" @click="askCOde" :disabled="!isEmailValid || coldTime">
                                {{ coldTime > 0 ? `请稍后，${coldTime} 秒` : '获取验证码' }}
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 20px;">
            <el-button style="width: 270px;" type="warning" @click="register" plain>立即注册</el-button>
        </div>
        <div style="margin-top: 20px;">
            <span style="font-size: 14px; line-height: 15px; color: gray;">已有账号？</span>
            <el-link style="translate: 0 -1px;" @click="router.push('/')">立即登录</el-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { User, Lock, Message, EditPen } from '@element-plus/icons-vue'
import router from '@/router'
import { get, post } from '@/net'
import { ElMessage } from 'element-plus';

const form = reactive({
    username: '',
    password: '',
    password_repeat: '',
    email: '',
    code: '',
})

const validateUsername = (_rule: any, value: any, callback: any) => {
    if (value == '') {
        callback(new Error('请输入用户名'))
    } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('用户名不能包含特殊字符，只能由中英文、数字、中文组成'))
    } else {
        callback()
    }
}

const validatePassword = (_rule: any, value: any, callback: any) => {
    if (value == '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== form.password) {
        callback(new Error('两次输入的密码不一致，请重新输入'))
    } else {
        callback()
    }
}

const rule = {
    username: [
        { validator: validateUsername, trigger: ['blur', 'change'] },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: ['blur', 'change'] }
    ],
    password_repeat: [
        { validator: validatePassword, trigger: ['blur', 'change'] },
    ],
    email: [
        { required: true, message: '请输入邮件地址', trigger: 'blur' },
        { type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入获取的验证码', trigger: 'blur' },
    ],
}

const coldTime = ref(0);

const isEmailValid = computed(() => {
    return /^[\w.-]+@[\w.-]+\.\w+$/.test(form.email);
})

function askCOde() {
    coldTime.value = 10;
    get(`/api/auth/ask-code?email=${form.email}&type=register`, () => {
        ElMessage.success(`验证码已发送到邮箱：${form.email}，请查收`);
        const handel = setInterval(() => {
            coldTime.value--;
            if (coldTime.value == 0) {
                clearInterval(handel)
            }
        }, 1000)
    }, (message) => {
        ElMessage.error(message);
        coldTime.value = 0;
    })
}

const formRef = ref();

function register() {
    formRef.value.validate((valid: any) => {
        if (valid) {
            post(`/api/auth/register`, { ...form }, () => {
                ElMessage.success('注册成功，请登录');
                router.push('/');
            })
        } else {
            ElMessage.error('请完整填写表单');
        }
    }
    )
}

</script>

<style scoped></style>