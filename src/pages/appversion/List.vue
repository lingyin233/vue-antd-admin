<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="pkgName" label="APP包名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" v-model:value="form.pkgName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item name="appType" label="APP类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" v-model:value="form.appType"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="queryAppVersion()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm()">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary">
            <router-link :to="{ path: '/appversion/add' }">新建</router-link>
          </a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="forced" slot-scope="{text, record}">
            <a-tag color="#1890ff" v-if="record.forced == 0">否</a-tag>
            <a-tag color="#52c41a" v-else-if="record.forced == 1">是</a-tag>
          </div>
        </standard-table>
      </div>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listAppVersion } from '@/services/appversion';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'CompanyList',
  components: { StandardTable },
  data() {
    return {
      form: {
        pkgName: '',
        appType: '',
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'APP包名',
          dataIndex: 'pkgName',
          key: 'pkgName',
        },
        {
          title: 'APP类型',
          dataIndex: 'appType',
          key: 'appType',
        },
        {
          title: 'APP版本号',
          dataIndex: 'appVersion',
          key: 'appVersion',
        },
        {
          title: '强制升级',
          dataIndex: 'forced',
          key: 'forced',
          scopedSlots: { customRender: 'forced' },
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          customRender: (text, row, index) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          }
        }
      ]
    };
  },
  methods: {
    resetForm() {
      this.form = {
        pkgName: '',
        appType: '',
      };
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryAppVersion();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryAppVersion();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryAppVersion();
    },
    init() {
      this.queryAppVersion();
    },
    queryAppVersion() {
      const that = this;
      listAppVersion({current: that.pagination.current, size: that.pagination.pageSize, ...that.form}).then((res) => {
        const r = res.data;
        if (r.code === 200) {
          const data = r.data;
          that.list = data.records;
          that.pagination = {
            current: parseInt(data.current),
            pageSize: parseInt(data.size),
            total: parseInt(data.total),
          };
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

.search {
  margin-bottom: 54px;
}

.operator {
  margin-bottom: 18px;
}
</style>