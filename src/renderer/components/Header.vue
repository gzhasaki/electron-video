<template>
    <header class="header" style="-webkit-app-region: drag">
        <el-row>
            <el-col :span="18">
                <div class="title" style="font-size: 14px;
                                             padding-left: 5px;">{{headerTitle}}
                </div>
            </el-col>
            <el-col :span="6">
                <div class="systemTool">
                    <el-button v-if="showSettings" class="button" icon="el-icon-setting"
                               @click="openNewWindow('#/settings')"></el-button>
                    <el-button class="button" icon="el-icon-close" @click="close"></el-button>
                </div>
            </el-col>
        </el-row>
    </header>
</template>
<script>
    const {ipcRenderer} = require('electron');
    export default {
        props: {
            showSettings: {
                type: Boolean,
                default: false
            },
            headerTitle: {
                type: String,
                default: 'OnlinePlayer'
            }
        },
        mounted() {
        },
        methods: {
            openNewWindow(src) {
                // window.open("https://www.baidu.com")
                ipcRenderer.send('open-new-window', {routerName: src});
            },
            close() {
                this.$emit('close-click')
            }
        }
    }
</script>
<style lang="scss">
    .header {
        span {
            font-size: 20px;
            margin-right: 20px;
            color: red;
        }
    }
</style>
