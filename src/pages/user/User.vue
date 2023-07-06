<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <a-form layout="horizontal">
        <div class="">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input :value="form.username" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: left; margin-top: 3px;">
          <a-button type="primary" @click="queryListUser()">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetForm()">重置</a-button>
        </span>
      </a-form>
      <a-table :data-source="list" :columns="columns" :row-key="record => record.id" style="margin-top: 50px;">
        <template slot="action" slot-scope="text, record">
          <a slot="action" href="javascript:void(0);" @click="edit(record)">edit</a>
        </template>
      </a-table>
      <a-pagination style="margin-top: 5px;" :current="current" :page-size="pageSize" :page-size-options="pageSizeOptions"
        :total="total" show-size-changer @showSizeChange="showSizeChange" @change="changePage">
        <template #buildOptionText="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </a-card>
  </div>
</template>
  
<script>
import { mapState } from 'vuex';
import { listUser } from '@/services/user';
export default {
  name: 'User',
  data() {
    return {
      form: {
        username: ''
      },
      current: 1,
      pageSize: 10,
      pageSizeOptions: ['10', '20'],
      total: 0,
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
      this.form = {};
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
        console.log('listUser=', res.data);
        const r = res.data;
        if (r.code !== 200) {
          that.$message.error('error code ' + r.code);
          return;
        }
        const data = r.data;
        that.current = parseInt(data.current);
        that.total = parseInt(data.total);
        that.pageSize = parseInt(data.size);
        that.list = data.records;
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