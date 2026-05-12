<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <a-form >
        <a-form-item name="module" label="模块" :labelCol="{ span: 2 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="module"></a-input>
        </a-form-item>
        <a-form-item name="avatar" label="文件" :labelCol="{ span: 2 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="url" disabled placeholder="请输入" />
          <a-upload accept="*/*" :file-list="fileList" :data="{ type: 1 }" :remove="handleRemove"
            :before-upload="beforeUpload" :customRequest="customRequest">
            <a-button> <a-icon type="upload" />点击上传图片，视频，文件</a-button>
          </a-upload>
          <span>上传进度：{{ percent }}</span>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
export default {
  name: 'VoiceList',
  components: { StandardTable },
  data() {
    return {
      fileList: [],
      percent: 0,
      module: 'tool',
      url: ''
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      console.log("handle remove file", newFileList);
    },
    beforeUpload(file, fileList) {
      this.fileList = fileList;
      return true;
    },
    customRequest(data) {
      console.log(data, "==== customRequest");
      const that = this;
      const file = data.file;
      const type = data.data.type;
      console.log(type, "==== type");
      if (file) {
        if (file.name.lastIndexOf(".") < 0) {
          that.$message.error("文件格式不正确");
          return;
        }
        const ext = file.name.substring(file.name.lastIndexOf("."));
        qiniuUploadToken({ ext: ext, module: that.module }).then((res) => {
          const r = res.data;
          if (r.code !== 200) {
            return;
          }
          const data = r.data;
          console.log("upload token", data);
          const token = data.token;
          const host = data.host;
          const fileKey = data.fileKey;
          const observable = qiniu.upload(file, fileKey, token, {}, {});
          const subscription = observable.subscribe((nextRes) => {
            const total = nextRes.total;
            console.log("next", total.loaded, total.total, total.percent);
            that.percent = total.percent + "%";
          }, (err) => {
            console.log("error", err.code, err.message, err.isRequestError);
          }, (completeRes) => {
            console.log("complete", completeRes);
            that.uploadCallback(host + "/" + completeRes.key, type);
          });
        });
      } else {
        console.error('没有选择文件');
      }
    },
    uploadCallback(url, type) {
      this.url = url;
    },
    init() {
      const that = this;
      console.log('init...');
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    desc() {
      return this.$t('description');
    }
  }
};
</script>
      
<style scoped lang="less">
@import "index";

.search {
  margin-bottom: 54px;
}

.operator {
  margin-bottom: 18px;
}
</style>