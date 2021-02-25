<template>
    <div>
        <el-row>
            <el-col :span="14" height='50px'>
                <div class="title">{{'M3U8-Downloader v'}}</div>
            </el-col>
        </el-row>
        <div class="header">
            <span class="el-icon-minus" @click="minimizeWin"></span>
            <span class="el-icon-full-screen" @click="maximizeWin"></span>
            <span class="el-icon-close" @click="closeWin"></span>
        </div>
    </div>
</template>
<script>
    import { remote } from 'electron';
    export default {
        methods: {
            minimizeWin(){
                remote.getCurrentWindow().minimize(); // 窗口最小化
            },
            maximizeWin(){
                const win=remote.getCurrentWindow();
                if(win.isMaximized()){ // 判断 窗口是否已最大化
                    win.restore();// 恢复原窗口大小
                }else{
                    win.maximize();  //最大化窗口
                }
            },
            closeWin(){
                remote.getCurrentWindow().close(); // 关闭窗口，也结束了所有进程
            }
        }
    }
</script>
<style lang="scss">
    .header{
        span{
            font-size:20px;
            margin-right:20px;
            color:red;
        }
    }
</style>
