<template>
    <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
            <div >
                <el-input size="mini" placeholder="输入视频名称" v-model="wd" class="input-with-select">
                    <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-tree
                        :props="props"
                        lazy
                        :load="loadNode"
                        :data="searchData">
                </el-tree>
            </div>
        </el-aside>

        <el-container>
            <el-main>
                <div class="prism-player" id="player-con"></div>
            </el-main>
        </el-container>
    </el-container>
</template>

<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
</style>

<script>
    import {
        get
    } from '@/utils/request'

    export default {
        mounted() {
            this.search();
            let player = new Aliplayer({
                    "id": "player-con",
                    "source": "https:\\/\\/youku.cdn2-okzy.com\\/20210221\\/14091_6b64d87d\\/index.m3u8",
                    "width": "100%",
                    "height": "100%",
                    "autoplay": false,
                    "isLive": false,
                    "rePlay": false,
                    "playsinline": true,
                    "preload": true,
                    "controlBarVisibility": "hover",
                    "useH5Prism": true
                }, function (player) {
                    console.log("The player is created");
                }
            );
        },

        data() {
            return {
                wd: '',
                sourceUrl: '',
                searchData: [],
                props: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        methods: {
            loadNode(node, resolve) {
                if (this.searchData.length !== 0) {
                    debugger
                    if (node.level === 0) {
                        return resolve([{name: 'region'}]);
                    }
                    if (node.level === 1) return resolve(this.loadDetail(node));

                }

            },
            search() {
                get("https://api.okzy.tv/api.php/provide/vod/at/json/?wd=" + encodeURI(this.wd)).then(res => {
                    let result = res.list;
                    this.searchData = [];
                    result.forEach(item => {
                        console.log(item)
                        let data = {};
                        data.label = item.vod_name + "_" + item.type_name + "_" + item.vod_remarks;
                        data.data = item;
                        this.searchData.push(data)
                    })
                    console.log(JSON.stringify(this.searchData))
                    this.wd = '';
                })
            },
            loadDetail(node) {
                let vodId = node.data.data.vod_id;
                get("https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail&ids=" + vodId).then(res => {
                    if (res.list && res.list.length !== 0) {
                        let result = res.list[0];
                    }
                })
            }
        }
    };
</script>
<style scoped>
    @import 'https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css';

</style>
