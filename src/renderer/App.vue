<template>
    <div id="app" >
        <router-view  v-if="isRouterAlive" style="height: 100%;"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'OnlinePlayer',
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true,
            }
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true;
                })
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
