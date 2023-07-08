<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item name="name" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" v-model:value="form.name"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="queryCompany()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetForm()">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary">
            <router-link :to="{ path: '/company/add' }">新建</router-link>
          </a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="logo" slot-scope="{text, record}">
            <a-avatar :src="record.logo"></a-avatar>
          </div>
          <div slot="status" slot-scope="{text, record}">
            <a-tag color="#1890ff" v-if="record.status == 0">未审核</a-tag>
            <a-tag color="#52c41a" v-else-if="record.status == 1">审核通过</a-tag>
            <a-tag color="#ff4d4f" v-else-if="record.status == 2">审核不通过</a-tag>
            <a-tag color="#faad14" v-else>未知</a-tag>
          </div>
          <div slot="action" slot-scope="{text, record}">
            <router-link :to="{ path: '/company/detail', query: { id: record.id } }">详情</router-link>
          </div>
        </standard-table>
      </div>
    </a-card>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listCompany } from '@/services/company';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'CompanyList',
  components: { StandardTable },
  data() {
    return {
      form: {
        name: ''
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
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '简称',
          dataIndex: 'shortName',
          key: 'shortName',
        },
        {
          title: 'logo',
          dataIndex: 'logo',
          key: 'logo',
          scopedSlots: { customRender: 'logo' },
        },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '联系电话',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '联系邮箱',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          customRender: (text, row, index) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
        }
      ]
    };
  },
  methods: {
    resetForm() {
      this.form = {
        name: ''
      };
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryCompany();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryCompany();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryCompany();
    },
    init() {
      this.queryCompany();
    },
    queryCompany() {
      const that = this;
      listCompany({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          that.$message.error('error code ' + r.code);
          return;
        }
        const data = r.data;
        that.list = data.records;
        that.pagination = {
          current: parseInt(data.current),
          pageSize: parseInt(data.size),
          total: parseInt(data.total)
        };
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