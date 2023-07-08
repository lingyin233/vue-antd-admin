<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :title="title">
      <a-form>
        <a-form-item label="ID" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.id" :disabled="true" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="用户名" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.username" :disabled="true" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="密码" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input-password v-model:value="form.password" placeholder="密码为空表示不修改密码" />
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
          <a-input v-model:value="form.logo" placeholder="请输入" />
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
        <a-form-item style="margin-top: 24px" :wrapperCol="{ span: 12, offset: 2 }">
          <a-button type="primary" @click="updateCompany()">更新</a-button>
          <a-button type="default" style="margin-left: 8px" @click="$router.go(-1)">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
          
<script>
import { mapState } from 'vuex';
import { getCompany, addCompany } from '@/services/company';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'CompanyDetail',
  data() {
    return {
      title: '查看OEM厂商',
      form: {
        id: null,
        username: null,
        password: null,
        status: null,
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
      ]
    };
  },
  methods: {
    init() {
      this.queryCompany();
    },
    queryCompany() {
      const that = this;
      getCompany({ id: that.$route.query.id }).then((res) => {
        const r = res.data;
        that.form = r.data;
      });
    },
    updateCompany() {
      const that = this;
      addCompany({ ...that.form }).then((res) => {
        const r = res.data;
        if (r.code === 200) {
          that.$message.success('更新成功', 1.5, () => {
            that.$router.push('/company/list');
          });
        }
      });
    }
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