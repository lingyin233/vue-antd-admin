<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <a-card>
      <div class="search">
        <a-form layout="horizontal" :model="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item name="companyId" label="公司ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <company-select v-model:value="form['companyId']" placeholder="请输入"></company-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="margin-top: 3px;">
            <a-button type="primary" @click="queryList()">查询</a-button>
            <a-button style="margin-left: 8px" @click="$util.clearObject(form, true)">重置</a-button>
          </span>
        </a-form>
      </div>
      <div style="margin-top: 50px;">
        <a-space class="operator">
          <a-button type="primary" @click="addUI">添加</a-button>
        </a-space>
        
        <a-table :columns="columns" :data-source="list" :rowKey="record => record.id"
          :pagination="{ ...pagination, onChange: onPageChange }">
          <div slot="action" slot-scope="text, record">
            <!--
            <a-popconfirm title="确认删除？" @confirm="del(record)" style="margin: 2px;">
              <a href="javascript:void(0);" type="primary">删除</a>
            </a-popconfirm>
            -->
          </div>
        </a-table>

      </div>
    </a-card>
    <a-modal v-model="addUIVisible" title="添加或更新" @ok="addUIOk" :maskClosable="false">
      <a-form>
        <a-form-item name="id" label="ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="addUIForm['id']" :disabled="true" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="companyId" label="公司ID" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <company-select v-model:value="addUIForm['companyId']" placeholder="请输入"></company-select>
        </a-form-item>
        <a-form-item name="groupCode" label="分组编号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="addUIForm['groupCode']" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item name="groupName" label="分组名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input v-model:value="addUIForm['groupName']" placeholder="请输入"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
      
<script>
import { mapState } from 'vuex';
import { listSerialGroup, delSerialGroup, addSerialGroup } from '@/services/serialgroup';
import CompanySelect from '@/components/obx/CompanySelect';
import { listCompany } from '@/services/company';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
export default {
  name: 'SerialGroupList',
  components: { CompanySelect },
  data() {
    return {
      addUIVisible: false,
      addUIForm: {
        companyId: '',
        groupCode: '',
        groupName: '',
      },
      companyList: [],
      companyListQuery: {
        current: 1,
        size: 200,
      },
      endOpen: false,
      form: {
        id: '',
        companyId: '',
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
          title: '厂商ID',
          dataIndex: 'companyId',
          key: 'companyId',
        },
        {
          title: '厂商名称',
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {
          title: '分组编号',
          dataIndex: 'groupCode',
          key: 'groupCode',
        },
        {
          title: '分组名称',
          dataIndex: 'groupName',
          key: 'groupName',
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
      listSerialGroup({ current: that.pagination.current, size: that.pagination.pageSize, ...that.form }).then((res) => {
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
    addUI() {
      const that = this;
      that.addUIVisible = true;
    },
    addUIOk() {
      const that = this;
      addSerialGroup({ ...that.addUIForm }).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('操作成功', 1.5, () => {
          that.init();
          that.addUIVisible = false;
        });
      });
    },
    del(record) {
      const that = this;
      delSerialGroup({id: record.id}).then((res) => {
        const r = res.data;
        if (r.code !== 200) {
          return;
        }
        that.$message.success('删除成功', 1, () => {
          that.init();
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
  },
  watch: {
    'addUIForm.companyId': (newValue, oldValue) => {
      
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