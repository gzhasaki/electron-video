<template>
    <div>
        <MyHeader :headerTitle="title" @close-click="hideClose"></MyHeader>
        <div>
            hello world
        </div>
    </div>
</template>


<script>
    import Header from "@/components/Header";
    const {ipcRenderer} = require('electron');
    export default {
        name: 'settings',
        components: {
            MyHeader: Header
        },
        data() {
            return {
                title: '设置'
            }
        },
        methods: {
            hideClose() {
                ipcRenderer.send('hide-settings-window')
            }
        }
    }
</script>

