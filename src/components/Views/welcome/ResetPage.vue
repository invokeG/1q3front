<template>
    <div style="text-align: center;">
        <div style="margin-top: 30px;">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step title="验证电子邮箱" />
                <el-step title="重新设定密码" />
                <el-step title="更改完成" />
            </el-steps>
        </div>
        <div style="margin: 0 30px;" v-if="active === 0">
            <div style="margin-top: 80px;">
                <div style="font-size: 25px; font-weight: bold">重置密码</div>
                <div style="font-size: 14px; font-weight: bold; color: grey;">请输入需要重置密码的电子邮件地址</div>
            </div>
            <div style="margin-top: 80px;">
                <el-form :model="form" :rules="rule" ref="formRef">
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
                                <el-button type="success" @click="handleAskCode" :disabled="!isEmailValid || coldTime">
                                    {{ coldTime > 0 ? `请稍后，${coldTime} 秒` : '获取验证码' }}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 20px;">
                <el-button style="width: 270px;" type="warning" @click="confirmReset" plain>确认提交</el-button>
            </div>
        </div>
        <div style="margin: 0 30px;" v-if="active === 1">
            <div style="margin-top: 80px;">
                <div style="font-size: 25px; font-weight: bold">重置密码</div>
                <div style="font-size: 14px; font-weight: bold; color: grey;">请输入新密码</div>
            </div>
            <div style="margin-top: 80px;">
                <el-form :model="form" :rules="rule" ref="formRef">
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
                </el-form>
            </div>
            <div style="margin-top: 20px;">
                <el-button style="width: 270px;" type="danger" @click="doReset" plain>确认重置密码</el-button>
            </div>
        </div>
        <div style="margin: 0 30px;" v-if="active === 2">
            <div style="margin-top: 80px;">
                <div style="font-size: 25px; font-weight: bold; color: green;">完成</div>
                <div style="font-size: 14px; font-weight: bold; color: grey;">还有{{ countdown }}秒中后跳转</div>
            </div>
            <div>
                <el-link @click="router.push('/')">立即跳转</el-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch  } from "vue";
import { Message, EditPen } from '@element-plus/icons-vue';
import { post, askCode } from '@/net';
import { validatePassword } from '@/utils/util';
import { ElMessage } from 'element-plus';
import router from '@/router';

const active = ref(0);

const formRef = ref();

const countdown = ref(3);

const form = reactive({
    email: "",
    code: "",
    password: "",
    password_repeat: "",
});

const coldTime = ref(0);

onMounted(() => {
  watch(active, (value) => {
    if (value === 2) {
      startCountdown();
    }
  });
});


const isEmailValid = computed(() => {
    return /^[\w.-]+@[\w.-]+\.\w+$/.test(form.email);
})

const rule = {
    password: [
        { required: true, message: "请输入密码", trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: ['blur', 'change'] }
    ],
    password_repeat: [
        { validator: (rule, value, callback) => validatePassword(rule, value, callback, form), trigger: ['blur', 'change'] },
    ],
    email: [
        { required: true, message: '请输入邮件地址', trigger: 'blur' },
        { type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入获取的验证码', trigger: 'blur' },
    ],
}

const handleAskCode = () => {
    askCode(form.email, coldTime)
}

function confirmReset() {
    formRef.value.validate((valid: any) => {
        if (valid) {
            post(`/api/auth/reset-confirm`, { 
                email: form.email,
                code: form.code
             }, () => {
                active.value ++;
            })
        }
    })
}

function doReset() {
    formRef.value.validate((valid: any) => {
        if (valid) {
            post(`/api/auth/reset-password`, {...form}, () => {
                ElMessage.success('密码重置成功，请登录');
                active.value ++;
            })
        }
    })
}

function startCountdown(){
    const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      router.push("/");
    }
  }, 1000);
}

</script>

<style scoped></style>