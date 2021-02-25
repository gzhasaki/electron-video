<template>
    <div id="app">
        <header class="header">
            <el-row>
                <el-col :span="18">
                    <div class="title" style="font-size: 14px;
                                             padding-left: 5px;">OnlinePlayer</div>
                </el-col>
                <el-col :span="6">
                    <div class="systemTool">
                        <el-button class="button" icon="el-icon-setting" @click="tabPane = 'setting'"></el-button>
                        <el-button class="button" icon="el-icon-close" @click="clickClose"></el-button>
                    </div>
                </el-col>
            </el-row>

        </header>
        <router-view style="padding-top: 35px"></router-view>
    </div>
</template>

<script>
    import Header from "./components/Header";
    const { ipcRenderer } = require('electron');
    export default {
        name: 'OnlinePlayer',
        components: {Header},
        methods: {
            clickClose() {
                if (window.player) {
                    window.player.pause();
                }
                ipcRenderer.send('hide-windows');
            }
        }
    }
</script>

<style>
    /* CSS */
    #app {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .header{
        position:fixed;
        z-index:1;
        top:0;
        width:100%;
        height: 30px;
        line-height: 30px;
    }
    .systemTool{
        position: fixed;
        right: 0;
        top: 0;
        margin-right: 0;
        -webkit-app-region: no-drag;
    }

    .systemTool .el-button{
        padding:0 !important;
        border:0 !important;
        border-radius:0 !important;
        color: #000 !important;
    }
    .systemTool .el-button:hover{
        background-color: #cccccc;
    }
    .systemTool .button{
        width: 30px;
        height: 30px;
        background-color: #00000000;
        font-size: large;
    }

    .systemTool .el-button+.el-button{
        margin-left: 0 !important;
    }
</style>
