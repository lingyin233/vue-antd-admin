<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-space class="operator">
      <a-button type="primary" @click="$router.go(-1)">
        返回
      </a-button>
    </a-space>
    <a-card :title="title">
      <a-form>
        <a-form-item label="用户名" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.username" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="密码" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input-password v-model:value="form.password" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="状态" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-select v-model:value="form['status']" placeholder="请选择" :options="statusList">
          </a-select>
        </a-form-item>
        <a-form-item label="名称" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.name" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="简称" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.shortName" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="logo" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.logo" disabled placeholder="请输入" />
          <a-upload accept="image/*" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload"
            :customRequest="customRequest">
            <a-button> <a-icon type="upload" /> 点击上传文件</a-button>
          </a-upload>
          <span>{{ percent }}</span>
        </a-form-item>
        <a-form-item label="地址" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.address" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="简介" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-textarea v-model:value="form.introduction" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="联系电话" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.mobile" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="联系邮箱" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.email" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="公司代号" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.code" placeholder="请输入" />
        </a-form-item>
        <a-form-item style="margin-top: 24px" :wrapperCol="{ span: 12, offset: 2 }">
          <a-button type="primary" @click="saveCompany()">保存</a-button>
          <a-button type="default" style="margin-left: 8px" @click="$router.go(-1)">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
        
<script>
import { mapState } from 'vuex';
import { addCompany } from '@/services/company';
import { qiniuUploadToken } from '@/services/common';
import * as qiniu from 'qiniu-js';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'CompanyAdd',
  data() {
    return {
      title: '添加OEM厂商',
      form: {
        username: null,
        password: null,
        status: 1,
        name: null,
        shortName: null,
        logo: null,
        address: null,
        introduction: null,
        mobile: null,
        email: null,
      },
      statusList: [
        { value: 0, label: '未审核' },
        { value: 1, label: '审核通过' },
        { value: 2, label: '审核不通过' },
      ],
      module: 'company',
      fileList: [],
      percent: 0,
    };
  },
  methods: {
    init() {

    },
    saveCompany() {
      const that = this;
      addCompany({...that.form}).then((res) => {
        const r = res.data;
        if (r.code === 200) {
          that.$message.success('添加成功', 1.5, () => {
            that.$router.push('/company/list');
          });
        }
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
            that.percent = total.percent + "%";
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
      this.form.logo = url;
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
.operator {
  margin-bottom: 18px;
}
</style>