<template>
    <div>
        <el-button @click="userLogout">Logout</el-button>
    </div>
</template>

<script setup lang="ts">
import { logout } from "@/net";
import router from "@/router";

function userLogout() {
    logout(() => router.push("/"))
}

</script>

<style scoped></style>