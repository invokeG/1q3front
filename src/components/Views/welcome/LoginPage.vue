<template>
    <div style="text-align: center; margin: 0 20px">
        <div style="margin-top: 150px">
            <div style="font-size: 25px; font-weight: bold;">登录</div>
            <div style="font-size: 15px; color: gray">在进入系统之前，请输入用户名和密码进行登录</div>
        </div>
        <div style="margin-top: 50px;">
            <el-form :model="form" :rules="rule" ref="formRef">
                <el-form-item prop="username">
                    <el-input v-model="form.username" type="text" placeholder="请输入用户名或邮箱">
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
                <el-row>
                    <el-col :span="12" style="text-align: left">
                        <el-form-item prop="remember">
                            <el-checkbox v-model="form.remember">记住用户名 </el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-link @click="reset">忘记密码？</el-link>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="margin-top: 40px">
            <el-button style="width: 270px" type="success" @click="userLogin" plain>立即登录</el-button>
        </div>
        <el-divider>
            <span style="font-size: 13px; color: gray">没有账号</span>
        </el-divider>
        <div style="margin-top: 40px">
            <el-button style="width: 270px" type="warning" @click="register" plain>立即注册</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { reactive, ref } from "vue";
import { User, Lock } from '@element-plus/icons-vue'
import router from "@/router";
import { login } from "@/net";

const formRef = ref();

const form = reactive({
    username: "",
    password: "",
    remember: false,
});

const rememberedUser = localStorage.getItem('rememberedUser');

if (rememberedUser) {
    const { username } = JSON.parse(rememberedUser);
    form.username = username;
    form.remember = true; 
}

const rule = {
    username: [
        { required: true, message: "请输入用户名或邮箱"},
    ],
    password: [
        { required: true, message: "请输入密码"},
    ]
}

function userLogin() {
    formRef.value.validate((valid: any) => {
        if (valid) {
            login(form.username, form.password, form.remember, () => {
                if (form.remember) {
                    localStorage.setItem('rememberedUser', JSON.stringify({ username: form.username }));
                }
                router.push("/display")
             })
        }
    })
}

function register() {
    router.push("/register")
}

function reset(){
    router.push("/reset")
}
</script>

<style scoped></style>