<template>
  <div>
    <el-upload class="avatar-uploader" action :show-file-list="false" id="uploadImg"
               :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
               v-show="false" :http-request="uploadFile">上传
    </el-upload>
    <quill-editor ref="myQuillEditor"
                  v-model="content"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @change="onEditorChange($event)"
                  @ready="onEditorReady($event)">
    </quill-editor>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.snow.css'
  import * as Quill from 'quill'; // 富文本基于quill
  import Video from '@/utils/video'; // 插入h5 video视频
  import { addFile } from '@/api/stadium';
  // import { Loading } from 'element-ui';

  Quill.register(Video, true);  // 注册video


  let uploadType = 1;
  export default {
    name: 'my-quill-editor',
    components: {
      quillEditor
    },
    data () {
      return {
        // content: '<h2>I am Example</h2>',
        editor: null,
        editorOption: {
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    uploadType = 1;
                    document.querySelector('#uploadImg .el-upload').click()
                  } else {
                    this.quill.format('image', false)
                  }
                },
                'video': function (value) {
                  if (value) {
                    uploadType = 2;
                    document.querySelector('#uploadImg .el-upload').click()
                  } else {
                    this.quill.format('video', false)
                  }
                }
              }
            }
          }
        }
      }
    },
    model:{
      prop: 'value',
      event:"change"
    },
    props: ['value'],
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      onEditorBlur(editor) {
        // console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        // console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        // console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        // console.log('editor change!', editor, html, text)
        // this.$emit('change', html);
      },
      //图片上传
      uploadFile(image){
        // let loadingInstance = Loading.service({ fullscreen: true , lock: true});
        const _self = this;
        let params = new FormData();
        params.append('file', image.file);
        addFile(params).then(_result => {
          if (_result.code === '0000' && _result.innercode === '0000') {
            let quill = _self.editor;
            let length = quill.getSelection().index;
            quill.insertEmbed(length, uploadType === 1 ?'image' : 'video', _result.message);  // 这个方法用来手动插入dom到编辑器里
            if (uploadType === 2) {
              const _video = document.getElementsByTagName("video");
              let isAndroid = _self.$is_android(); // 判断是ios还是android
              if (isAndroid) {
                _video[_video.length-1].removeAttr('controls');
                _video[_video.length-1].attr('x5-video-player-type', 'h5');
              }
            }
            quill.setSelection(length + 1);  // 这个方法可以获取光标位置
            _self.$message.success('上传成功');
          }
          else{
            _self.$message('上传失败,请重新上传')
          }
        }).finally(/*() => loadingInstance.close()*/)
      },

      handleAvatarSuccess(res, file) {
        this.dialogForm.images = URL.createObjectURL(file.raw);
      },

      //上传图片前处理图片
      beforeAvatarUpload(file) {
        const _self = this;
        const _sizeM = file.size / 1024 / 1024;
        console.log(uploadType);
        if (uploadType === 1) { // 上传图片
          if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            this.$message.error('上传格式错误，图片只支持 JPG/PNG 格式');
            return false;
          }
          if (_sizeM > 2) {
            this.$message.error('上传失败，图片不能超过2MB');
            return false;
          }
        } else { // 上传视频
          if (file.type !== 'video/mp4') {
            this.$message.error('上传格式错误，视频只支持 MP4 格式');
            return false;
          }
          if (_sizeM > 100) {
            this.$message.error('上传失败，视频不能超过100MB');
            return false;
          }
        }
        return true;
      },
      // 富文本编辑器 点击插入图片或者视频
      insertImgClick (e) {
        if (e.target.className.indexOf('icon-pic') !== -1) {
          document.getElementById('insert_image').click();
        } else if (e.target.className.indexOf('icon-video') !== -1) {
          document.getElementById('insert_video').click();
        }
      },
      // 富文本编辑器 点击插入图片或者视频上传并预览
      fileInsert (e) {
        var oFile = e.target.files[0];
        if (typeof (oFile) === 'undefined') {
          return;
        }
        let sExtensionName = oFile.name.substring(oFile.name.lastIndexOf('.') + 1).toLowerCase();   // 文件扩展名
        let sfileType = ''; // 上传文件类型
        if (e.target.id === 'insert_image') {
          sfileType = 'image'
          if (sExtensionName !== 'png' && sExtensionName !== 'jpg' && sExtensionName !== 'jpeg') {
            alert('不支持该类型图片');
            return;
          }
        }
        if (e.target.id === 'insert_video') {
          sfileType = 'video';
          if (sExtensionName !== 'mp4' && sExtensionName !== 'avi' && sExtensionName !== 'mov') {
            alert('不支持该类型视频');
            return;
          }
          let maxSize = 100*1024*1024;    // 100MB
          if (oFile.size > maxSize) {
            alert('上传视频大小不能超过100MB');
            return;
          }
        }
        const _video = $('video');
        const _self = this;
        this.uploadImage(oFile, msg => {
          _self.editor.insertEmbed(_self.editor.selection.savedRange.index, sfileType, msg);  // 这个方法用来手动插入dom到编辑器里
          let isAndroid = _self.$is_android(); // 判断是ios还是android
          if (isAndroid) {
            _video.removeAttr('controls');
            _video.attr('x5-video-player-type', 'h5');
          }
          _self.editor.setSelection(_self.editor.selection.savedRange.index + 1);  // 这个方法可以获取光标位置
        });
      },
    },
    computed: {
      content: {
        get() {
          return this.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      },
    },
    mounted() {
      this.editor = this.$refs.myQuillEditor.quill;
    }
  }
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ]
</script>

<style scoped lang="scss">

</style>
