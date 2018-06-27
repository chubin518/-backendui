<template>
    <div>
        <script id="editor" type="text/plain"></script>
    </div>
</template>
<script>
import '../../static/ueditor/ueditor.parse.min.js'
import '../../static/ueditor/ueditor.config.js'
import '../../static/ueditor/ueditor.all.min.js'
import '../../static/ueditor/lang/zh-cn/zh-cn.js'
export default {
    props: {
        id: {
            type: String
        },
        config: {
            type: Object,
            default() {
                return {
                    initialFrameWidth: null,
                    initialFrameHeight: 450
                }
            }
        },
        content: {
            type: String,
            required: true,
            default: ''
        }
    },
    data() {
        return {
            editor: null,
            isready: false
        }
    },
    mounted() {
        this.initEditor();
    },
    destoryed() {
        this.editor.destory();
    },
    watch: {
        content(val, old) {
            if (val != old) {
                this.setContent(val);
            }
        }
    },
    methods: {
        /**
         * 初始化ueeditor
         */
        initEditor() {
            //初始化UE
            const that = this;
            this.editor = UE.delEditor("editor");
            this.editor = UE.getEditor('editor', this.config);
            this.editor.addListener("ready", function () {
                that.isready = true;
                that.editor.setContent(that.content); // 确保UE加载完成后，放入内容。
            });
            //编辑器内容发生改变时会触发该事件
            that.editor.addListener("contentChange", function () {
                that.$emit("update:content", that.editor.getContent());
                // console.log('内容改变:' + that.editor.getContent());
            });
            that.editor.addListener('destroy', function () {
                that.isready = false;
            });
        },
        getContent() {
            return this.editor.getContent();
        },
        getContentTxt() {
            return this.editor.getContentTxt();
        },
        setContent(val) {
            var that = this;
            that.$emit("update:content", val);
            if (!that.editor) {
                that.initEditor();
            } else {
                if (that.isready === true) {
                    that.editor.setContent(val);
                }
            }
        },
    }
}
</script>
