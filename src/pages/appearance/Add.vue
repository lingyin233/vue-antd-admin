<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :title="title">
      <a-form>
        <a-form-item label="角色" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.roleId" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="名称" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.name" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="性别" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-select v-model:value="form['gender']" placeholder="请选择" :options="genderList">
          </a-select>
        </a-form-item>
        <a-form-item label="类型" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-select v-model:value="form.type" placeholder="请选择" :options="typeList">
          </a-select>
        </a-form-item>
        <a-form-item label="资源包" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.infoUrl" disabled placeholder="请输入" />
          <a-upload accept=".zip" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload"
            :customRequest="customRequest">
            <a-button> <a-icon type="upload" /> 点击上传文件（仅支持zip格式）</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item style="margin-top: 24px" :wrapperCol="{ span: 12, offset: 2 }">
          <a-button type="primary" @click="saveAppearance()">保存</a-button>
          <a-button type="default" style="margin-left: 8px" @click="$router.go(-1)">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
        
<script>
import { mapState } from 'vuex';
import { addAppearance } from '@/services/appearance';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'AppearanceAdd',
  data() {
    return {
      title: '添加个人形象',
      form: {
        roleId: '',
        name: '',
        gender: '',
        infoUrl: '',
        type: '',
      },
      typeList: [
        {
          value: '0',
          label: '默认'
        }
      ],
      module: 'appearance2',
      fileList: [],
      genderList: [
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        }
      ]
    };
  },
  methods: {
    init() {

    },
    saveAppearance() {
      const that = this;
      addAppearance({...that.form}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        const data = r.data;
        that.$message.success("保存成功", 1.5, () => {
          that.$router.push("/appearance/list");
        });
      });
    },
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
      const that = this;
      const file = data.file;
      if (file) {
        if (file.name.lastIndexOf(".") < 0) {
          that.$message.error("文件格式不正确");
          return;
        }
        const ext = file.name.substring(file.name.lastIndexOf("."));
        qiniuUploadToken({ext: ext, module: that.module}).then((res) => {
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
          }, (err) => {
            console.log("error", err.code, err.message, err.isRequestError);
          }, (completeRes) => {
            console.log("complete", completeRes);
            that.uploadCallback(host + "/" + completeRes.key);
          });
        });
      } else {
        console.error('没有选择文件');
      }
    },
    uploadCallback(url) {
      this.form.infoUrl = url;
    },
  },
  created() {
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
</style>