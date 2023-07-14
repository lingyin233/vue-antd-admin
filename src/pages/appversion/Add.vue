<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card :title="title">
      <a-form>
        <a-form-item label="APP包名" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.pkgName" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="APP类型" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-select v-model:value="form['appType']" placeholder="请选择" :options="appTypeList">
          </a-select>
        </a-form-item>
        <a-form-item label="APP版本" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-input v-model:value="form.appVersion" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="是否强制升级" :labelCol="{ span: 2 }" :wrapperCol="{ span: 12 }">
          <a-select v-model:value="form['forced']" placeholder="请选择" :options="forcedList">
          </a-select>
        </a-form-item>
        <a-form-item style="margin-top: 24px" :wrapperCol="{ span: 12, offset: 2 }">
          <a-button type="primary" @click="saveAppVersion()">保存</a-button>
          <a-button type="default" style="margin-left: 8px" @click="$router.go(-1)">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
        
<script>
import { mapState } from 'vuex';
import { addAppVersion } from '@/services/appversion';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'CompanyAdd',
  data() {
    return {
      title: '添加APP版本',
      form: {
        pkgName: '',
        appType: '',
        appVersion: '',
        forced: '',
      },
      appTypeList: [
        {
          value: 'IOS',
          label: 'IOS'
        },
        {
          value: 'ANDROID',
          label: 'ANDROID'
        },
        {
          value: 'FIRMWARE',
          label: 'FIRMWARE'
        }
      ],
      forcedList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ]
    };
  },
  methods: {
    init() {

    },
    saveAppVersion() {
      const that = this;
      addAppVersion({...that.form}).then((res) => {
        const r = res.data;
        if (r.code === 200) {
          that.$message.success('添加成功', 1.5, () => {
            that.$router.go(-1);
          });
        }
      });
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