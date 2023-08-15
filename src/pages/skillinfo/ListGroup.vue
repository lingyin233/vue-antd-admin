<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI">添加</a-button>
        </a-space>
        <standard-table :columns="columns" :dataSource="list" :row-key="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="action" slot-scope="{text, record}">
            <a href="javascript:void(0);" type="primary" @click="updateUI(record)" style="margin-right: 5px;">编辑</a>
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin-right: 5px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <a-modal v-model="updateUIVisible" title="添加或更新" @ok="updateUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['id']" disabled placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="groupCode" label="技能分组码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['groupCode']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="groupName" label="技能分组简述" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="updateUIForm['groupName']" placeholder="请输入"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import StandardTable from '@/components/table/StandardTable';
import { mapState } from 'vuex';
import { listSkillinfoGroup, addSkillinfoGroup, delSkillinfoGroup } from '@/services/skillinfo';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'SkillinfoGroupList',
  components: { StandardTable },
  data() {
    return {
      updateUIVisible: false,
      updateUIForm: {
        id: '',
        groupCode: '',
        groupName: '',
      },
      form: {
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
          title: '技能分组码',
          dataIndex: 'groupCode',
          key: 'groupCode',
        },
        {
          title: '技能分组简述',
          dataIndex: 'groupName',
          key: 'groupName',
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          customRender: (text, row, index) => {
            return moment(text).format('YYYY-MM-DD HH:mm');
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ]
    };
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.queryList();
    },
    showSizeChange(current, size) {
      console.log('current=', current, 'size=', size);
      this.pageSize = size;
      this.queryList();
    },
    changePage(page, pageSize) {
      console.log('page=', page, 'pageSize=', pageSize);
      this.queryList();
    },
    init() {
      this.queryList();
    },
    queryList() {
      const that = this;
      listSkillinfoGroup({}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        const data = r.data;
        that.list = data.records;
        that.pagination = {
          total: parseInt(data.total),
          current: parseInt(data.current),
          pageSize: parseInt(data.size),
        };
      });
    },
    updateUI(record) {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.fileList = [];
      that.$util.extend(true, that.updateUIForm, record);
      that.updateUIVisible = true;
    },
    updateUIOk() {
      const that = this;
      addSkillinfoGroup({...that.updateUIForm}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.queryList();
          that.updateUIVisible = false;
          that.addUIVisible = false;
        });
      });
    },
    addUI() {
      const that = this;
      that.$util.clearObject(that.updateUIForm, true);
      that.fileList = [];
      that.updateUIVisible = true;
    },
    del(record) {
      const that = this;
      delSkillinfoGroup({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.updateUIVisible = false;
          that.queryList();
        });
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