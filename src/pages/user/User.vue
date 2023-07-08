<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <a-form layout="horizontal" :model="form">
        <div class="">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="username" label="用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入" v-model:value="form.username"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: left; margin-top: 3px;">
          <a-button type="primary" @click="queryListUser()">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetForm()">重置</a-button>
        </span>
      </a-form>

      <standard-table style="margin-top: 60px;" :columns="columns" :dataSource="list" @clear="onClear" :row-key="record => record.id"
        @change="onChange" :pagination="{ ...pagination, onChange: onPageChange }" @selectedRowChange="onSelectChange">
        <div slot="action" slot-scope="{text, record}">
          <router-link :to="{ path: '/device/list', query: { userId: record.id, appId: record.appId } }">设备</router-link>
        </div>
      </standard-table>
    </a-card>
  </div>
</template>
  
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listUser } from '@/services/user';
export default {
  name: 'User',
  components: { StandardTable },
  data() {
    return {
      form: {
        username: ''
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
          title: 'APP ID',
          dataIndex: 'appId',
          key: 'appId',
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
        username: ''
      };
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryListUser();
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行');
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头');
    },
    onChange() {
      this.$message.info('表格状态改变了');
    },
    onSelectChange() {
      this.$message.info('选中行改变了');
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryListUser();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryListUser();
    },
    init() {
      this.queryListUser();
    },
    queryListUser() {
      const that = this;
      listUser({ current: that.current, size: that.pageSize, ...that.form }).then((res) => {
        const r = res.data;
        const data = r.data;
        that.list = data.records;
        that.pagination = {
          current: parseInt(data.current),
          pageSize: parseInt(data.size),
          total: parseInt(data.total)
        };
      });
    },
    edit(record) {
      console.log('record=', record);
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
</style>