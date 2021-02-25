<template>
    <el-container style="height: 100%;">
        <div>
            <el-input @keydown.enter.native="search" size="mini" placeholder="输入视频名称" v-model="wd"
                      class="input-with-select">
                <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-aside width="300px"
                      style="height: 100%; overflow-y: scroll;overflow-x: hidden;background-color: rgb(238, 241, 246)">
                <div>

                    <el-tree
                            v-loading="loading"
                            :props="props"
                            lazy
                            :load="loadNode"
                            @node-click="handleNodeClick"
                            :data="searchData">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span :titile="node.label">{{ node.label }}</span>
                            <span v-show="node.level > 1">
                                <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="() => copyUrl(node)">
                                复制链接
                                </el-button>
                            </span>
                     </span>
                    </el-tree>
                </div>
            </el-aside>
        </div>


        <el-container>
            <el-main>
                <div class="prism-player" id="player-con"></div>
            </el-main>
        </el-container>
    </el-container>
</template>

<style>
    .el-aside {
        color: #333;
    }
</style>

<script>
    import {
        get
    } from '@/utils/request'

    const clipboard = require('electron').clipboard
    window.player = null;
    export default {
        mounted() {
            this.search();
            // this.initPlayer();
            let _this = this;
            window.addEventListener('keydown', function (events) {
                if (window.player) {
                    let key = events.key;
                    if (key === 'ArrowRight') {
                        _this.prePlay();
                    } else if (key === 'ArrowLeft') {
                        _this.backPlay();
                    } else if (key === ' ') {
                        _this.togglePlay();
                    } else if (key === 'ArrowUp') {
                        _this.upVol();
                    } else if (key === 'ArrowDown') {
                        _this.downVol();
                    }
                }


            }, true)
        },

        data() {
            return {
                loading: true,

                wd: '',
                sourceUrl: '',
                searchData: [],
                interval: 0.05,
                props: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'leaf'
                },
                isPlay: false
            }
        },
        methods: {
            prePlay() {
                let duration = window.player.getDuration();
                if (duration) {
                    let currentTime = window.player.getCurrentTime();
                    window.player.seek(currentTime + this.interval * duration);
                }
            },
            backPlay() {
                let duration = window.player.getDuration();
                if (duration) {
                    let currentTime = window.player.getCurrentTime();
                    window.player.seek(currentTime - this.interval * duration);
                }
            },
            togglePlay() {
                if (this.isPlay) {
                    window.player.pause();
                } else {
                    window.player.play();
                }
            },
            upVol() {
                let volume = window.player.getVolume();
                if (volume + 0.1 < 1) {
                    window.player.setVolume(volume + 0.1);
                }
            },
            downVol() {
                let volume = window.player.getVolume();
                if (volume - 0.1 > 0) {
                    window.player.setVolume(volume - 0.1);
                }
            },
            initPlayer() {
                if (window.player) {
                    return;
                }
                window.player = new Aliplayer({
                        "id": "player-con",
                        "source": this.sourceUrl,
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
                    }
                );
                let _this = this;
                window.player.on('play', function (e) {
                    _this.isPlay = true;
                })
                window.player.on('pause', function (e) {
                    _this.isPlay = false;
                })
            },
            loadNode: function (node, resolve) {
                if (this.searchData.length !== 0) {
                    if (node.level === 1) {
                        let vodId = node.data.data.vod_id;
                        get("https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail&ids=" + vodId).then(res => {
                            if (res.list && res.list.length !== 0) {
                                let result = res.list[0];
                                let playUrl = result.vod_play_url;
                                let split = result.vod_play_note;
                                let array = playUrl.split(split);
                                let playListString;
                                for (let i = 0; i < array.length; i++) {
                                    if (array[i].indexOf(".m3u8") !== -1) {
                                        playListString = array[i];
                                    }
                                }
                                if (playListString) {
                                    let seasonData = [];
                                    let seasons = playListString.split("#");
                                    for (let i = 0; i < seasons.length; i++) {
                                        let season = seasons[i];
                                        let strings = season.split("$");
                                        seasonData.push({
                                            label: strings[0],
                                            leaf: true,
                                            url: strings[1]
                                        })
                                    }
                                    return resolve(seasonData);
                                }
                                return resolve([]);
                            }
                        })
                    } else {
                        return resolve([]);
                    }
                }

            },
            search() {
                this.loading = true;
                get("https://api.okzy.tv/api.php/provide/vod/at/json/?wd=" + encodeURI(this.wd)).then(res => {
                    let result = res.list;
                    this.searchData = [];
                    result.forEach(item => {
                        let data = {};
                        data.label = item.vod_name + "_" + item.vod_remarks;
                        data.data = item;
                        this.searchData.push(data)
                    })
                    this.wd = '';
                }).finally(() => {
                    this.loading = false;
                })
            },
            handleNodeClick(node) {
                if (node.leaf) {
                    this.sourceUrl = node.url;
                    this.initPlayer()
                    window.player.loadByUrl(this.sourceUrl)
                }
            },
            copyUrl(node) {
                if (node.data && node.data.leaf) {
                    clipboard.writeText(node.data.url)
                    this.$message({
                        message: '复制成功',
                        duration: 600,
                        type: 'success'
                    });
                }
            }
        }
    };
</script>
<style scoped>
    @import 'https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css';

    .el-aside {
        height: 100vh;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
